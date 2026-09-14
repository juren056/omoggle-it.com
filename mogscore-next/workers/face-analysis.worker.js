import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { analyzeFaceLandmarks } from '../lib/local-face-rules.mjs'

let modelPromise

async function getModel() {
  if (!modelPromise) {
    modelPromise = FilesetResolver.forVisionTasks('/mediapipe/wasm').then(fileset => FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: '/mediapipe/models/face_landmarker_v1.task', delegate: 'CPU' },
      runningMode: 'IMAGE',
      numFaces: 2,
      minFaceDetectionConfidence: 0.55,
      minFacePresenceConfidence: 0.55,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    }))
  }
  return modelPromise
}

function imageStats(context, width, height) {
  const sampleWidth = Math.min(width, 160)
  const sampleHeight = Math.min(height, 160)
  const sample = new OffscreenCanvas(sampleWidth, sampleHeight)
  const sampleContext = sample.getContext('2d', { willReadFrequently: true })
  sampleContext.drawImage(context.canvas, 0, 0, sampleWidth, sampleHeight)
  const pixels = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data
  let luminance = 0
  for (let index = 0; index < pixels.length; index += 4) {
    luminance += (pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722) / 255
  }
  return { brightness: luminance / (pixels.length / 4), width, height }
}

self.onmessage = async event => {
  const { id, bitmap } = event.data
  try {
    const maxDimension = 1280
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    const model = await getModel()
    const detection = model.detect(canvas)
    const faces = detection.faceLandmarks || []
    if (faces.length === 0) throw new Error('no_face')
    if (faces.length > 1) throw new Error('multiple_faces')
    const analysis = analyzeFaceLandmarks(faces[0], imageStats(context, width, height))
    self.postMessage({ id, ok: true, analysis })
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || 'analysis_failed' })
  }
}
