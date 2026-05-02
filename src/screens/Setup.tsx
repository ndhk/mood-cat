import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CatSVG from '../components/CatSVG'
import { saveProfile } from '../db'
import { CAT_PATTERNS } from '../data/moods'

export default function Setup({ onDone }: { onDone: () => Promise<void> }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [catName, setCatName] = useState('')
  const [catPattern, setCatPattern] = useState('tabby')
  const [saving, setSaving] = useState(false)

  async function handleFinish() {
    if (!catName.trim()) return
    setSaving(true)
    await saveProfile({ catName: catName.trim(), catPattern })
    await onDone()
    navigate('/')
  }

  return (
    <div className="app-shell welcome-bg">
      {step === 0 && (
        <div className="screen-center animate-in">
          <div style={{ marginBottom: 8 }}>
            <div className="animate-bounce">
              <CatSVG pattern="tabby" expression="happy" size={160} />
            </div>
          </div>
          <div>
            <h1 className="title" style={{ marginBottom: 8 }}>Meet Mood Cat</h1>
            <p className="body-text">
              Your cat can help you check in with your feelings
              and try one small thing when you need it.
            </p>
          </div>
          <p className="small-text" style={{ background: 'white', borderRadius: 16, padding: '12px 16px', border: '2px solid var(--border)' }}>
            🔒 Everything stays on your device. Nothing is shared.
          </p>
          <button className="btn btn-primary" onClick={() => setStep(1)}>
            Let's go →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="screen animate-in" style={{ justifyContent: 'center', paddingTop: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <CatSVG pattern={catPattern} expression="curious" size={140} />
          </div>
          <div>
            <h2 className="subtitle" style={{ marginBottom: 6 }}>What's your cat called?</h2>
            <p className="small-text" style={{ marginBottom: 16 }}>Give your cat a name. You can change it later.</p>
          </div>
          <input
            className="input-field"
            type="text"
            placeholder="Cat name..."
            value={catName}
            onChange={e => setCatName(e.target.value.slice(0, 20))}
            maxLength={20}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && catName.trim()) setStep(2) }}
            aria-label="Cat name"
          />
          <button
            className="btn btn-primary"
            onClick={() => setStep(2)}
            disabled={!catName.trim()}
            style={{ opacity: catName.trim() ? 1 : 0.5 }}
          >
            Next →
          </button>
          <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
        </div>
      )}

      {step === 2 && (
        <div className="screen animate-in" style={{ paddingTop: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <CatSVG pattern={catPattern} expression="happy" size={130} />
            <h2 className="subtitle" style={{ marginTop: 8, marginBottom: 4 }}>{catName}'s look</h2>
            <p className="small-text" style={{ marginBottom: 16 }}>Choose a colour or pattern.</p>
          </div>
          <div className="pattern-grid">
            {CAT_PATTERNS.map(p => (
              <button
                key={p.key}
                className={`pattern-btn${catPattern === p.key ? ' selected' : ''}`}
                onClick={() => setCatPattern(p.key)}
                aria-pressed={catPattern === p.key}
              >
                <CatSVG pattern={p.key} expression="happy" size={52} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleFinish}
            disabled={saving}
          >
            {saving ? 'Saving...' : `Let's start! 🐾`}
          </button>
          <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
        </div>
      )}
    </div>
  )
}
