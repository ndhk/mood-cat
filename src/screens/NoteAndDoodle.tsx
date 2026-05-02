import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckIn } from '../hooks/useCheckIn'
import { saveCheckIn, saveDoodle } from '../db'
import type { CheckIn, Doodle } from '../db'

interface Props {
  onCheckInComplete: (newUnlocks: string[]) => void
  addPawPrint: () => Promise<{ newTotal: number; newUnlocks: string[] }>
}

const COLOURS = ['#2c2420', '#f07060', '#f5a623', '#7ab893', '#6db3d4', '#a78fd4', '#ffffff']

export default function NoteAndDoodle({ onCheckInComplete, addPawPrint }: Props) {
  const navigate = useNavigate()
  const { state, setNote, setDoodleData, reset } = useCheckIn()
  const [tab, setTab] = useState<'choice' | 'note' | 'doodle'>('choice')
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(false)

  // Doodle state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil')
  const [colour, setColour] = useState(COLOURS[0])
  const [size, setSize] = useState(4)
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  if (!state.activity || !state.reflection) {
    navigate('/check-in/mood')
    return null
  }

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function drawDot(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawLine(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) {
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    const pos = getPos(e)
    lastPos.current = pos
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.lineWidth = tool === 'eraser' ? 24 : size * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    drawDot(ctx, pos)
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const pos = getPos(e)
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = colour
    ctx.lineWidth = tool === 'eraser' ? 24 : size * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (lastPos.current) drawLine(ctx, lastPos.current, pos)
    lastPos.current = pos
  }

  function pointerUp() {
    drawing.current = false
    lastPos.current = null
    // Save doodle data
    const data = canvasRef.current?.toDataURL('image/png')
    if (data) setDoodleData(data)
  }

  function clearCanvas() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setDoodleData('')
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)

    try {
      const note = tab === 'note' ? noteText : ''
      const doodle = tab === 'doodle' ? state.doodleData : null
      if (tab === 'note') setNote(note)

      const doodleId = doodle ? `doodle-${Date.now()}` : null
      const checkInId = `checkin-${Date.now()}`
      const now = new Date().toISOString()

      const checkIn: CheckIn = {
        id: checkInId,
        date: now.split('T')[0],
        mood: state.mood!,
        followUp: state.followUp!,
        activityId: state.activity!.id,
        activityCompleted: state.activityCompleted,
        reflection: state.reflection!,
        note,
        doodleId,
        createdAt: now,
      }

      await saveCheckIn(checkIn)

      if (doodle && doodleId) {
        const doodleRecord: Doodle = {
          id: doodleId,
          checkInId,
          imageData: doodle,
          createdAt: now,
        }
        await saveDoodle(doodleRecord)
      }

      const { newUnlocks } = await addPawPrint()
      reset()
      onCheckInComplete(newUnlocks)
      navigate('/')
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  // Choice screen
  if (tab === 'choice') return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => navigate('/check-in/reflection')} aria-label="Back">←</button>
        <span className="screen-label">Almost done</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <p style={{ fontSize: '2rem', marginBottom: 8 }}>🐾</p>
        <h2 className="subtitle">Want to add something?</h2>
        <p className="body-text" style={{ marginTop: 6 }}>Totally optional.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-secondary" onClick={() => setTab('note')}>
          📝 Write a note
        </button>
        <button className="btn btn-secondary" onClick={() => setTab('doodle')}>
          🎨 Draw a doodle
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Finish check-in 🐾'}
        </button>
      </div>
    </div>
  )

  if (tab === 'note') return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => setTab('choice')} aria-label="Back">←</button>
        <span className="screen-label">Note</span>
        <div style={{ width: 40 }} />
      </div>
      <h2 className="subtitle" style={{ marginTop: 4 }}>Write a little, if you want</h2>
      <textarea
        className="input-field"
        style={{ minHeight: 150 }}
        placeholder="Write a little about today, if you want."
        value={noteText}
        onChange={e => { setNoteText(e.target.value.slice(0, 500)); setNote(e.target.value.slice(0, 500)) }}
        maxLength={500}
        aria-label="Today's note"
      />
      <p className="small-text" style={{ textAlign: 'right' }}>{noteText.length}/500</p>
      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save and finish 🐾'}
      </button>
      <button className="btn btn-ghost" onClick={() => { setNoteText(''); setTab('choice') }}>← Back</button>
    </div>
  )

  // Doodle tab
  return (
    <div className="screen animate-in">
      <div className="top-bar" style={{ padding: '0 0 4px' }}>
        <button className="back-btn" onClick={() => setTab('choice')} aria-label="Back">←</button>
        <span className="screen-label">Doodle</span>
        <div style={{ width: 40 }} />
      </div>

      <h2 className="subtitle" style={{ marginTop: 4 }}>Draw something</h2>

      {/* Canvas */}
      <div style={{ background: 'white', borderRadius: 20, padding: 4, boxShadow: '0 2px 12px var(--shadow)' }}>
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="doodle-canvas"
          style={{ width: '100%', height: 'auto', borderRadius: 16 }}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerLeave={pointerUp}
          aria-label="Drawing canvas"
        />
      </div>

      {/* Toolbar */}
      <div className="doodle-toolbar">
        <button
          className={`tool-btn${tool === 'pencil' ? ' active' : ''}`}
          onClick={() => setTool('pencil')}
          aria-pressed={tool === 'pencil'}
          aria-label="Pencil"
        >✏️</button>
        <button
          className={`tool-btn${tool === 'eraser' ? ' active' : ''}`}
          onClick={() => setTool('eraser')}
          aria-pressed={tool === 'eraser'}
          aria-label="Eraser"
        >🧹</button>
        <button className="tool-btn" onClick={clearCanvas} aria-label="Clear canvas">🗑️</button>
        <div style={{ width: 1, height: 32, background: 'var(--border)', margin: '0 4px' }} />
        {COLOURS.map(c => (
          <button
            key={c}
            className={`color-swatch${colour === c ? ' active' : ''}`}
            style={{ background: c, border: c === '#ffffff' ? '2.5px solid var(--border)' : undefined }}
            onClick={() => { setColour(c); setTool('pencil') }}
            aria-label={`Colour ${c}`}
            aria-pressed={colour === c}
          />
        ))}
      </div>

      {/* Size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="small-text">Thin</span>
        <input
          type="range" min={2} max={16} value={size}
          onChange={e => setSize(Number(e.target.value))}
          style={{ flex: 1 }}
          aria-label="Brush size"
        />
        <span className="small-text">Thick</span>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save and finish 🐾'}
      </button>
      <button className="btn btn-ghost" onClick={() => setTab('choice')}>← Back</button>
    </div>
  )
}
