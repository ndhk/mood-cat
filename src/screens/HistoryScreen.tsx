import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCheckIns, getDoodle } from '../db'
import type { CheckIn } from '../db'
import { MOODS, NOT_SURE_MOOD } from '../data/moods'

function getMoodEmoji(key: string) {
  if (key === 'not_sure') return NOT_SURE_MOOD.emoji
  return MOODS.find(m => m.key === key)?.emoji ?? '🐱'
}

function getMoodLabel(key: string) {
  if (key === 'not_sure') return 'Not sure'
  return MOODS.find(m => m.key === key)?.label ?? key
}

function reflectionLabel(r: string) {
  if (r === 'better') return '🌱 A little better'
  if (r === 'same') return '🌤️ About the same'
  if (r === 'worse') return '🌧️ Felt worse'
  return r
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

function getThisWeekCheckIns(checkIns: CheckIn[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return checkIns.filter(c => new Date(c.date + 'T12:00:00') >= startOfWeek)
}

export default function HistoryScreen() {
  const navigate = useNavigate()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [doodles, setDoodles] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const all = await getAllCheckIns()
      setCheckIns(all)
      // Load doodle thumbnails
      const dd: Record<string, string> = {}
      await Promise.all(
        all.filter(c => c.doodleId).map(async c => {
          const d = await getDoodle(c.doodleId!)
          if (d) dd[c.doodleId!] = d.imageData
        })
      )
      setDoodles(dd)
      setLoading(false)
    }
    load()
  }, [])

  const thisWeek = getThisWeekCheckIns(checkIns)

  // Weekly mood counts
  const moodCounts: Record<string, number> = {}
  thisWeek.forEach(c => { moodCounts[c.mood] = (moodCounts[c.mood] ?? 0) + 1 })

  function WeeklySummary() {
    if (thisWeek.length === 0) return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p className="body-text">No check-ins this week yet.</p>
        <p className="small-text">Start one today! 🐾</p>
      </div>
    )

    const moodSummary = Object.entries(moodCounts).map(([mood, count]) =>
      `${count} ${getMoodLabel(mood).toLowerCase()}`
    ).join(', ')

    return (
      <div className="card">
        <p className="heading" style={{ marginBottom: 8 }}>This week</p>
        <p className="body-text">
          You checked in {thisWeek.length} time{thisWeek.length !== 1 ? 's' : ''}.
        </p>
        {moodSummary && (
          <p className="small-text" style={{ marginTop: 6 }}>
            {Object.entries(moodCounts).map(([mood, count]) => (
              <span key={mood} className="mood-pill" style={{ marginRight: 6, marginTop: 4 }}>
                {getMoodEmoji(mood)} {count} {getMoodLabel(mood).toLowerCase()}
              </span>
            ))}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/')} aria-label="Back to home">←</button>
        <span className="screen-label">History</span>
        <div style={{ width: 40 }} />
      </div>

      <h2 className="subtitle" style={{ marginTop: 4 }}>Your check-ins</h2>

      <WeeklySummary />

      {loading && <p className="body-text" style={{ textAlign: 'center' }}>Loading...</p>}

      {!loading && checkIns.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 24 }}>
          <p style={{ fontSize: '3rem' }}>🐱</p>
          <p className="body-text" style={{ marginTop: 8 }}>No check-ins yet.</p>
          <p className="small-text" style={{ marginTop: 4 }}>Your history will appear here.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {checkIns.map(c => (
          <div key={c.id} className="history-entry">
            <span className="history-mood-icon" role="img" aria-label={getMoodLabel(c.mood)}>
              {getMoodEmoji(c.mood)}
            </span>
            <div className="history-meta">
              <span className="history-date">{formatDate(c.date)}</span>
              <span className="small-text" style={{ fontWeight: 700 }}>{getMoodLabel(c.mood)}</span>
              <span className="small-text">{reflectionLabel(c.reflection)}</span>
              {c.note && (
                <span className="small-text" style={{ fontStyle: 'italic', marginTop: 2 }}>
                  "{c.note.slice(0, 60)}{c.note.length > 60 ? '...' : ''}"
                </span>
              )}
            </div>
            {c.doodleId && doodles[c.doodleId] && (
              <img
                src={doodles[c.doodleId]}
                alt="Doodle from this check-in"
                className="history-doodle-thumb"
              />
            )}
          </div>
        ))}
      </div>

      {checkIns.length > 0 && (
        <p className="small-text" style={{ textAlign: 'center' }}>
          {checkIns.length} check-in{checkIns.length !== 1 ? 's' : ''} total
        </p>
      )}
    </div>
  )
}
