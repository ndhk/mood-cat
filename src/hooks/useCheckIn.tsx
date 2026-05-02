import React, { createContext, useContext, useState } from 'react'
import type { Activity } from '../data/moods'

export interface CheckInState {
  mood: string | null
  followUp: string | null
  activity: Activity | null
  activityCompleted: boolean
  reflection: 'better' | 'same' | 'worse' | null
  note: string
  doodleData: string | null
}

interface CheckInContextType {
  state: CheckInState
  setMood: (mood: string) => void
  setFollowUp: (followUp: string) => void
  setActivity: (activity: Activity) => void
  setActivityCompleted: (done: boolean) => void
  setReflection: (r: 'better' | 'same' | 'worse') => void
  setNote: (note: string) => void
  setDoodleData: (data: string) => void
  reset: () => void
}

const defaultState: CheckInState = {
  mood: null,
  followUp: null,
  activity: null,
  activityCompleted: false,
  reflection: null,
  note: '',
  doodleData: null,
}

const CheckInContext = createContext<CheckInContextType | null>(null)

export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CheckInState>(defaultState)

  const setMood = (mood: string) => setState(s => ({ ...s, mood, followUp: null, activity: null }))
  const setFollowUp = (followUp: string) => setState(s => ({ ...s, followUp, activity: null }))
  const setActivity = (activity: Activity) => setState(s => ({ ...s, activity }))
  const setActivityCompleted = (done: boolean) => setState(s => ({ ...s, activityCompleted: done }))
  const setReflection = (reflection: 'better' | 'same' | 'worse') => setState(s => ({ ...s, reflection }))
  const setNote = (note: string) => setState(s => ({ ...s, note }))
  const setDoodleData = (doodleData: string) => setState(s => ({ ...s, doodleData }))
  const reset = () => setState(defaultState)

  return (
    <CheckInContext.Provider value={{ state, setMood, setFollowUp, setActivity, setActivityCompleted, setReflection, setNote, setDoodleData, reset }}>
      {children}
    </CheckInContext.Provider>
  )
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext)
  if (!ctx) throw new Error('useCheckIn must be used within CheckInProvider')
  return ctx
}
