'use client'

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
let worker
let requestId = 0
const pending = new Map()

function getWorker() {
  if (!worker) {
    if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
      throw new Error('unsupported_device')
    }
    worker = new Worker(new URL('../workers/face-analysis.worker.js', import.meta.url), { type: 'module' })
    worker.onmessage = event => {
      const entry = pending.get(event.data.id)
      if (!entry) return
      pending.delete(event.data.id)
      if (event.data.ok) entry.resolve(event.data.analysis)
      else entry.reject(new Error(event.data.error))
    }
    worker.onerror = () => {
      for (const entry of pending.values()) entry.reject(new Error('model_load_failed'))
      pending.clear()
      worker?.terminate()
      worker = null
    }
  }
  return worker
}

export function validateLocalImage(file) {
  if (!file) return 'Choose an image first.'
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) return 'Use a JPEG, PNG, or WebP image.'
  if (file.size > MAX_IMAGE_BYTES) return 'Use an image smaller than 10 MB.'
  return null
}

export async function analyzeLocalImage(file, signal) {
  const validationError = validateLocalImage(file)
  if (validationError) throw new Error('invalid_file')
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  const bitmap = await createImageBitmap(file)
  if (bitmap.width < 240 || bitmap.height < 240) {
    bitmap.close()
    throw new Error('image_too_small')
  }
  const id = ++requestId
  return new Promise((resolve, reject) => {
    const abort = () => {
      pending.delete(id)
      bitmap.close()
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', abort, { once: true })
    pending.set(id, {
      resolve: value => { signal?.removeEventListener('abort', abort); resolve(value) },
      reject: error => { signal?.removeEventListener('abort', abort); reject(error) },
    })
    getWorker().postMessage({ id, bitmap }, [bitmap])
  })
}

export function releaseLocalFaceEngine() {
  for (const entry of pending.values()) entry.reject(new DOMException('Aborted', 'AbortError'))
  pending.clear()
  worker?.terminate()
  worker = null
}
