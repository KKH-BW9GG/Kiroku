import { useParams, useNavigate } from 'react-router-dom'
import { useFriends, useEntries, daysSince, lastMetDate, countThisMonth } from '../store/useStore'
import { ALL_TAGS } from '../data/activities'

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { friends } = useFriends()
  const { entries } = useEntries()

  const friend = friends.find((f) => f.id === id)
  if (!friend) return <div className="p-4 text-center" style={{ color: 'var(--text-sub)' }}>友人が見つかりません</div>

  const friendEntries = entries.filter((e) => e.friendIds.includes(friend.id)).sort((a, b) => b.date.localeCompare(a.date))
  const last = lastMetDate(entries, friend.id)
  const days = last ? daysSince(last) : null
  const monthCount = countThisMonth(entries, friend.id)
  const totalCount = friendEntries.length

  // Activity frequency
  const actFreq: Record<string, number> = {}
  for (const e of friendEntries) {
    for (const a of e.activityIds) actFreq[a] = (actFreq[a] ?? 0) + 1
    for (const a of e.customActivities) actFreq[a] = (actFreq[a] ?? 0) + 1
  }
  const topActivities = Object.entries(actFreq).sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <div className="max-w-md mx-auto px-4 pb-10 fade-up">
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate(-1)} style={{ color: 'var(--text-sub)' }} className="text-xl">←</button>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center py-4 mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-3"
          style={{ background: friend.color, color: '#fff' }}
        >
          {friend.name[0]}
        </div>
        <h1 className="text-xl font-bold">{friend.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-sub)' }}>
          {days === null ? '記録なし' : days === 0 ? '今日会った' : `${days}日振り`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: '今月', value: monthCount + '回' },
          { label: '合計', value: totalCount + '回' },
          { label: '最後', value: last ? last.slice(5) : '-' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl py-3 text-center" style={{ background: 'var(--bg2)' }}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top activities */}
      {topActivities.length > 0 && (
        <div className="mb-5">
          <p className="text-sm mb-2 font-medium" style={{ color: 'var(--text-sub)' }}>よくやること</p>
          <div className="flex flex-wrap gap-2">
            {topActivities.map(([id, count]) => {
              const tag = ALL_TAGS.find((t) => t.id === id)
              const label = tag ? tag.label : id
              return (
                <span key={id} className="text-sm px-3 py-1.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>
                  {label} {count}回
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Entry history */}
      <p className="text-sm mb-3 font-medium" style={{ color: 'var(--text-sub)' }}>記録一覧</p>
      {friendEntries.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: 'var(--text-sub)' }}>記録がありません</p>
      ) : (
        <div className="flex flex-col gap-2">
          {friendEntries.map((entry) => (
            <div key={entry.id} className="rounded-xl px-4 py-3" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{entry.date}</span>
                {entry.location && <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{entry.location}</span>}
              </div>
              {(entry.activityIds.length > 0 || entry.customActivities.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.activityIds.map((id) => {
                    const tag = ALL_TAGS.find((t) => t.id === id)
                    return tag ? (
                      <span key={id} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>{tag.label}</span>
                    ) : null
                  })}
                  {entry.customActivities.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>{a}</span>
                  ))}
                </div>
              )}
              {entry.memo && <p className="text-xs mt-1.5" style={{ color: 'var(--text-sub)' }}>{entry.memo}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
