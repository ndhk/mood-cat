import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckIn } from '../hooks/useCheckIn'
import CatSVG from '../components/CatSVG'
import type { Profile } from '../db'

interface Props { profile: Profile }

export default function ReflectionScreen({ profile }: Props) {
  const navigate = useNavigate()
  const { state, setReflection } = useCheckIn()
  const [selected, setSelected] = useState<string | null>(null)
  const [showSupport, setShowSupport] = useState(false)

  if (!state.activity) { navigate('/check-in/mood'); return null }

  function handleSelect(val: 'better' | 'same' | 'worse') {
    setSelected(val)
    setReflection(val)
    if (val === 'worse') {
      setShowSupport(true)
    } else {
      setTimeout(() => navigate('/check-in/note'), 600)
    }
  }

  const options = [
    { key: 'better' as const, label: 'A little better', icon: '🌱', className: 'better' },
    { key: 'same' as const, label: 'About the same', icon: '🌤️', className: 'same' },
    { key: 'worse' as const, label: 'Worse', icon: '🌧️', className: 'worse' },
  ]

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/check-in/activity')} aria-label="Back">←</button>
        <span className="screen-label">Reflection</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <CatSVG pattern={profile.catPattern} expression={selected === 'better' ? 'happy' : selected === 'worse' ? 'sad' : 'calm'} accessory={profile.selectedAccessory ?? undefined} size={110} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 className="subtitle">How do you feel now?</h2>
        <p className="small-text" style={{ marginTop: 6 }}>
          Any answer is okay. Feelings are allowed.
        </p>
      </div>

      {!showSupport && (
        <div className="reflection-grid">
          {options.map(opt => (
            <button
              key={opt.key}
              className={`reflection-btn ${opt.className}${selected === opt.key ? ' selected' : ''}`}
              onClick={() => handleSelect(opt.key)}
              aria-pressed={selected === opt.key}
            >
              <span className="reflection-icon">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {showSupport && (
        <div className="animate-in">
          <div className="support-box" style={{ marginBottom: 16 }}>
            <span className="support-box-icon">🐱</span>
            <div>
              <p className="heading" style={{ marginBottom: 6 }}>Some feelings are too big to carry alone.</p>
              <p className="body-text">Please tell a trusted adult now.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => navigate('/check-in/activity')}>
              Try another activity
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/check-in/note')}>
              Write or draw what's going on
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/check-in/note')}>
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
