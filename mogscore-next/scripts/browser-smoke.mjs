import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const edge = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3128'
const fixture = new URL('../docs/seo-ad-rebuild/fixtures/synthetic-adult-face.png', import.meta.url).pathname.replace(/^\/(.:)/, '$1')
const multipleFixture = new URL('../docs/seo-ad-rebuild/fixtures/synthetic-two-adults.png', import.meta.url).pathname.replace(/^\/(.:)/, '$1')
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'omoggle-edge-smoke-'))
const downloads = new URL('../docs/seo-ad-rebuild/browser-downloads', import.meta.url).pathname.replace(/^\/(.:)/, '$1')
await fs.mkdir(downloads, { recursive: true })

const debugPort = 9400 + Math.floor(Math.random() * 300)
const browser = spawn(edge, ['--headless=new', '--disable-gpu', '--no-first-run', '--disable-background-networking', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
browser.unref()
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function endpoint(path) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { const response = await fetch(`http://127.0.0.1:${debugPort}${path}`, path.startsWith('/json/new') ? { method: 'PUT' } : undefined); if (response.ok) return response.json() } catch {}
    await delay(100)
  }
  throw new Error('Edge debugging endpoint did not start')
}

try {
  const target = await endpoint(`/json/new?${encodeURIComponent(`${origin}/tools`)}`)
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  let sequence = 0
  const pending = new Map()
  const networkRequests = []
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Network.requestWillBeSent') networkRequests.push(message.params.request.url)
    if (!message.id) return
    const item = pending.get(message.id); if (!item) return
    pending.delete(message.id)
    if (message.error) item.reject(new Error(message.error.message)); else item.resolve(message.result)
  })
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  })
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value
  const navigate = async (path, width) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width < 600 ? 844 : 1000, deviceScaleFactor: 1, mobile: width < 600 })
    await send('Page.navigate', { url: `${origin}${path}` }); await delay(800)
    return evaluate(`({path:location.pathname,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.textContent,overflowing:[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,cls:e.className||'',right:Math.round(e.getBoundingClientRect().right),left:Math.round(e.getBoundingClientRect().left),client:e.clientWidth,scroll:e.scrollWidth})).filter(x=>x.right>innerWidth+1||x.left< -1||x.scroll>x.client+1).slice(0,8)})`)
  }
  await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable'); await send('Network.enable')
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads })

  const layouts = []
  for (const [path, width] of [['/tools', 390], ['/omoggle-practice-test', 768], ['/', 1440]]) layouts.push(await navigate(path, width))
  for (const layout of layouts) if (layout.scrollWidth > layout.clientWidth || layout.overflowing.length) throw new Error(`horizontal overflow on ${layout.path}: ${JSON.stringify(layout.overflowing)}`)

  await navigate('/tools', 390)
  const documentNode = await send('DOM.getDocument', { depth: -1, pierce: true })
  const input = await send('DOM.querySelector', { nodeId: documentNode.root.nodeId, selector: 'input[type=file]' })
  await send('DOM.setFileInputFiles', { nodeId: input.nodeId, files: [fixture] })
  await evaluate(`document.querySelector('input[type=file]').dispatchEvent(new Event('change',{bubbles:true}))`)
  await delay(400)
  await evaluate(`document.querySelector('.photo-consent input').click(); [...document.querySelectorAll('button')].find(b=>b.textContent.includes('Analyze Locally')).click()`)
  let completed = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    completed = await evaluate(`Boolean(document.querySelector('.rating-results'))`)
    if (completed) break
    const error = await evaluate(`document.querySelector('[role=alert]')?.textContent || ''`)
    if (error) throw new Error(`tool error: ${error}`)
    await delay(250)
  }
  if (!completed) throw new Error('real local model inference did not complete in 30 seconds')
  const result = await evaluate(`({score:document.querySelector('.score-big')?.textContent,diagnostics:document.querySelectorAll('.diagnostic-item').length,resources:performance.getEntriesByType('resource').map(r=>r.name)})`)
  if (!result.score || result.diagnostics < 3) throw new Error('result UI is incomplete')
  const observedRequests = [...networkRequests, ...result.resources]
  if (observedRequests.some(url => /gptsapi|googlesyndication|googletagmanager|adsterra/i.test(url))) throw new Error('sensitive tool loaded a prohibited third party')
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Download Photo-Free Result Card')).click()`)
  await delay(800)
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Test Another Photo')).click()`)
  const nextDocument = await send('DOM.getDocument', { depth: -1, pierce: true })
  const nextInput = await send('DOM.querySelector', { nodeId: nextDocument.root.nodeId, selector: 'input[type=file]' })
  await send('DOM.setFileInputFiles', { nodeId: nextInput.nodeId, files: [multipleFixture] })
  await evaluate(`document.querySelector('input[type=file]').dispatchEvent(new Event('change',{bubbles:true}))`)
  await delay(300)
  await evaluate(`document.querySelector('.photo-consent input').click(); [...document.querySelectorAll('button')].find(b=>b.textContent.includes('Analyze Locally')).click()`)
  let multipleRejected = false
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const message = await evaluate(`document.querySelector('[role=alert]')?.textContent || ''`)
    if (message.includes('More than one face')) { multipleRejected = true; break }
    await delay(250)
  }
  if (!multipleRejected) throw new Error('multiple-face image was not rejected')
  console.log(JSON.stringify({ browser: 'Microsoft Edge Chromium headless', layouts, inference: { completed, scorePresent: Boolean(result.score), diagnostics: result.diagnostics, modelExecuted: true, multipleFaceRejected: true, prohibitedPageRequests: 0 }, shareCardActionCompletedWithoutPageError: true }, null, 2))
  send('Browser.close').catch(() => {})
  socket.close()
} finally {
  browser.kill()
  await delay(300)
  await fs.rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {})
}
