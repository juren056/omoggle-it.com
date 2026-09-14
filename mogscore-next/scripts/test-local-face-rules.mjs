import assert from 'node:assert/strict'
import test from 'node:test'
import { analyzeFaceLandmarks, classifyFaceShape, LOCAL_FACE_RULE_VERSION } from '../lib/local-face-rules.mjs'

function landmarks() {
  const points = Array.from({ length: 478 }, (_, index) => {
    const angle = index / 478 * Math.PI * 2
    return { x: .5 + Math.cos(angle) * .22, y: .5 + Math.sin(angle) * .3, z: 0 }
  })
  Object.assign(points[10], { x: .5, y: .18 }); Object.assign(points[152], { x: .5, y: .82 })
  Object.assign(points[234], { x: .28, y: .52 }); Object.assign(points[454], { x: .72, y: .52 })
  Object.assign(points[172], { x: .33, y: .7 }); Object.assign(points[397], { x: .67, y: .7 })
  Object.assign(points[127], { x: .31, y: .32 }); Object.assign(points[356], { x: .69, y: .32 })
  Object.assign(points[33], { x: .34, y: .42 }); Object.assign(points[133], { x: .43, y: .42 })
  Object.assign(points[362], { x: .57, y: .42 }); Object.assign(points[263], { x: .66, y: .42 })
  Object.assign(points[61], { x: .4, y: .61 }); Object.assign(points[291], { x: .6, y: .61 })
  Object.assign(points[1], { x: .5, y: .52 })
  return points
}

test('same landmarks and version produce the same finite result', () => {
  const input = landmarks()
  const first = analyzeFaceLandmarks(input, { brightness: .56, width: 800, height: 800 })
  const second = analyzeFaceLandmarks(input, { brightness: .56, width: 800, height: 800 })
  assert.deepEqual(first, second)
  assert.equal(first.version, LOCAL_FACE_RULE_VERSION)
  for (const value of Object.values(first.scores)) assert.ok(value >= 1 && value <= 10)
})

test('shape output includes primary, secondary and ratios', () => {
  const result = classifyFaceShape(landmarks())
  assert.notEqual(result.primary, result.secondary)
  assert.ok(Number.isFinite(result.lengthRatio))
})

test('incomplete landmark data fails instead of returning a random score', () => {
  assert.throws(() => analyzeFaceLandmarks([{ x: .5, y: .5 }]), /invalid_landmarks/)
})
