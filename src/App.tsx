import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import './styles.css'

import { useAppState } from './hooks/useAppState'
import { CheckInProvider } from './hooks/useCheckIn'

import Setup from './screens/Setup'
import Home from './screens/Home'
import MoodScreen from './screens/MoodScreen'
import FollowUp from './screens/FollowUp'
import ActivityScreen from './screens/ActivityScreen'
import ReflectionScreen from './screens/ReflectionScreen'
import NoteAndDoodle from './screens/NoteAndDoodle'
import HistoryScreen from './screens/HistoryScreen'
import CatCustomise from './screens/CatCustomise'
import SettingsScreen from './screens/SettingsScreen'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const p = location.pathname

  return (
    <nav className="nav-bar" role="navigation" aria-label="Main navigation">
      <button className={'nav-btn' + (p === '/' ? ' active' : '')} onClick={() => navigate('/')} aria-current={p === '/' ? 'page' : undefined}>
        <span className="nav-icon">🏠</span>
        <span>Home</span>
      </button>
      <button className={'nav-btn' + (p === '/history' ? ' active' : '')} onClick={() => navigate('/history')} aria-current={p === '/history' ? 'page' : undefined}>
        <span className="nav-icon">📅</span>
        <span>History</span>
      </button>
      <button className={'nav-btn' + (p === '/cat' ? ' active' : '')} onClick={() => navigate('/cat')} aria-current={p === '/cat' ? 'page' : undefined}>
        <span className="nav-icon">🐱</span>
        <span>My cat</span>
      </button>
      <button className={'nav-btn' + (p === '/settings' ? ' active' : '')} onClick={() => navigate('/settings')} aria-current={p === '/settings' ? 'page' : undefined}>
        <span className="nav-icon">⚙️</span>
        <span>Settings</span>
      </button>
    </nav>
  )
}

function UnlockToast({ items, onDone }: { items: string[]; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  const labels: Record<string, string> = {
    blue_collar: 'Blue Collar', star_background: 'Star Background',
    cosy_blanket: 'Cosy Blanket', fish_toy: 'Fish Toy', wizard_hat: 'Wizard Hat',
    moon_background: 'Moon Background', sparkle_collar: 'Sparkle Collar',
    cat_bed: 'Cat Bed', crown: 'Crown',
  }

  return (
    <div className="unlock-toast" role="alert" aria-live="polite">
      🐾 You earned a paw print!
      {items.length > 0 && (
        <div style={{ marginTop: 4, fontSize: '0.9rem', opacity: 0.9 }}>
          🎉 New unlock: {items.map(i => labels[i] || i).join(', ')}
        </div>
      )}
    </div>
  )
}

function PawToast({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="unlock-toast" role="alert" aria-live="polite">
      🐾 You earned a paw print!
    </div>
  )
}

const NAV_PATHS = ['/', '/history', '/cat', '/settings']

export default function App() {
  const { profile, rewards, loading, refresh, addPawPrint } = useAppState()
  const location = useLocation()
  const [unlockItems, setUnlockItems] = useState<string[]>([])
  const [showPawToast, setShowPawToast] = useState(false)

  async function handleCheckInComplete(newUnlocks: string[]) {
    await refresh()
    if (newUnlocks.length > 0) {
      setUnlockItems(newUnlocks)
    } else {
      setShowPawToast(true)
    }
  }

  if (loading) {
    return (
      <div className="app-shell screen-center">
        <span style={{ fontSize: '3rem' }}>🐱</span>
        <p className="body-text">Loading...</p>
      </div>
    )
  }

  const showNav = NAV_PATHS.includes(location.pathname)
  const isSetup = !profile

  return (
    <div className="app-shell">
      <CheckInProvider>
        {unlockItems.length > 0 && (
          <UnlockToast items={unlockItems} onDone={() => setUnlockItems([])} />
        )}
        {showPawToast && (
          <PawToast onDone={() => setShowPawToast(false)} />
        )}

        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/setup" element={<Setup onDone={refresh} />} />

            {isSetup ? (
              <Route path="*" element={<Navigate to="/setup" replace />} />
            ) : (
              <>
                <Route path="/" element={<Home profile={profile!} rewards={rewards!} />} />
                <Route path="/check-in/mood" element={<MoodScreen profile={profile!} />} />
                <Route path="/check-in/follow-up" element={<FollowUp profile={profile!} />} />
                <Route path="/check-in/activity" element={<ActivityScreen profile={profile!} />} />
                <Route path="/check-in/reflection" element={<ReflectionScreen profile={profile!} />} />
                <Route
                  path="/check-in/note"
                  element={
                    <NoteAndDoodle
                      onCheckInComplete={handleCheckInComplete}
                      addPawPrint={addPawPrint}
                    />
                  }
                />
                <Route path="/history" element={<HistoryScreen />} />
                <Route path="/cat" element={<CatCustomise profile={profile!} rewards={rewards!} onUpdate={refresh} />} />
                <Route path="/settings" element={<SettingsScreen onReset={refresh} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>

        {!isSetup && showNav && <NavBar />}
      </CheckInProvider>
    </div>
  )
}
