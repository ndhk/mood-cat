import { useNavigate } from 'react-router-dom'
import CatSVG from '../components/CatSVG'
import type { Profile, Rewards } from '../db'
import { UNLOCK_THRESHOLDS } from '../data/moods'

interface HomeProps {
  profile: Profile
  rewards: Rewards
}

export default function Home({ profile, rewards }: HomeProps) {
  const navigate = useNavigate()
  const paws = rewards.pawPrints

  // Progress to next unlock
  const thresholds = Object.keys(UNLOCK_THRESHOLDS).map(Number).sort((a, b) => a - b)
  const nextThreshold = thresholds.find(t => t > paws) ?? null
  const prevThreshold = [...thresholds].reverse().find(t => t <= paws) ?? 0
  const progress = nextThreshold ? (paws - prevThreshold) / (nextThreshold - prevThreshold) : 1

  function greeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Hey there'
    return 'Good evening'
  }

  return (
    <div className="screen animate-in" style={{ paddingTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="title" style={{ fontSize: '1.6rem' }}>Mood Cat</h1>
          <p className="small-text" style={{ marginTop: 2 }}>{greeting()}, friend 👋</p>
        </div>
        <div className="paw-counter" role="status" aria-label={`${paws} paw prints`}>
          🐾 {paws}
        </div>
      </div>

      {/* Cat display */}
      <div style={{ background: 'white', borderRadius: 28, padding: '16px 20px', boxShadow: '0 2px 12px var(--shadow)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <CatSVG
            pattern={profile.catPattern}
            expression="happy"
            accessory={profile.selectedAccessory ?? undefined}
            size={160}
          />
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)' }}>
          Hi, I'm {profile.catName}.
        </p>
        <p className="body-text" style={{ marginTop: 4 }}>Want to do a check-in?</p>
      </div>

      {/* Check-in button */}
      <button
        className="btn btn-primary"
        style={{ fontSize: '1.15rem', padding: '18px 28px' }}
        onClick={() => navigate('/check-in/mood')}
      >
        Start check-in 🐾
      </button>

      {/* Progress to next unlock */}
      {nextThreshold && (
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="small-text" style={{ fontWeight: 700 }}>Next reward</span>
            <span className="small-text">{paws} / {nextThreshold} 🐾</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      )}

      {/* Nav actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={() => navigate('/history')}
        >
          📅 History
        </button>
        <button
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={() => navigate('/cat')}
        >
          🎨 My cat
        </button>
      </div>
    </div>
  )
}
