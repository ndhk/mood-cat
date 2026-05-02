import { useNavigate } from 'react-router-dom'
import { MOODS, NOT_SURE_MOOD } from '../data/moods'
import { useCheckIn } from '../hooks/useCheckIn'
import CatSVG from '../components/CatSVG'
import type { Profile } from '../db'

interface Props { profile: Profile }

export default function FollowUp({ profile }: Props) {
  const navigate = useNavigate()
  const { state, setFollowUp, setActivity } = useCheckIn()

  const moodData = state.mood === 'not_sure'
    ? NOT_SURE_MOOD
    : MOODS.find(m => m.key === state.mood)

  if (!moodData) {
    navigate('/check-in/mood')
    return null
  }

  function handleSelect(optionKey: string) {
    const option = moodData!.options.find(o => o.key === optionKey)
    if (!option) return
    setFollowUp(optionKey)
    // Pick first activity by default
    setActivity(option.activities[0])
    navigate('/check-in/activity')
  }

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/check-in/mood')} aria-label="Back">←</button>
        <span className="screen-label">Check-in</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Cat */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 4 }}>
        <CatSVG
          pattern={profile.catPattern}
          expression={moodData.catExpression}
          accessory={profile.selectedAccessory ?? undefined}
          size={120}
        />
        <p className="small-text" style={{
          background: 'white',
          border: '2px solid var(--border)',
          borderRadius: 14,
          padding: '10px 14px',
          maxWidth: 280,
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          {moodData.catMessage}
        </p>
      </div>

      <h2 className="subtitle" style={{ textAlign: 'center', fontSize: '1.2rem' }}>
        {moodData.followUpQuestion}
      </h2>

      <div className="option-list">
        {moodData.options.map(opt => (
          <button
            key={opt.key}
            className="option-btn"
            onClick={() => handleSelect(opt.key)}
            aria-label={opt.label}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
