'use client'

import { useEffect, useRef, useState } from 'react'
import { analyzeLocalImage, releaseLocalFaceEngine, validateLocalImage } from '@/lib/local-face-engine'

export default function LocalCompareTool({ showHeading = true }) {
  const [slots, setSlots] = useState([null, null])
  const [authorized, setAuthorized] = useState(false)
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const urlsRef = useRef([])
  const abortRef = useRef(null)

  useEffect(() => () => {
    abortRef.current?.abort()
    urlsRef.current.forEach(url => URL.revokeObjectURL(url))
    releaseLocalFaceEngine()
  }, [])

  function select(index, event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    const validation = validateLocalImage(file)
    if (validation) { setError(validation); return }
    const preview = URL.createObjectURL(file)
    urlsRef.current.push(preview)
    setSlots(values => values.map((value, position) => position === index ? { file, preview } : value))
    setResult(null); setError('')
  }

  async function compare() {
    if (!slots[0] || !slots[1] || !authorized) return
    abortRef.current = new AbortController()
    setState('loading'); setError(''); setResult(null)
    try {
      const first = await analyzeLocalImage(slots[0].file, abortRef.current.signal)
      const second = await analyzeLocalImage(slots[1].file, abortRef.current.signal)
      setResult({ first, second }); setState('done')
    } catch (failure) {
      if (failure.name === 'AbortError') return
      setError(failure.message === 'multiple_faces' ? 'Each photo must contain exactly one adult face.' : failure.message === 'no_face' ? 'A clear face was not detected in one photo.' : 'Local comparison failed. Check both files and try again.')
      setState('idle')
    }
  }

  function clear() {
    abortRef.current?.abort()
    urlsRef.current.forEach(url => URL.revokeObjectURL(url)); urlsRef.current = []
    setSlots([null, null]); setResult(null); setError(''); setAuthorized(false); setState('idle')
  }

  return <section className="local-compare" aria-labelledby="compare-heading">
    {showHeading && <><span className="section-label">Same-person photo comparison</span><h2 id="compare-heading">Local 1v1 Photo Setup Comparison</h2>
    <p>Compare two photos of yourself—or one consenting adult—to see which setup is more consistent. This is not a public ranking or a comparison of strangers.</p></>}
    <div className="compare-grid">{slots.map((slot, index) => <label className="compare-slot" key={index}><input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => select(index, event)} hidden />{slot ? <>
      {/* Blob URLs stay in the browser and cannot use the Next image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slot.preview} alt={`Local preview ${index + 1}`} />
    </> : <><strong>Photo {index + 1}</strong><span>Choose JPEG, PNG or WebP</span></>}</label>)}</div>
    <label className="photo-consent"><input type="checkbox" checked={authorized} onChange={event => setAuthorized(event.target.checked)} /> I confirm both photos are mine or show the same consenting adult.</label>
    {error && <p className="rating-error" role="alert">{error}</p>}
    <div className="camera-actions"><button type="button" className="btn btn-primary" disabled={!slots[0] || !slots[1] || !authorized || state === 'loading'} onClick={compare}>{state === 'loading' ? 'Comparing locally…' : 'Compare Photo Setup'}</button><button type="button" className="btn btn-outline" onClick={clear}>Clear Both</button></div>
    {result && <div className="compare-result" aria-live="polite"><h3>{result.first.scores.presentation === result.second.scores.presentation ? 'Both setups scored equally' : `Photo ${result.first.scores.presentation > result.second.scores.presentation ? '1' : '2'} has the stronger setup`}</h3><div className="compare-scores"><span>Photo 1 <strong>{result.first.scores.presentation.toFixed(1)}</strong></span><span>Photo 2 <strong>{result.second.scores.presentation.toFixed(1)}</strong></span></div><p>The comparison reflects lighting, framing, pose and the current local rule version—not personal worth or an objective attractiveness ranking.</p></div>}
  </section>
}
