import { useState, useEffect, useCallback } from 'react'
import { getProfile, getRewards, addPawPrint as dbAddPawPrint } from '../db'
import type { Profile, Rewards } from '../db'
import { migrateLegacyMoodCheckIns } from '../core/storage/migrateLegacyMoodCheckIns'

export function useAppState() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [rewards, setRewards] = useState<Rewards | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [p, r] = await Promise.all([getProfile(), getRewards()])
    setProfile(p ?? null)
    setRewards(r)
    setLoading(false)
  }, [])

  useEffect(() => {
    migrateLegacyMoodCheckIns()
      .catch(err => console.warn('[migration] Failed:', err))
      .finally(() => refresh())
  }, [refresh])

  const addPawPrint = async () => {
    const result = await dbAddPawPrint()
    await refresh()
    return result
  }

  return { profile, rewards, loading, refresh, addPawPrint }
}
