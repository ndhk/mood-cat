import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOODS, NOT_SURE_MOOD } from '../data/moods'
import { useCheckIn } from '../hooks/useCheckIn'
import CatSVG from '../components/CatSVG'
import type { Profile } from '../db'

const TOTAL = 5 * 60 // 5 minutes in seconds

interface Props { profile: Profile }

export default function ActivityScreen({ profile }: Props) {
  const navigate = useNavigate()
  const { state, setActivity, setActivityCompleted } = useCheckIn()
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const moodData = state.mood === 'not_sure'
    ? NOT_SURE_MOOD
    : MOODS.find(m => m.key === state.mood)

  const currentOption = moodData?.options.find(o => o.key === state.followUp)

  // Navigate away if state invalid
  if (!state.activity || !moodData || !currentOption) {
    navigate('/check-in/mood')
    return null
  }

  const activity = state.activity

  const tick = useCallback(() => {
    setTimeLeft(t => {
      if (t <= 1) {
        setRunning(false)
        setDone(true)
        return 0
      }
      return t - 1
    })
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, tick])

  function handleDone() {
    setRunning(false)
    setActivityCompleted(true)
    navigate('/check-in/reflection')
  }

  function handleTryAnother() {
    const options = currentOption!.activities
    if (options.length <= 1) return
    const currentIdx = options.indexOf(activity)
    const next = options[(currentIdx + 1) % options.length]
    setActivity(next)
    setTimeLeft(TOTAL)
    setRunning(false)
    setDone(false)
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const pct = timeLeft / TOTAL
  const circumference = 2 * Math.PI * 54

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => { setRunning(false); navigate('/check-in/follow-up') }} aria-label="Back">←</button>
        <span className="screen-label">Activity</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Cat */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CatSVG pattern={profile.catPattern} expression={moodData.catExpression} accessory={profile.selectedAccessory ?? undefined} size={100} />
      </div>

      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>
          {activity.title}
        </h2>
        <p className="small-text" style={{ marginBottom: 16, fontStyle: 'italic' }}>
          This might help a little. ✨
        </p>
        <ul className="instructions-list">
          {activity.instructions.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timer */}
      {!done ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="timer-ring" role="timer" aria-live="polite" aria-label={`${mins}:${String(secs).padStart(2, '0')} remaining`}>
            <svg viewBox="0 0 120 120" width="140" height="140">
              <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke="var(--amber)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="timer-ring-text">
              {mins}:{String(secs).padStart(2, '0')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setRunning(r => !r)}
              aria-label={running ? 'Pause timer' : 'Start timer'}
            >
              {running ? '⏸ Pause' : '▶ Start timer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', background: 'var(--sage-light)', border: '2px solid var(--sage)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 4 }}>✨</p>
          <p className="heading">Done. Good job trying one small thing.</p>
        </div>
      )}

      {/* Action buttons */}
      <button className="btn btn-primary" onClick={handleDone}>
        I've done it 🐾
      </button>

      {currentOption.activities.length > 1 && (
        <button className="btn btn-ghost" onClick={handleTryAnother}>
          Try another idea
        </button>
      )}
    </div>
  )
}
