import assert from 'node:assert/strict'
import { parseModelResult, validateAnalyzeRequest } from '../lib/analyze-validation.mjs'

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43]).toString('base64')
const validRequest = validateAnalyzeRequest({ imageBase64: jpeg, mode: 'analyze' })
assert.equal(validRequest.mime, 'image/jpeg')
assert.equal(validRequest.mode, 'analyze')

assert.throws(() => validateAnalyzeRequest({ imageBase64: 'not base64!', mode: 'analyze' }), /invalid_image/)
assert.throws(() => validateAnalyzeRequest({ imageBase64: jpeg, mode: 'unknown' }), /invalid_mode/)
assert.throws(() => validateAnalyzeRequest({ imageBase64: Buffer.from('plain text').toString('base64'), mode: 'analyze' }), /unsupported_image/)

const analysis = {
  overall: 6.4,
  tier: 'HTN',
  metrics: [
    { name: 'Facial Symmetry', score: 6.5 },
    { name: 'Canthal Tilt', score: 6.1 },
    { name: 'Jawline Definition', score: 6.2 },
    { name: 'Cheekbone Prominence', score: 6.7 },
    { name: 'Skin Clarity', score: 6.8 },
    { name: 'Overall Harmony', score: 6.3 },
  ],
  advice: ['Use even lighting.', 'Keep a consistent skincare routine.'],
}
assert.deepEqual(parseModelResult(JSON.stringify(analysis), 'analyze'), analysis)
assert.deepEqual(parseModelResult('```json\n{"score":7.1}\n```', 'compare'), { score: 7.1 })
assert.deepEqual(parseModelResult('{"error":"no_face"}', 'analyze'), { error: 'no_face' })
assert.throws(() => parseModelResult('not json', 'analyze'), /invalid_model_response/)
assert.throws(() => parseModelResult(JSON.stringify({ ...analysis, overall: 9.9 }), 'analyze'), /invalid_model_response/)
assert.throws(() => parseModelResult(JSON.stringify({ ...analysis, metrics: analysis.metrics.slice(0, 5) }), 'analyze'), /invalid_model_response/)
assert.throws(() => parseModelResult('{"score":99}', 'compare'), /invalid_model_response/)

console.log('analyze validation tests passed')
