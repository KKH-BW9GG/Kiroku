import { Link } from 'react-router-dom'
import { useEntries, useFriends, daysSince, lastMetDate } from '../store/useStore'
import { ALL_TAGS } from '../data/activities'

function groupByMonth(entries: ReturnType<typeof useEntries>['entries']) {
  const groups: Record<string, typeof entries> = {}
  for (const e of entries) {
    const key = e.date.slice(0, 7)
    if (!groups[key]) groups[key] = []
    groups[key].push(e)
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

function formatMonth(ym: string) {
  const [y, m] = ym.split('-')
  const now = new Date()
  if (Number(y) === now.getFullYear() && Number(m) === now.getMonth() + 1) return '今月'
  return `${y}年${Number(m)}月`
}

export default function HomePage() {
  const { entries, deleteEntry } = useEntries()
  const { friends } = useFriends()

  const getFriendName = (id: string) => friends.find((f) => f.id === id)?.name ?? '不明'
  const getFriendColor = (id: string) => friends.find((f) => f.id === id)?.color ?? '#888'
  const grouped = groupByMonth(entries)

  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const thisMonthCount = entries.filter((e) => e.date.startsWith(thisMonthKey)).length
  const thisMonthDays = new Set(entries.filter((e) => e.date.startsWith(thisMonthKey)).map((e) => e.date)).size

  return (
    <main className="max-w-md mx-auto px-4 pb-24 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>きろく</h1>
        {thisMonthCount > 0 && (
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text-sub)' }}>
            今月 {thisMonthDays}日・{thisMonthCount}件
          </span>
        )}
      </div>

      {/* Friends quick stats */}
      {friends.length > 0 && (
        <div className="mb-5 overflow-x-auto">
          <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
            {friends.map((f) => {
              const last = lastMetDate(entries, f.id)
              const days = last ? daysSince(last) : null
              return (
                <Link
                  key={f.id}
                  to={`/friends/${f.id}`}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl"
                  style={{ background: 'var(--bg2)', minWidth: '72px' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: f.color, color: '#fff' }}>
                    {f.name[0]}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text)' }}>{f.name}</span>
                  <span className="text-xs" style={{ color: 'var(--text-sub)' }}>
                    {days === null ? '-' : days === 0 ? '今日' : `${days}日前`}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      {entries.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-sub)' }}>
          <p className="text-4xl mb-3" aria-hidden="true">📖</p>
          <p className="text-sm">まだ記録がありません</p>
          <Link
            to="/new"
            className="inline-block mt-4 px-6 py-3 rounded-2xl text-sm font-bold"
            style={{ background: 'var(--accent)', color: '#0F1117' }}
          >
            最初の記録を追加 +
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([month, monthEntries]) => (
            <div key={month}>
              <p className="text-xs font-medium mb-2 px-1" style={{ color: 'var(--text-sub)' }}>
                {formatMonth(month)}
                <span className="ml-2" style={{ color: 'var(--border)' }}>{monthEntries.length}件</span>
              </p>
              <div className="flex flex-col gap-2">
                {monthEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl p-4"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs" style={{ color: 'var(--text-sub)' }}>{entry.date}</span>
                      <div className="flex items-center gap-2">
                        {entry.location && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text-sub)' }}>
                            📍 {entry.location}
                          </span>
                        )}
                        <Link
                          to={`/edit/${entry.id}`}
                          className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ color: 'var(--text-sub)', background: 'var(--bg3)' }}
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => { if (confirm('この記録を削除しますか？')) deleteEntry(entry.id) }}
                          className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ color: '#ef4444', background: '#ef444422' }}
                        >
                          削除
                        </button>
                      </div>
                    </div>

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
                            <span key={id} className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'var(--bg3)', color: 'var(--text)' }}>
                              {tag.icon} {tag.label}
                            </span>
                          ) : null
                        })}
                        {entry.customActivities.map((a, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--bg3)', color: 'var(--text)' }}>{a}</span>
                        ))}
                      </div>
                    )}

                    {entry.memo && <p className="text-xs mt-1" style={{ color: 'var(--text-sub)' }}>{entry.memo}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <Link
        to="/new"
        aria-label="新しい記録を追加"
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
        style={{ background: 'var(--accent)', color: '#0F1117' }}
      >
        <span aria-hidden="true">+</span>
      </Link>
    </main>
  )
}
