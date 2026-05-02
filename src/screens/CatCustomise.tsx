import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CatSVG from '../components/CatSVG'
import { saveProfile } from '../db'
import { CAT_PATTERNS, ACCESSORY_LABELS, BACKGROUND_LABELS, UNLOCK_THRESHOLDS } from '../data/moods'
import type { Profile, Rewards } from '../db'

interface Props {
  profile: Profile
  rewards: Rewards
  onUpdate: () => void
}

export default function CatCustomise({ profile, rewards, onUpdate }: Props) {
  const navigate = useNavigate()
  const [catName, setCatName] = useState(profile.catName)
  const [catPattern, setCatPattern] = useState(profile.catPattern)
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(profile.selectedAccessory)
  const [saving, setSaving] = useState(false)

  const unlocked = rewards.unlockedItems

  const accessories = Object.entries(ACCESSORY_LABELS).map(([key, label]) => ({
    key,
    label,
    type: 'accessory' as const,
  }))
  const backgrounds = Object.entries(BACKGROUND_LABELS).map(([key, label]) => ({
    key,
    label,
    type: 'background' as const,
  }))

  // Find what paw count unlocks each item
  const itemThreshold: Record<string, number> = {}
  Object.entries(UNLOCK_THRESHOLDS).forEach(([t, item]) => { itemThreshold[item] = Number(t) })

  async function handleSave() {
    setSaving(true)
    await saveProfile({
      catName: catName.trim() || profile.catName,
      catPattern,
      selectedAccessory,
    })
    onUpdate()
    setSaving(false)
    navigate('/')
  }

  function AccessoryItem({ item }: { item: { key: string; label: string } }) {
    const isUnlocked = unlocked.includes(item.key)
    const needed = itemThreshold[item.key] ?? 0
    const isSelected = selectedAccessory === item.key

    return (
      <button
        className={`accessory-btn ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`}
        onClick={() => isUnlocked && setSelectedAccessory(isSelected ? null : item.key)}
        disabled={!isUnlocked}
        aria-pressed={isSelected}
        aria-label={`${item.label}${!isUnlocked ? `, locked until ${needed} paw prints` : ''}`}
      >
        {!isUnlocked && <span className="lock-badge">🔒</span>}
        <span style={{ fontSize: '1.5rem' }}>
          {item.key.includes('collar') ? '📿' :
           item.key.includes('background') ? '🌟' :
           item.key === 'cosy_blanket' ? '🛏️' :
           item.key === 'fish_toy' ? '🐟' :
           item.key === 'wizard_hat' ? '🧙' :
           item.key === 'cat_bed' ? '🛌' :
           item.key === 'crown' ? '👑' : '✨'}
        </span>
        <span>{item.label}</span>
        {!isUnlocked && (
          <span style={{ fontSize: '0.65rem', color: 'var(--ink-soft)' }}>🐾 {needed}</span>
        )}
      </button>
    )
  }

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/')} aria-label="Back to home">←</button>
        <span className="screen-label">My cat</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Preview */}
      <div style={{ background: 'white', borderRadius: 24, padding: '16px 20px', boxShadow: '0 2px 12px var(--shadow)', textAlign: 'center' }}>
        <CatSVG pattern={catPattern} expression="happy" accessory={selectedAccessory ?? undefined} size={150} />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginTop: 8 }}>{catName || 'My cat'}</p>
        <p className="small-text">🐾 {rewards.pawPrints} paw prints</p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="cat-name" className="small-text" style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>Cat name</label>
        <input
          id="cat-name"
          className="input-field"
          type="text"
          value={catName}
          onChange={e => setCatName(e.target.value.slice(0, 20))}
          maxLength={20}
          placeholder="Enter name..."
        />
      </div>

      {/* Pattern */}
      <div>
        <p className="small-text" style={{ fontWeight: 700, marginBottom: 8 }}>Colour / pattern</p>
        <div className="pattern-grid">
          {CAT_PATTERNS.map(p => (
            <button
              key={p.key}
              className={`pattern-btn${catPattern === p.key ? ' selected' : ''}`}
              onClick={() => setCatPattern(p.key)}
              aria-pressed={catPattern === p.key}
            >
              <CatSVG pattern={p.key} expression="happy" size={48} />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <p className="small-text" style={{ fontWeight: 700, marginBottom: 8 }}>Accessories</p>
        <div className="accessory-grid">
          <button
            className={`accessory-btn unlocked${!selectedAccessory ? ' selected' : ''}`}
            onClick={() => setSelectedAccessory(null)}
            aria-pressed={!selectedAccessory}
          >
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <span>None</span>
          </button>
          {accessories.map(item => <AccessoryItem key={item.key} item={item} />)}
          {backgrounds.map(item => <AccessoryItem key={item.key} item={item} />)}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save changes 🐾'}
      </button>
    </div>
  )
}
