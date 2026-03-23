import { useState, useCallback } from 'react'
import type { Friend, Entry } from '../types'

const FRIENDS_KEY = 'kiroku_friends'
const ENTRIES_KEY = 'kiroku_entries'
const RECENT_TAGS_KEY = 'kiroku_recent_tags'
export const ONBOARDED_KEY = 'kiroku_onboarded'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>(() => load<Friend[]>(FRIENDS_KEY, []))

  const addFriend = useCallback((name: string, color: string): Friend => {
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name,
      color,
      memo: '',
      createdAt: new Date().toISOString(),
    }
    setFriends((prev) => {
      const next = [...prev, newFriend]
      save(FRIENDS_KEY, next)
      return next
    })
    return newFriend
  }, [])

  const updateFriend = useCallback((id: string, updates: Partial<Pick<Friend, 'name' | 'color' | 'memo'>>) => {
    setFriends((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      save(FRIENDS_KEY, next)
      return next
    })
  }, [])

  const deleteFriend = useCallback((id: string) => {
    setFriends((prev) => {
      const next = prev.filter((f) => f.id !== id)
      save(FRIENDS_KEY, next)
      return next
    })
  }, [])

  return { friends, addFriend, updateFriend, deleteFriend }
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>(() => load<Entry[]>(ENTRIES_KEY, []))

  const addEntry = useCallback((entry: Omit<Entry, 'id' | 'createdAt'>) => {
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => {
      const next = [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date))
      save(ENTRIES_KEY, next)
      return next
    })
    saveRecentTags(entry.activityIds)
  }, [])

  const updateEntry = useCallback((id: string, updates: Omit<Entry, 'id' | 'createdAt'>) => {
    setEntries((prev) => {
      const next = prev
        .map((e) => (e.id === id ? { ...e, ...updates } : e))
        .sort((a, b) => b.date.localeCompare(a.date))
      save(ENTRIES_KEY, next)
      return next
    })
    saveRecentTags(updates.activityIds)
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      save(ENTRIES_KEY, next)
      return next
    })
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}

function saveRecentTags(newTagIds: string[]) {
  const current = load<string[]>(RECENT_TAGS_KEY, [])
  const merged = [...newTagIds, ...current.filter((t) => !newTagIds.includes(t))].slice(0, 5)
  save(RECENT_TAGS_KEY, merged)
}

export function useRecentTags(): string[] {
  return load<string[]>(RECENT_TAGS_KEY, [])
}

// Stat helpers
export function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function countThisMonth(entries: Entry[], friendId: string): number {
  const now = new Date()
  return entries.filter((e) => {
    if (!e.friendIds.includes(friendId)) return false
    const d = new Date(e.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
}

export function lastMetDate(entries: Entry[], friendId: string): string | null {
  const met = entries
    .filter((e) => e.friendIds.includes(friendId))
    .map((e) => e.date)
    .sort()
    .reverse()
  return met[0] ?? null
}

export function getActivityStats(entries: Entry[], tagIdOrLabel: string) {
  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(now.getFullYear() - 1)

  const matching = entries.filter((e) =>
    e.activityIds.includes(tagIdOrLabel) || e.customActivities.includes(tagIdOrLabel)
  )

  const thisMonth = matching.filter((e) => {
    const d = new Date(e.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length

  const pastYear = matching.filter((e) => new Date(e.date) >= oneYearAgo).length
  const monthlyAvg = pastYear / 12
  const weeklyAvg = pastYear / 52

  return { thisMonth, pastYear, monthlyAvg, weeklyAvg, total: matching.length }
}

export function getMonthSummary(entries: Entry[], friends: Friend[], year: number, month: number) {
  const monthEntries = entries.filter((e) => {
    const d = new Date(e.date)
    return d.getFullYear() === year && d.getMonth() === month
  })
  const recordedDays = new Set(monthEntries.map((e) => e.date)).size
  const friendCounts: Record<string, number> = {}
  for (const e of monthEntries) {
    for (const fid of e.friendIds) {
      friendCounts[fid] = (friendCounts[fid] ?? 0) + 1
    }
  }
  const topFriendId = Object.entries(friendCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topFriend = topFriendId ? friends.find((f) => f.id === topFriendId) : null
  const actCounts: Record<string, number> = {}
  for (const e of monthEntries) {
    for (const aid of e.activityIds) actCounts[aid] = (actCounts[aid] ?? 0) + 1
  }
  const topActId = Object.entries(actCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  return { recordedDays, total: monthEntries.length, topFriend, topActId }
}
