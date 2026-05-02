import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exportAllData, deleteAllData } from '../db'

interface Props { onReset: () => void }

export default function SettingsScreen({ onReset }: Props) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleExport() {
    const data = await exportAllData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mood-cat-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    setDeleting(true)
    await deleteAllData()
    onReset()
    navigate('/setup')
  }

  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/')} aria-label="Back to home">←</button>
        <span className="screen-label">Settings</span>
        <div style={{ width: 40 }} />
      </div>

      <h2 className="subtitle" style={{ marginTop: 4 }}>Settings</h2>

      {/* Safety note */}
      <div className="support-box">
        <span className="support-box-icon">🐱</span>
        <p className="small-text">
          Mood Cat is for check-ins and small calming activities.
          It is not for emergencies. If you feel unsafe or very upset,
          tell a trusted adult now.
        </p>
      </div>

      {/* Privacy info */}
      <div className="card">
        <p className="heading" style={{ marginBottom: 8 }}>Your privacy</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '🔒 No login or account',
            '📱 Everything stays on this device',
            '👁️ No parent dashboard',
            '🚫 No tracking or advertising',
          ].map(item => (
            <li key={item} className="small-text">{item}</li>
          ))}
        </ul>
      </div>

      {/* Export */}
      <div className="card">
        <p className="heading" style={{ marginBottom: 6 }}>Your data</p>
        <p className="small-text" style={{ marginBottom: 12 }}>
          Download a copy of all your check-ins and settings as a JSON file.
        </p>
        <button className="btn btn-secondary" onClick={handleExport}>
          📥 Export my data
        </button>
      </div>

      {/* Delete */}
      <div className="card" style={{ border: '2px solid var(--coral-light)' }}>
        <p className="heading" style={{ marginBottom: 6 }}>Delete all data</p>
        <p className="small-text" style={{ marginBottom: 12 }}>
          This will delete your Mood Cat history on this device. It cannot be undone.
        </p>

        {!confirmDelete ? (
          <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
            🗑️ Delete all data
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="small-text" style={{ fontWeight: 700, color: 'var(--coral)' }}>
              Are you sure? This cannot be undone.
            </p>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, delete everything'}
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <p className="small-text" style={{ textAlign: 'center' }}>
        Mood Cat v1.0
      </p>
    </div>
  )
}
