export const MAX_IMAGE_BYTES = 4 * 1024 * 1024
export const MAX_REQUEST_BYTES = 6 * 1024 * 1024

const TIERS = new Set(['Molecule', 'Sub3', 'LTN', 'MTN', 'HTN', 'Chadlite', 'Chad', 'Slayer'])
const METRIC_NAMES = [
  'Facial Symmetry',
  'Canthal Tilt',
  'Jawline Definition',
  'Cheekbone Prominence',
  'Skin Clarity',
  'Overall Harmony',
]

function isNumberInRange(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
}

function detectImageMime(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg'
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp'
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    const brand = buffer.toString('ascii', 8, 12)
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) return 'image/heic'
    if (['avif', 'avis'].includes(brand)) return 'image/avif'
  }
  return null
}

export function validateAnalyzeRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid_request')
  if (!['analyze', 'compare'].includes(body.mode)) throw new Error('invalid_mode')
  if (typeof body.imageBase64 !== 'string' || body.imageBase64.length === 0) throw new Error('invalid_image')
  if (body.imageBase64.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 4) throw new Error('image_too_large')
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(body.imageBase64)) throw new Error('invalid_image')

  const buffer = Buffer.from(body.imageBase64, 'base64')
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) throw new Error(buffer.length > MAX_IMAGE_BYTES ? 'image_too_large' : 'invalid_image')
  const mime = detectImageMime(buffer)
  if (!mime) throw new Error('unsupported_image')

  return { mode: body.mode, imageBase64: buffer.toString('base64'), mime }
}

export function parseModelResult(text, mode) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('invalid_model_response')
  let parsed
  try {
    parsed = JSON.parse(text.replace(/```json|```/gi, '').trim())
  } catch {
    throw new Error('invalid_model_response')
  }

  if (parsed?.error === 'no_face' || parsed?.error === 'inappropriate_image') return { error: parsed.error }
  if (mode === 'compare') {
    if (!parsed || Object.keys(parsed).length !== 1 || !isNumberInRange(parsed.score, 4, 8.5)) throw new Error('invalid_model_response')
    return { score: parsed.score }
  }

  if (!parsed || !isNumberInRange(parsed.overall, 4.5, 8.5) || !TIERS.has(parsed.tier)) throw new Error('invalid_model_response')
  if (!Array.isArray(parsed.metrics) || parsed.metrics.length !== METRIC_NAMES.length) throw new Error('invalid_model_response')
  for (let i = 0; i < METRIC_NAMES.length; i += 1) {
    const metric = parsed.metrics[i]
    if (metric?.name !== METRIC_NAMES[i] || !isNumberInRange(metric.score, 1, 10)) throw new Error('invalid_model_response')
  }
  if (!Array.isArray(parsed.advice) || parsed.advice.length < 1 || parsed.advice.length > 6) throw new Error('invalid_model_response')
  if (parsed.advice.some(item => typeof item !== 'string' || item.trim().length === 0 || item.length > 500)) throw new Error('invalid_model_response')

  return {
    overall: parsed.overall,
    tier: parsed.tier,
    metrics: parsed.metrics.map(metric => ({ name: metric.name, score: metric.score })),
    advice: parsed.advice.map(item => item.trim()),
  }
}
