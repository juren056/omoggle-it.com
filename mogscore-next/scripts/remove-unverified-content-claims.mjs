import fs from 'node:fs/promises'
import path from 'node:path'

const replacements = new Map([
  ['facial-symmetry-guide.html', [
    [/Facial symmetry is the top-weighted metric in Omoggle's AI scoring at 22%\. Learn what it means, how to measure it, and how to maximize your score today\./g, 'Learn what facial symmetry means, how camera setup affects it, and which claims should be treated cautiously.'],
    [/Omoggle's AI<\/a> weights it at roughly 22% of your total score — the highest of any single metric\./g, 'Omoggle<\/a> does not publish a verifiable current weighting, so this guide treats symmetry as one observable geometry factor rather than an official percentage.'],
  ]],
  ['looksmaxxing-for-women.html', [[/Omoggle<\/a> uses the same six metrics for all users\. Community data suggests female faces are weighted slightly higher on harmony and skin clarity, while jawline sharpness is less aggressively weighted than for male faces\./g, 'Omoggle<\/a> has not published a verifiable demographic weighting specification. We do not infer gender-specific scoring rules from community anecdotes.']]],
  ['is-omoggle-ai.html', [[/The scoring system uses <strong>MediaPipe FaceMesh<\/strong>[\s\S]*?overall harmony\.<\/p>/g, 'Omoggle has not published enough current technical documentation for this site to verify its model, landmark count, latency or scoring inputs. Our own free tools use a disclosed, self-hosted MediaPipe Face Landmarker model and separate local heuristics.<\/p>']]],
  ['omoggle-camera-angle.html', [
    [/Position your camera <strong>15-25cm above eye level<\/strong>\.[\s\S]*?reduces distortion\)\.<\/p>/g, 'Place the camera near eye level, keep it centered and compare one change at a time. The effect varies by lens, distance and lighting; no fixed score increase is promised.<\/p>'],
    [/Yes\. A 1080p webcam[\s\S]*?widely available secondhand\.<\/p>/g, 'A sharper camera can make edges easier to detect, but resolution alone does not guarantee a different score. Use even light, clean the lens and choose a stable frame before buying equipment.<\/p>'],
  ]],
  ['looksmaxxing-results-timeline.html', [
    [/Moving your webcam 15–25cm above eye level[\s\S]*?captured and measured\./g, 'Changing camera height and using soft light can alter presentation immediately, but the size and direction of any score change cannot be promised.'],
    [/Skin clarity is scored directly by Omoggle at ~14% weight\.[\s\S]*?Full skin transformation takes 3 months\./g, 'Skin appearance varies with light, camera processing and individual conditions. Use a gentle routine and seek qualified medical advice for persistent concerns; this site does not promise a fixed timeline or score change.'],
  ]],
  ['face-shape-guide.html', [
    [/Canthal tilt and skin clarity are the highest-ROI improvements since structure is already favorable\./g, 'Prioritize controllable styling, lighting and framing rather than treating a face shape as a score.'],
    [/Scores well on overall harmony \(12% weight\)\. Camera angle optimization has strong effect\./g, 'No face shape guarantees a higher score; camera perspective can change the outline.'],
    [/Jawline definition score \(18% weight\) naturally strong\. Camera angle particularly important to avoid the face looking too wide\./g, 'Camera distance and lens perspective can make the lower face look wider or narrower.'],
    [/Cheekbone prominence score \(16% weight\) naturally maximized\./g, 'Prominent cheek width is a shape cue, not proof of an attractiveness score.'],
  ]],
  ['mogger-meaning.html', [[/Omoggle uses MediaPipe computer vision to score both players simultaneously across 6 facial metrics:[\s\S]*?Is Omoggle Actually AI<\/a>\./g, 'Omoggle’s current model, inputs and weights are not publicly verifiable. “Mogger” is community slang for the person perceived to outclass another in a comparison; it is not an objective identity or scientific category. See <a href="\/is-omoggle-ai">Is Omoggle Actually AI<\/a>.']]],
])

for (const [name, rules] of replacements) {
  const file = path.join(process.cwd(), 'public', name)
  let source = await fs.readFile(file, 'utf8')
  const before = source
  for (const [pattern, replacement] of rules) source = source.replace(pattern, replacement)
  if (source !== before) {
    source = source.replace(/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/, '"dateModified":"2026-09-14"')
    await fs.writeFile(file, source)
    console.log(`Updated ${name}`)
  } else console.warn(`No matching claim found in ${name}`)
}
