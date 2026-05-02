import { useNavigate } from 'react-router-dom'
import { MOODS, NOT_SURE_MOOD } from '../data/moods'
import { useCheckIn } from '../hooks/useCheckIn'
import type { Profile } from '../db'

interface Props { profile: Profile }

export default function MoodScreen({ profile }: Props) {
  const navigate = useNavigate()
  const { setMood, reset } = useCheckIn()

  function handleSelect(moodKey: string) {
    reset()
    setMood(moodKey)
    navigate('/check-in/follow-up')
  }

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/')} aria-label="Back to home">←</button>
        <span className="screen-label">Check-in</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ textAlign: 'center', paddingTop: 4 }}>
        <h2 className="subtitle">How are you feeling today?</h2>
        <p className="small-text" style={{ marginTop: 6 }}>
          Hi {profile.catName} is here with you. Choose what feels right.
        </p>
      </div>

      <div className="mood-grid">
        {MOODS.map(mood => (
          <button
            key={mood.key}
            className={`mood-btn ${mood.key}`}
            onClick={() => handleSelect(mood.key)}
            aria-label={`Feeling ${mood.label}`}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>

      <button
        className="mood-btn mood-btn-not-sure"
        onClick={() => handleSelect(NOT_SURE_MOOD.key)}
        aria-label="Not sure how I feel"
      >
        <span className="mood-emoji">{NOT_SURE_MOOD.emoji}</span>
        <span>Not sure</span>
      </button>

      <p className="small-text" style={{ textAlign: 'center' }}>
        There is no wrong answer.
      </p>
    </div>
  )
}
