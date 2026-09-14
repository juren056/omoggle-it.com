export const LOCAL_FACE_RULE_VERSION = '2026.09.1'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const scoreNear = (value, target, tolerance) => clamp(10 - Math.abs(value - target) / tolerance * 6, 1, 10)

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function point(landmarks, index) {
  const value = landmarks[index]
  if (!value || !Number.isFinite(value.x) || !Number.isFinite(value.y)) throw new Error('invalid_landmarks')
  return value
}

export function classifyFaceShape(landmarks) {
  const top = point(landmarks, 10)
  const chin = point(landmarks, 152)
  const leftCheek = point(landmarks, 234)
  const rightCheek = point(landmarks, 454)
  const leftJaw = point(landmarks, 172)
  const rightJaw = point(landmarks, 397)
  const leftTemple = point(landmarks, 127)
  const rightTemple = point(landmarks, 356)
  const faceHeight = distance(top, chin)
  const cheekWidth = distance(leftCheek, rightCheek)
  const jawWidth = distance(leftJaw, rightJaw)
  const foreheadWidth = distance(leftTemple, rightTemple)
  const lengthRatio = faceHeight / Math.max(cheekWidth, 0.001)
  const jawRatio = jawWidth / Math.max(cheekWidth, 0.001)
  const foreheadRatio = foreheadWidth / Math.max(cheekWidth, 0.001)

  let primary = 'Oval'
  let secondary = 'Round'
  if (lengthRatio >= 1.52) { primary = 'Oblong'; secondary = 'Oval' }
  else if (jawRatio >= 0.91 && foreheadRatio >= 0.9) { primary = 'Square'; secondary = 'Round' }
  else if (jawRatio <= 0.76 && foreheadRatio >= 0.86) { primary = 'Heart'; secondary = 'Oval' }
  else if (jawRatio >= 0.9 && foreheadRatio <= 0.82) { primary = 'Triangle'; secondary = 'Square' }
  else if (lengthRatio <= 1.25) { primary = 'Round'; secondary = 'Square' }
  else if (lengthRatio >= 1.38) { primary = 'Oval'; secondary = 'Oblong' }

  return { primary, secondary, lengthRatio, jawRatio, foreheadRatio }
}

export function analyzeFaceLandmarks(landmarks, image = {}) {
  if (!Array.isArray(landmarks) || landmarks.length < 455) throw new Error('invalid_landmarks')
  const xs = landmarks.map(item => item.x)
  const ys = landmarks.map(item => item.y)
  const bounds = {
    left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys),
  }
  bounds.width = bounds.right - bounds.left
  bounds.height = bounds.bottom - bounds.top

  const leftEye = midpoint(point(landmarks, 33), point(landmarks, 133))
  const rightEye = midpoint(point(landmarks, 362), point(landmarks, 263))
  const eyeMid = midpoint(leftEye, rightEye)
  const eyeDistance = distance(leftEye, rightEye)
  const nose = point(landmarks, 1)
  const rollDegrees = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180 / Math.PI
  const yawOffset = Math.abs(nose.x - eyeMid.x) / Math.max(eyeDistance, 0.001)
  const occupancy = Math.max(bounds.width, bounds.height)
  const brightness = Number.isFinite(image.brightness) ? image.brightness : 0.5

  const lightingScore = scoreNear(brightness, 0.56, 0.4)
  const framingScore = scoreNear(occupancy, 0.62, 0.38)
  const poseScore = clamp(10 - Math.abs(rollDegrees) * 0.22 - yawOffset * 19, 1, 10)

  const symmetricPairs = [[33, 263], [133, 362], [61, 291], [234, 454], [172, 397]]
  const symmetryError = symmetricPairs.reduce((sum, [left, right]) => {
    const a = point(landmarks, left)
    const b = point(landmarks, right)
    return sum + Math.abs((eyeMid.x - a.x) - (b.x - eyeMid.x)) / Math.max(bounds.width, 0.001)
  }, 0) / symmetricPairs.length
  const symmetryScore = clamp(10 - symmetryError * 32 - Math.abs(rollDegrees) * 0.08, 1, 10)

  const shape = classifyFaceShape(landmarks)
  const proportionScore = scoreNear(shape.lengthRatio, 1.38, 0.5)
  const geometryScore = (symmetryScore * 0.4 + proportionScore * 0.35 + poseScore * 0.25)
  const presentationScore = (lightingScore * 0.3 + framingScore * 0.25 + poseScore * 0.25 + geometryScore * 0.2)
  const confidence = clamp((lightingScore + framingScore + poseScore) / 30, 0.25, 0.98)

  return {
    version: LOCAL_FACE_RULE_VERSION,
    scores: {
      lighting: Number(lightingScore.toFixed(1)),
      framing: Number(framingScore.toFixed(1)),
      pose: Number(poseScore.toFixed(1)),
      symmetry: Number(symmetryScore.toFixed(1)),
      proportions: Number(proportionScore.toFixed(1)),
      geometry: Number(geometryScore.toFixed(1)),
      presentation: Number(presentationScore.toFixed(1)),
    },
    diagnostics: {
      brightness: Number(brightness.toFixed(3)),
      occupancy: Number(occupancy.toFixed(3)),
      rollDegrees: Number(rollDegrees.toFixed(1)),
      yawOffset: Number(yawOffset.toFixed(3)),
      width: image.width || null,
      height: image.height || null,
    },
    faceShape: {
      primary: shape.primary,
      secondary: shape.secondary,
      confidence: Number(confidence.toFixed(2)),
      ratios: {
        lengthToWidth: Number(shape.lengthRatio.toFixed(2)),
        jawToCheek: Number(shape.jawRatio.toFixed(2)),
        foreheadToCheek: Number(shape.foreheadRatio.toFixed(2)),
      },
    },
  }
}

export function diagnosticMessages(analysis) {
  const { brightness, occupancy, rollDegrees, yawOffset } = analysis.diagnostics
  return [
    brightness < 0.3 ? { type: 'warning', code: 'dark', text: 'The face is underexposed. Add soft light in front of you.' }
      : brightness > 0.82 ? { type: 'warning', code: 'bright', text: 'Highlights may be overexposed. Reduce direct light.' }
        : { type: 'pass', code: 'light_ok', text: 'Exposure is suitable for a repeatable check.' },
    occupancy < 0.35 ? { type: 'warning', code: 'too_far', text: 'Move closer so your face fills more of the frame.' }
      : occupancy > 0.88 ? { type: 'warning', code: 'too_close', text: 'Move back slightly to reduce perspective distortion.' }
        : { type: 'pass', code: 'framing_ok', text: 'Face size and framing are suitable.' },
    Math.abs(rollDegrees) > 8 || yawOffset > 0.14
      ? { type: 'warning', code: 'pose', text: 'Face the camera more directly and keep your eyes level.' }
      : { type: 'pass', code: 'pose_ok', text: 'Head direction is close to front-facing.' },
  ]
}
