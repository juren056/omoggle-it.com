'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { analyzeLocalImage, releaseLocalFaceEngine } from '@/lib/local-face-engine'
import { diagnosticMessages } from '@/lib/local-face-rules.mjs'
import { trackSafeEvent } from '@/lib/analytics'

export default function CameraSetupCheck() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const abortRef = useRef(null)
  const [cameraState, setCameraState] = useState('idle')
  const [message, setMessage] = useState('')
  const [analysis, setAnalysis] = useState(null)

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraState('idle')
  }

  useEffect(() => () => { abortRef.current?.abort(); stopCamera(); releaseLocalFaceEngine() }, [])

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { setMessage('Camera access is unavailable in this browser. Use the photo option below.'); setCameraState('error'); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } }, audio: false })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCameraState('ready'); setMessage('Camera is ready. Center your face, then run the setup check.')
      trackSafeEvent('camera_permission_result', { tool_name: 'omoggle_practice', processing_mode: 'local', error_category: 'granted' })
    } catch (error) {
      const denied = error?.name === 'NotAllowedError'
      setMessage(denied ? 'Camera permission was denied. Allow camera access in browser site settings, reload, or use a photo.' : 'No usable camera was found. Close other camera apps or use a photo instead.')
      setCameraState('error')
      trackSafeEvent('camera_permission_result', { tool_name: 'omoggle_practice', processing_mode: 'local', error_category: denied ? 'denied' : 'unavailable' })
    }
  }

  async function captureAndCheck() {
    const video = videoRef.current
    if (!video?.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    const file = new File([blob], 'camera-frame.jpg', { type: 'image/jpeg' })
    abortRef.current = new AbortController()
    setCameraState('checking'); setMessage('Analyzing one frame locally…'); setAnalysis(null)
    try {
      const result = await analyzeLocalImage(file, abortRef.current.signal)
      setAnalysis(result); setCameraState('ready'); setMessage('Setup check complete. Adjust any warning and check again.')
    } catch (error) {
      setCameraState('ready'); setMessage(error.message === 'no_face' ? 'No clear face was detected. Improve light and move into frame.' : error.message === 'multiple_faces' ? 'More than one face was detected. This check supports one authorized adult.' : 'The local model could not analyze this frame. Try a photo or another browser.')
    }
  }

  return <section className="camera-check" aria-labelledby="camera-check-heading">
    <span className="section-label">Primary practice tool</span><h2 id="camera-check-heading">Camera Setup & Image Quality Check</h2>
    <p>This checks one camera frame on your device. It does not connect to Omoggle, repair permissions on another site, predict a winner, or reveal Omoggle&apos;s private scoring rules.</p>
    <div className="camera-stage"><video ref={videoRef} playsInline muted aria-label="Private camera preview" />{cameraState === 'idle' && <button type="button" className="btn btn-primary" onClick={startCamera}>Enable Camera</button>}</div>
    {message && <p className="camera-message" role="status">{message}</p>}
    {cameraState === 'ready' && <div className="camera-actions"><button type="button" className="btn btn-primary" onClick={captureAndCheck}>Check This Frame</button><button type="button" className="btn btn-outline" onClick={stopCamera}>Stop Camera</button></div>}
    {cameraState === 'checking' && <button type="button" className="btn btn-outline" onClick={() => abortRef.current?.abort()}>Cancel Check</button>}
    {analysis && <div className="diagnostic-list" aria-live="polite">{diagnosticMessages(analysis).map(item => <div className={`diagnostic-item ${item.type}`} key={item.code}><strong>{item.type === 'pass' ? 'Pass' : 'Adjust'}</strong><span>{item.text}</span></div>)}</div>}
    <p className="rating-disclaimer">Prefer a photo? Use the private local analyzer below. For permission troubleshooting, see <Link href="/omoggle-troubleshooting">Omoggle troubleshooting</Link>.</p>
  </section>
}
