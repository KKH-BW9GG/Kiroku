import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntries, useFriends } from '../store/useStore'
import { ALL_TAGS } from '../data/activities'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay() // 0=Sun
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarPage() {
  const navigate = useNavigate()
  const { entries } = useEntries()
  const { friends } = useFriends()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDow = getFirstDayOfWeek(year, month)

  // Map date → entries
  const entryMap: Record<string, typeof entries> = {}
  for (const e of entries) {
    if (!entryMap[e.date]) entryMap[e.date] = []
    entryMap[e.date].push(e)
  }

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
    setSelectedDate(null)
  }
  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
    setSelectedDate(null)
  }

  const pad = (d: number) => String(d).padStart(2, '0')
  const dateStr = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`
  const todayStr = now.toISOString().slice(0, 10)

  const selectedEntries = selectedDate ? (entryMap[selectedDate] ?? []) : []

  const getFriendName = (id: string) => friends.find((f) => f.id === id)?.name ?? '不明'
  const getFriendColor = (id: string) => friends.find((f) => f.id === id)?.color ?? '#888'

  // Total recorded days this month
  const thisMonthDays = Object.keys(entryMap).filter((d) => d.startsWith(`${year}-${pad(month + 1)}`)).length

  return (
    <div className="max-w-md mx-auto px-4 pb-24 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>カレンダー</h1>
        <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text-sub)' }}>
          今月 {thisMonthDays}日記録
        </span>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg2)' }}>‹</button>
        <span className="font-bold">{year}年{month + 1}月</span>
        <button onClick={nextMonth} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg2)' }}>›</button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className="text-center text-xs py-1" style={{ color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : 'var(--text-sub)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const ds = dateStr(day)
          const hasEntry = !!entryMap[ds]
          const isToday = ds === todayStr
          const isSel = ds === selectedDate
          const dow = (firstDow + i) % 7

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSel ? null : ds)}
              className="flex flex-col items-center py-1.5 rounded-xl transition-all"
              style={{
                background: isSel ? 'var(--accent)' : isToday ? 'var(--bg3)' : 'transparent',
                border: isToday && !isSel ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              <span className="text-sm font-medium" style={{
                color: isSel ? '#0F1117' : dow === 0 ? '#f87171' : dow === 6 ? '#60a5fa' : 'var(--text)'
              }}>
                {day}
              </span>
              {hasEntry && (
                <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: isSel ? '#0F1117' : 'var(--accent)' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected date entries */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">{selectedDate}</p>
            <button
              onClick={() => navigate(`/new?date=${selectedDate}`)}
              className="text-xs px-3 py-1.5 rounded-xl"
              style={{ background: 'var(--accent)', color: '#0F1117' }}
            >
              + 記録
            </button>
          </div>

          {selectedEntries.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: 'var(--text-sub)' }}>この日の記録はありません</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEntries.map((entry) => (
                <div key={entry.id} className="rounded-xl p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  {entry.friendIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.friendIds.map((id) => (
                        <span key={id} className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: getFriendColor(id) + '33', color: getFriendColor(id) }}>
                          {getFriendName(id)}
                        </span>
                      ))}
                    </div>
                  )}
                  {(entry.activityIds.length > 0 || entry.customActivities.length > 0) && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {entry.activityIds.map((id) => {
                        const tag = ALL_TAGS.find((t) => t.id === id)
                        return tag ? (
                          <span key={id} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>
                            {tag.icon} {tag.label}
                          </span>
                        ) : null
                      })}
                      {entry.customActivities.map((a, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>{a}</span>
                      ))}
                    </div>
                  )}
                  {entry.location && <p className="text-xs mt-1" style={{ color: 'var(--text-sub)' }}>📍 {entry.location}</p>}
                  {entry.memo && <p className="text-xs mt-1" style={{ color: 'var(--text-sub)' }}>{entry.memo}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty month message */}
      {!selectedDate && thisMonthDays === 0 && (
        <p className="text-center py-8 text-sm" style={{ color: 'var(--text-sub)' }}>今月の記録はまだありません</p>
      )}
    </div>
  )
}
