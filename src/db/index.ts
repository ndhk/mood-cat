import Dexie, { type Table } from 'dexie'
import type { PlatformEventV1 } from '../core/schema/platformEvent'

interface MetaRecord {
  key: string
  value: unknown
}

export interface Profile {
  id: string
  catName: string
  catPattern: string
  selectedAccessory: string | null
  selectedBackground: string | null
  createdAt: string
  updatedAt: string
}

export interface CheckIn {
  id: string
  date: string
  mood: string
  followUp: string
  activityId: string
  activityCompleted: boolean
  reflection: 'better' | 'same' | 'worse'
  note: string
  doodleId: string | null
  createdAt: string
}

export interface Doodle {
  id: string
  checkInId: string
  imageData: string
  createdAt: string
}

export interface Rewards {
  id: string
  pawPrints: number
  unlockedItems: string[]
  lastCheckInDate: string | null
}

class MoodCatDB extends Dexie {
  profile!: Table<Profile>
  checkIns!: Table<CheckIn>
  doodles!: Table<Doodle>
  rewards!: Table<Rewards>
  events!: Table<PlatformEventV1>
  meta!: Table<MetaRecord>

  constructor() {
    super('MoodCatDB')
    this.version(1).stores({
      profile: 'id',
      checkIns: 'id, date, mood',
      doodles: 'id, checkInId',
      rewards: 'id',
    })
    this.version(2).stores({
      events: 'id, module, eventType, profileId, occurredAt, createdAt',
      meta: 'key',
    })
  }
}

export const db = new MoodCatDB()

// Helper functions
export async function getProfile(): Promise<Profile | undefined> {
  return db.profile.get('local-default')
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  const existing = await getProfile()
  const now = new Date().toISOString()
  if (existing) {
    await db.profile.update('local-default', { ...profile, updatedAt: now })
  } else {
    await db.profile.put({
      id: 'local-default',
      catName: 'Whiskers',
      catPattern: 'tabby',
      selectedAccessory: null,
      selectedBackground: null,
      createdAt: now,
      updatedAt: now,
      ...profile,
    })
  }
}

export async function getRewards(): Promise<Rewards> {
  const r = await db.rewards.get('main')
  if (r) return r
  const fresh: Rewards = { id: 'main', pawPrints: 0, unlockedItems: [], lastCheckInDate: null }
  await db.rewards.put(fresh)
  return fresh
}

export async function addPawPrint(): Promise<{ newTotal: number; newUnlocks: string[] }> {
  const rewards = await getRewards()
  const newTotal = rewards.pawPrints + 1
  const today = new Date().toISOString().split('T')[0]

  const UNLOCK_THRESHOLDS: Record<number, string> = {
    3: 'blue_collar',
    5: 'star_background',
    10: 'cosy_blanket',
    15: 'fish_toy',
    20: 'wizard_hat',
    25: 'moon_background',
    30: 'sparkle_collar',
    40: 'cat_bed',
    50: 'crown',
  }

  const newUnlocks: string[] = []
  Object.entries(UNLOCK_THRESHOLDS).forEach(([threshold, item]) => {
    const t = Number(threshold)
    if (newTotal >= t && !rewards.unlockedItems.includes(item)) {
      newUnlocks.push(item)
    }
  })

  await db.rewards.update('main', {
    pawPrints: newTotal,
    unlockedItems: [...rewards.unlockedItems, ...newUnlocks],
    lastCheckInDate: today,
  })

  return { newTotal, newUnlocks }
}

export async function getAllCheckIns(): Promise<CheckIn[]> {
  return db.checkIns.orderBy('date').reverse().toArray()
}

export async function saveCheckIn(checkIn: CheckIn): Promise<void> {
  await db.checkIns.put(checkIn)
  try {
    const { createMoodCheckInEvent } = await import('../core/adapters/moodAdapter')
    const event = createMoodCheckInEvent(checkIn)
    await db.events.put(event as PlatformEventV1)
  } catch (err) {
    console.error('[saveCheckIn] Failed to write platform event:', err)
  }
}

export async function saveDoodle(doodle: Doodle): Promise<void> {
  await db.doodles.put(doodle)
}

export async function getDoodle(id: string): Promise<Doodle | undefined> {
  return db.doodles.get(id)
}

export async function exportAllData(): Promise<string> {
  const profile = await getProfile()
  const checkIns = await getAllCheckIns()
  const rewards = await getRewards()
  const doodles = await db.doodles.toArray()
  return JSON.stringify({ profile, checkIns, rewards, doodles }, null, 2)
}

export async function deleteAllData(): Promise<void> {
  await db.profile.clear()
  await db.checkIns.clear()
  await db.doodles.clear()
  await db.rewards.clear()
  await db.events.clear()
  await db.meta.clear()
}
