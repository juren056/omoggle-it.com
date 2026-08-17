'use client'

import { useState } from 'react'

const rounds = [
  { prompt: 'Which setup gives the AI a clearer comparison?', options: [['A', 'Dim ceiling light · camera below chin'], ['B', 'Soft front light · camera at eye level']], answer: 1, lesson: 'Even front lighting and eye-level framing reduce shadows and perspective distortion.' },
  { prompt: 'Which expression is more consistent for a rating?', options: [['A', 'Relaxed face · eyes open naturally'], ['B', 'Extreme squint · clenched jaw']], answer: 0, lesson: 'A relaxed expression makes landmarks easier to compare across rounds.' },
  { prompt: 'Which camera distance is usually more reliable?', options: [['A', 'Lens extremely close to the nose'], ['B', 'Head and shoulders visible with a little space']], answer: 1, lesson: 'A little distance reduces wide-angle distortion in the center of the face.' },
  { prompt: 'Which background helps the face stand out?', options: [['A', 'Simple background with clear contrast'], ['B', 'Busy room with bright objects behind the head']], answer: 0, lesson: 'A simple background makes face boundaries easier for computer vision to identify.' },
  { prompt: 'Which result should you trust more?', options: [['A', 'One score from one unusual photo'], ['B', 'Several results taken with a repeatable setup']], answer: 1, lesson: 'Scores are subjective and camera-sensitive; repeated, consistent inputs are more informative.' },
]

export default function OmogglePracticeTool() {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [choice, setChoice] = useState(null)
  const [complete, setComplete] = useState(false)
  const current = rounds[round]

  function choose(index) {
    if (choice !== null) return
    setChoice(index)
    if (index === current.answer) setScore(value => value + 1)
  }

  function next() {
    if (round === rounds.length - 1) { setComplete(true); return }
    setRound(value => value + 1)
    setChoice(null)
  }

  function restart() {
    setRound(0)
    setScore(0)
    setChoice(null)
    setComplete(false)
  }

  if (complete) {
    return (
      <section className="practice-tool" aria-live="polite">
        <span className="section-label">Practice Complete</span>
        <div className="practice-final-score">{score}/{rounds.length}</div>
        <h2>{score >= 4 ? 'Setup instincts: strong' : 'Review the setup fundamentals'}</h2>
        <p>This simulator practices camera and presentation choices. It does not predict who is more attractive or guarantee an Omoggle result.</p>
        <button type="button" className="btn btn-primary" onClick={restart}>Practice Again</button>
      </section>
    )
  }

  return (
    <section className="practice-tool" aria-labelledby="practice-prompt">
      <div className="practice-progress"><span>Round {round + 1} of {rounds.length}</span><span>{score} correct</span></div>
      <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${((round + 1) / rounds.length) * 100}%` }} /></div>
      <h2 id="practice-prompt">{current.prompt}</h2>
      <div className="practice-options">
        {current.options.map(([label, description], index) => {
          const state = choice === null ? '' : index === current.answer ? ' correct' : index === choice ? ' incorrect' : ''
          return (
            <button type="button" className={`practice-option${state}`} key={label} onClick={() => choose(index)} disabled={choice !== null}>
              <span>{label}</span><strong>{description}</strong>
            </button>
          )
        })}
      </div>
      {choice !== null && (
        <div className="practice-feedback">
          <strong>{choice === current.answer ? 'Correct.' : 'Not the more reliable setup.'}</strong> {current.lesson}
          <button type="button" className="btn btn-primary" onClick={next}>{round === rounds.length - 1 ? 'See Result' : 'Next Round'}</button>
        </div>
      )}
    </section>
  )
}
