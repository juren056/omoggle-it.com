'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { analyzeLocalImage, releaseLocalFaceEngine, validateLocalImage } from '@/lib/local-face-engine'
import { diagnosticMessages } from '@/lib/local-face-rules.mjs'
import { durationBucket, trackSafeEvent } from '@/lib/analytics'

const LABELS = {
  psl: { title: 'Local PSL presentation check', action: 'Run Local PSL Check', score: 'PSL-style presentation score' },
  mog: { title: 'Local Mog photo check', action: 'Calculate Local Mog Score', score: 'Mog presentation score' },
  shape: { title: 'Local face shape detector', action: 'Detect Face Shape', score: 'Input quality score' },
  analyzer: { title: 'Private local face analyzer', action: 'Analyze Locally', score: 'Photo readiness score' },
}

const ERROR_MESSAGES = {
  invalid_file: 'Use a valid JPEG, PNG, or WebP image smaller than 10 MB.',
  image_too_small: 'Use an image at least 240 × 240 pixels.',
  no_face: 'No clear face was detected. Use one front-facing adult photo with better light.',
  multiple_faces: 'More than one face was detected. Crop the image to one authorized adult.',
  unsupported_device: 'This browser cannot run the local detector. Try a current Chromium, Firefox, or Safari browser.',
  model_load_failed: 'The local model could not load. Check the connection and try again.',
  analysis_failed: 'Local analysis failed. Clear the image and try another file.',
}

function relatedLink(result) {
  const messages = diagnosticMessages(result)
  const firstWarning = messages.find(item => item.type === 'warning')
  if (firstWarning?.code === 'dark' || firstWarning?.code === 'bright') return ['/omoggle-camera-setup', 'Improve lighting setup']
  if (firstWarning?.code === 'pose' || firstWarning?.code === 'too_close') return ['/omoggle-camera-angle', 'Improve camera angle']
  return ['/why-omoggle-score-changes', 'Why scores change']
}

export default function LocalFaceTool({ variant = 'analyzer', showHeading = true }) {
  const copy = LABELS[variant] || LABELS.analyzer
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const objectUrlRef = useRef('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    trackSafeEvent('tool_view', { tool_name: variant, page_type: 'private_tool', processing_mode: 'local' })
    return () => {
      abortRef.current?.abort()
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      releaseLocalFaceEngine()
    }
  }, [variant])

  function clear() {
    abortRef.current?.abort()
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = ''
    setFile(null); setPreview(''); setResult(null); setError(''); setState('idle'); setAuthorized(false)
  }

  function chooseFile(event) {
    const selected = event.target.files?.[0]
    event.target.value = ''
    const validation = validateLocalImage(selected)
    if (validation) { setError(validation); return }
    clear()
    objectUrlRef.current = URL.createObjectURL(selected)
    setFile(selected)
    setPreview(objectUrlRef.current)
    setState('ready')
  }

  async function analyze() {
    if (!file || !authorized || state === 'loading') return
    const started = performance.now()
    abortRef.current = new AbortController()
    setState('loading'); setError(''); setResult(null)
    trackSafeEvent('analysis_start', { tool_name: variant, processing_mode: 'local' })
    try {
      const analysis = await analyzeLocalImage(file, abortRef.current.signal)
      setResult(analysis); setState('done')
      trackSafeEvent('analysis_complete', {
        tool_name: variant, processing_mode: 'local', rule_version: analysis.version,
        duration_bucket: durationBucket(performance.now() - started),
      })
    } catch (failure) {
      if (failure.name === 'AbortError') return
      const code = ERROR_MESSAGES[failure.message] ? failure.message : 'analysis_failed'
      setError(ERROR_MESSAGES[code]); setState('ready')
      trackSafeEvent('analysis_error', { tool_name: variant, processing_mode: 'local', error_category: code })
    }
  }

  async function generateShareCard() {
    if (!result) return
    const canvas = document.createElement('canvas')
    canvas.width = 1200; canvas.height = 630
    const context = canvas.getContext('2d')
    context.fillStyle = '#0d1117'; context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#d4a843'; context.font = '64px sans-serif'; context.fillText('OMOGGLE IT', 80, 110)
    context.fillStyle = '#f0ece3'; context.font = 'bold 74px sans-serif'
    context.fillText(variant === 'shape' ? `${result.faceShape.primary} face shape` : `${copy.score}: ${result.scores.presentation.toFixed(1)}/10`, 80, 285)
    context.fillStyle = '#9ba3af'; context.font = '34px sans-serif'; context.fillText('Entertainment-only local analysis · No face photo included', 80, 375)
    context.fillText('omoggle-it.com', 80, 510)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a'); link.href = url; link.download = `omoggle-it-${variant}-result.png`; link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
    trackSafeEvent('share_card_generate', { tool_name: variant, processing_mode: 'local' })
  }

  const related = result ? relatedLink(result) : null
  const diagnostics = result ? diagnosticMessages(result) : []
  const shownScore = variant === 'psl' ? result?.scores.geometry : result?.scores.presentation

  return (
    <section className="local-face-tool" aria-labelledby={`${variant}-tool-heading`}>
      {showHeading && <div className="local-tool-heading"><span className="section-label">Runs in your browser</span><h2 id={`${variant}-tool-heading`}>{copy.title}</h2><p>The photo stays on this device. The model measures landmarks and photo setup; it does not identify you or determine objective attractiveness.</p></div>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} hidden />
      {!preview ? (
        <button type="button" className="rating-upload" onClick={() => inputRef.current?.click()}><span className="rating-upload-icon" aria-hidden="true">＋</span><strong>Choose a photo</strong><small>One authorized adult · JPEG, PNG or WebP · 10 MB maximum</small></button>
      ) : (
        // Blob URLs are private local previews and cannot use the Next image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <div className="rating-preview-wrap"><img src={preview} alt="Local preview of the selected photo" className="rating-preview" /><button type="button" className="btn btn-outline" onClick={clear}>Clear Photo & Result</button></div>
      )}
      {preview && !result && <label className="photo-consent"><input type="checkbox" checked={authorized} onChange={event => setAuthorized(event.target.checked)} /> I confirm this is my photo or I have permission from the pictured adult.</label>}
      {error && <p className="rating-error" role="alert">{error}</p>}
      {preview && !result && <button type="button" className="btn btn-primary rating-action" onClick={analyze} disabled={!authorized || state === 'loading'}>{state === 'loading' ? 'Loading local model and analyzing…' : copy.action}</button>}
      {state === 'loading' && <p className="local-processing" role="status">The first run downloads a self-hosted model. Processing happens locally and may take longer on low-power devices.</p>}
      {result && <div className="rating-results" aria-live="polite">
        {variant === 'shape' ? <div className="score-display"><span className="section-label">Closest shape</span><div className="shape-result">{result.faceShape.primary}</div><p>Possible second match: <strong>{result.faceShape.secondary}</strong> · confidence {Math.round(result.faceShape.confidence * 100)}%</p></div>
          : <div className="score-display"><span className="section-label">{copy.score}</span><div><span className="score-big">{shownScore.toFixed(1)}</span><span>/10</span></div></div>}
        <div className="diagnostic-list">{diagnostics.map(item => <div className={`diagnostic-item ${item.type}`} key={item.code}><strong>{item.type === 'pass' ? 'Pass' : 'Adjust'}</strong><span>{item.text}</span></div>)}</div>
        <div className="rating-metrics">
          {variant === 'shape' ? Object.entries(result.faceShape.ratios).map(([name, value]) => <div className="rating-metric" key={name}><div><span>{name.replaceAll(/([A-Z])/g, ' $1')}</span><strong>{value.toFixed(2)}</strong></div></div>)
            : [['Symmetry geometry', result.scores.symmetry], ['Proportion heuristic', result.scores.proportions], ['Pose quality', result.scores.pose], ['Lighting', result.scores.lighting], ['Framing', result.scores.framing]].map(([name, value]) => <div className="rating-metric" key={name}><div><span>{name}</span><strong>{value.toFixed(1)}</strong></div><div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${value * 10}%` }} /></div></div>)}
        </div>
        <div className="rating-result-actions"><button type="button" className="btn btn-primary" onClick={generateShareCard}>Download Photo-Free Result Card</button><button type="button" className="btn btn-outline" onClick={clear}>Test Another Photo</button>{related && <Link className="btn btn-outline" href={related[0]} onClick={() => trackSafeEvent('result_related_click', { tool_name: variant, target: related[0] })}>{related[1]}</Link>}</div>
        {variant === 'shape' && <p className="rating-disclaimer">Hair, angle, facial hair and lens distortion can change this rough classification. Use the <Link href="/face-shape-guide">manual face shape guide</Link> when confidence is low.</p>}
      </div>}
      <p className="rating-disclaimer">Local rule version {result?.version || '2026.09.1'}. Entertainment and presentation guidance only—not medical, psychological or professional assessment.</p>
    </section>
  )
}
