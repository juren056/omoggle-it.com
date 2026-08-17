'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import TosModal from './TosModal'

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif'])

function track(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params)
}

function compressImage(dataUrl, maxKB = 1200) {
  return new Promise(resolve => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      let width = image.width
      let height = image.height
      const maxPixels = 1280
      if (width > maxPixels || height > maxPixels) {
        if (width > height) { height = Math.round(height * maxPixels / width); width = maxPixels }
        else { width = Math.round(width * maxPixels / height); height = maxPixels }
      }
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      context.fillStyle = '#fff'
      context.fillRect(0, 0, width, height)
      context.drawImage(image, 0, 0, width, height)
      let quality = 0.88
      let result = canvas.toDataURL('image/jpeg', quality)
      while (result.length > maxKB * 1024 * 1.37 && quality > 0.55) {
        quality -= 0.05
        result = canvas.toDataURL('image/jpeg', quality)
      }
      resolve(result.split(',')[1])
    }
    image.onerror = () => resolve(dataUrl.split(',')[1])
    image.src = dataUrl
  })
}

function metricScore(results, name) {
  return Number(results.metrics?.find(metric => metric.name === name)?.score || 0)
}

function pslMetrics(results) {
  const symmetry = metricScore(results, 'Facial Symmetry')
  const jawline = metricScore(results, 'Jawline Definition')
  const eyeArea = metricScore(results, 'Canthal Tilt')
  const cheekbones = metricScore(results, 'Cheekbone Prominence')
  const skin = metricScore(results, 'Skin Clarity')
  const harmony = metricScore(results, 'Overall Harmony')
  return [
    ['Facial Symmetry', symmetry],
    ['Jawline', jawline],
    ['Eye Area', eyeArea],
    ['Midface', (cheekbones + harmony) / 2],
    ['Facial Proportions', harmony],
    ['Skin', skin],
    ['Harmony', Number(results.overall)],
  ]
}

function strength(score) {
  if (score >= 7.5) return 'Strong'
  if (score >= 6.25) return 'Above Average'
  if (score >= 5) return 'Balanced'
  return 'Developing'
}

export default function FaceRatingTool({ variant = 'psl' }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const isPsl = variant === 'psl'
  const eventPrefix = isPsl ? 'psl_test' : 'mog_test'

  async function selectFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!ACCEPTED_TYPES.has(file.type)) { setError('Choose a JPEG, PNG, WebP, HEIC or AVIF image.'); return }
    if (file.size > 12 * 1024 * 1024) { setError('Choose an image smaller than 12 MB.'); return }
    const reader = new FileReader()
    reader.onload = async loadEvent => {
      const dataUrl = loadEvent.target.result
      setPreview(dataUrl)
      setImageBase64(await compressImage(dataUrl))
      setResults(null)
      setStatus('ready')
      setError('')
      track('face_upload', { tool: variant })
    }
    reader.onerror = () => setError('The image could not be read. Try another file.')
    reader.readAsDataURL(file)
  }

  async function analyze() {
    if (!imageBase64 || status === 'loading') return
    setStatus('loading')
    setError('')
    track(`${eventPrefix}_start`)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'analyze' }),
      })
      const data = await response.json()
      if (!response.ok || data.error) throw new Error(data.error || 'Analysis failed')
      setResults(data.result)
      setStatus('done')
      track(`${eventPrefix}_complete`, { score: Number(data.result.overall) })
    } catch (requestError) {
      const messages = {
        rate_limit_exceeded: 'Your daily analysis limit has been reached.',
        too_many_requests: 'Too many requests. Wait one minute and try again.',
        no_face: 'No clear face was detected. Use a front-facing photo.',
        inappropriate_image: 'Use a clear, appropriate photo of an adult face.',
      }
      setError(messages[requestError.message] || 'Analysis failed. Please try again.')
      setStatus('ready')
    }
  }

  function reset() {
    setPreview('')
    setImageBase64('')
    setResults(null)
    setError('')
    setStatus('idle')
    inputRef.current?.click()
  }

  async function share() {
    const score = Number(results?.overall).toFixed(1)
    const text = isPsl ? `My entertainment-only PSL score is ${score}/10.` : `My Mog Score is ${score}/10.`
    const shareData = { title: isPsl ? 'My PSL Test Result' : 'My Mog Score', text, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else await navigator.clipboard.writeText(`${text} ${window.location.href}`)
      track('share_result', { tool: variant, score })
    } catch {
      // A canceled native share needs no user-facing error.
    }
  }

  const metrics = results ? pslMetrics(results) : []
  const mogSummary = results ? [
    ['Eye Area', strength(metricScore(results, 'Canthal Tilt'))],
    ['Jawline', strength(metricScore(results, 'Jawline Definition'))],
    ['Harmony', strength(metricScore(results, 'Overall Harmony'))],
    ['Facial Structure', strength((metricScore(results, 'Facial Symmetry') + metricScore(results, 'Cheekbone Prominence')) / 2)],
  ] : []

  return (
    <>
      <TosModal />
      <section className="rating-tool" aria-label={isPsl ? 'PSL face rating tool' : 'Mog Score tool'}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif" onChange={selectFile} hidden />
        {!preview ? (
          <button className="rating-upload" type="button" onClick={() => inputRef.current?.click()}>
            <span className="rating-upload-icon" aria-hidden="true">＋</span>
            <strong>Upload a clear face photo</strong>
            <small>Front-facing · one adult · JPEG, PNG, WebP, HEIC or AVIF · max 12 MB</small>
          </button>
        ) : (
          <div className="rating-preview-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Uploaded face preview for private analysis" className="rating-preview" />
            {!results && <button type="button" className="btn btn-outline" onClick={reset}>Change Photo</button>}
          </div>
        )}

        {error && <p className="rating-error" role="alert">{error}</p>}
        {preview && !results && (
          <button type="button" className="btn btn-primary rating-action" onClick={analyze} disabled={!imageBase64 || status === 'loading'}>
            {status === 'loading' ? 'Analyzing facial landmarks…' : isPsl ? 'Calculate My PSL Score' : 'Calculate My Mog Score'}
          </button>
        )}

        {results && (
          <div className="rating-results" aria-live="polite">
            <div className="score-display">
              <span className="section-label">{isPsl ? 'Overall PSL Score' : 'Mog Score'}</span>
              <div><span className="score-big">{Number(results.overall).toFixed(1)}</span><span>/10</span></div>
              <span className="tier-badge-lg">{results.tier}</span>
            </div>

            {isPsl ? (
              <div className="rating-metrics">
                {metrics.map(([name, score]) => (
                  <div className="rating-metric" key={name}>
                    <div><span>{name}</span><strong>{score.toFixed(1)}</strong></div>
                    <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${Math.round(score * 10)}%` }} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mog-summary-grid">
                {mogSummary.map(([name, label]) => <div key={name}><span>{name}</span><strong>{label}</strong></div>)}
              </div>
            )}

            <div className="rating-result-actions">
              <button type="button" className="btn btn-primary" onClick={share}>Share Result</button>
              <button type="button" className="btn btn-outline" onClick={reset}>Compare Again</button>
              <Link href="/looksmaxxing-guide" className="btn btn-outline">Improve My Score</Link>
            </div>
          </div>
        )}
        <p className="rating-disclaimer">This tool is for entertainment and self-improvement purposes only. PSL and mog ratings are subjective and are not scientific measurements of attractiveness.</p>
      </section>
    </>
  )
}
