import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEntries, useFriends, useRecentTags, lastMetDate, daysSince } from '../store/useStore'
import { ACTIVITY_CATEGORIES, ALL_TAGS } from '../data/activities'
import type { Entry } from '../types'

function today() { return new Date().toISOString().slice(0, 10) }
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const COLORS = ['#4FC3F7', '#F48FB1', '#A5D6A7', '#FFD54F', '#CE93D8', '#80DEEA', '#FFAB91']

interface Props { existing?: Entry }

function EntryForm({ existing }: Props) {
  const navigate = useNavigate()
  const { addEntry, updateEntry, entries } = useEntries()
  const { friends, addFriend } = useFriends()
  const recentTagIds = useRecentTags()

  const [date, setDate] = useState(existing?.date ?? today())
  const [selectedFriends, setSelectedFriends] = useState<string[]>(existing?.friendIds ?? [])
  const [location, setLocation] = useState(existing?.location ?? '')
  const [selectedActivities, setSelectedActivities] = useState<string[]>(existing?.activityIds ?? [])
  const [customActivity, setCustomActivity] = useState('')
  const [customActivities, setCustomActivities] = useState<string[]>(existing?.customActivities ?? [])
  const [memo, setMemo] = useState(existing?.memo ?? '')
  const [newFriendName, setNewFriendName] = useState('')

  const isEdit = !!existing

  const recentTags = recentTagIds
    .map((id) => ALL_TAGS.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 5) as typeof ALL_TAGS

  const toggleFriend = (id: string) =>
    setSelectedFriends((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const toggleActivity = (id: string) =>
    setSelectedActivities((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const addCustomActivity = () => {
    const v = customActivity.trim()
    if (v && !customActivities.includes(v)) setCustomActivities((prev) => [...prev, v])
    setCustomActivity('')
  }

  const handleAddFriend = () => {
    const name = newFriendName.trim()
    if (!name) return
    const color = COLORS[friends.length % COLORS.length]
    const f = addFriend(name, color)
    setSelectedFriends((prev) => [...prev, f.id])
    setNewFriendName('')
  }

  const handleSubmit = () => {
    const payload = { date, friendIds: selectedFriends, location, activityIds: selectedActivities, customActivities, memo }
    isEdit ? updateEntry(existing.id, payload) : addEntry(payload)
    navigate('/')
  }

  const DATE_SHORTCUTS = [
    { label: '今日', value: today() },
    { label: '昨日', value: daysAgo(1) },
    { label: '一昨日', value: daysAgo(2) },
  ]

  return (
    <div className="max-w-md mx-auto px-4 pb-24 fade-up">
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate(-1)} style={{ color: 'var(--text-sub)' }} className="text-xl">←</button>
        <h1 className="text-lg font-bold">{isEdit ? '記録を編集' : '記録する'}</h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Date */}
        <div>
          <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-sub)' }}>日付</label>
          <div className="flex gap-2 mb-2">
            {DATE_SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => setDate(s.value)}
                className="px-3 py-1.5 rounded-xl text-sm transition-all"
                style={{
                  background: date === s.value ? 'var(--accent)' : 'var(--bg3)',
                  color: date === s.value ? '#0F1117' : 'var(--text)',
                  border: `1.5px solid ${date === s.value ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', colorScheme: 'dark' }}
          />
        </div>

        {/* Who */}
        <div>
          <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-sub)' }}>誰と（任意）</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {friends.map((f) => {
              const sel = selectedFriends.includes(f.id)
              const last = lastMetDate(entries.filter((e) => !isEdit || e.id !== existing?.id), f.id)
              const days = last ? daysSince(last) : null
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFriend(f.id)}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all"
                  style={{
                    background: sel ? f.color + '22' : 'var(--bg2)',
                    border: `1.5px solid ${sel ? f.color : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: f.color, color: '#fff' }}>
                      {f.name[0]}
                    </span>
                    <span className="text-sm" style={{ color: sel ? f.color : 'var(--text)' }}>{f.name}</span>
                  </div>
                  {days !== null && (
                    <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      {days === 0 ? '今日' : `${days}日振り`}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <input
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
              placeholder="友人を追加..."
              className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <button onClick={handleAddFriend} className="px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>
              追加
            </button>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-sub)' }}>どこで</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="渋谷、新宿、オンライン..."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-sub)' }}>何した</label>

          {recentTags.length > 0 && (
            <div className="mb-3">
              <p className="text-xs mb-1.5" style={{ color: 'var(--accent)' }}>最近使った</p>
              <div className="flex flex-wrap gap-1.5">
                {recentTags.map((tag) => {
                  const sel = selectedActivities.includes(tag.id)
                  return (
                    <button key={tag.id} onClick={() => toggleActivity(tag.id)}
                      className="px-3 py-1.5 rounded-full text-sm transition-all"
                      style={{
                        background: sel ? 'var(--accent)' : 'var(--bg3)',
                        border: `1.5px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                        color: sel ? '#0F1117' : 'var(--text)',
                      }}
                    >
                      {tag.icon} {tag.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {ACTIVITY_CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-3">
              <p className="text-xs mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-sub)' }}>
                <span>{cat.icon}</span>{cat.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag) => {
                  const sel = selectedActivities.includes(tag.id)
                  return (
                    <button key={tag.id} onClick={() => toggleActivity(tag.id)}
                      className="px-3 py-1.5 rounded-full text-sm transition-all"
                      style={{
                        background: sel ? 'var(--accent)' : 'var(--bg2)',
                        border: `1.5px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                        color: sel ? '#0F1117' : 'var(--text)',
                      }}
                    >
                      {tag.icon} {tag.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {customActivities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {customActivities.map((a, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm" style={{ background: 'var(--accent)', color: '#0F1117' }}>
                  {a}
                  <button onClick={() => setCustomActivities((prev) => prev.filter((_, j) => j !== i))} className="ml-0.5 opacity-70">×</button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <input
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomActivity()}
              placeholder="その他を追加..."
              className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <button onClick={addCustomActivity} className="px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>
              追加
            </button>
          </div>
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm mb-1.5 font-medium" style={{ color: 'var(--text-sub)' }}>補足メモ（任意）</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="楽しかった、久しぶりだった..."
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-base font-bold"
          style={{ background: 'var(--accent)', color: '#0F1117' }}
        >
          {isEdit ? '変更を保存' : '記録する'}
        </button>
      </div>
    </div>
  )
}

export default function NewEntryPage() {
  const { id } = useParams<{ id?: string }>()
  const { entries } = useEntries()
  const existing = id ? entries.find((e) => e.id === id) : undefined
  return <EntryForm existing={existing} />
}
