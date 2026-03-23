import { useEntries, useFriends, getActivityStats, getMonthSummary } from '../store/useStore'
import { ACTIVITY_CATEGORIES, ALL_TAGS } from '../data/activities'

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-xl px-4 py-3 text-center" style={{ background: 'var(--bg3)' }}>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>{label}</span>
    </div>
  )
}

function fmt(n: number) {
  return n === 0 ? '0' : n.toFixed(1).replace(/\.0$/, '')
}

export default function StatsPage() {
  const { entries } = useEntries()
  const { friends } = useFriends()
  const now = new Date()

  const usedTagIds = new Set<string>()
  const usedCustom = new Set<string>()
  for (const e of entries) {
    e.activityIds.forEach((id) => usedTagIds.add(id))
    e.customActivities.forEach((a) => usedCustom.add(a))
  }

  const summary = getMonthSummary(entries, friends, now.getFullYear(), now.getMonth())

  const handleShare = async () => {
    const topActLabel = summary.topActId ? ALL_TAGS.find((t) => t.id === summary.topActId)?.label : null
    const text = [
      `📖 ${now.getFullYear()}年${now.getMonth() + 1}月のきろく`,
      `記録した日: ${summary.recordedDays}日 / ${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}日`,
      summary.topFriend ? `一番会った人: ${summary.topFriend.name}` : '',
      topActLabel ? `一番多かった: ${topActLabel}` : '',
    ].filter(Boolean).join('\n')

    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('クリップボードにコピーしました')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-24 fade-up">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>イベント管理</h1>
        <button
          onClick={handleShare}
          className="text-xs px-3 py-1.5 rounded-xl"
          style={{ background: 'var(--bg3)', color: 'var(--text-sub)', border: '1px solid var(--border)' }}
        >
          今月をシェア
        </button>
      </div>

      {/* Monthly summary card */}
      {summary.total > 0 && (
        <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-sub)' }}>
            {now.getFullYear()}年{now.getMonth() + 1}月のまとめ
          </p>
          <div className="grid grid-cols-3 gap-2">
            <StatCard label="記録した日" value={`${summary.recordedDays}日`} />
            <StatCard label="記録件数" value={`${summary.total}件`} />
            {summary.topFriend && <StatCard label="最多" value={summary.topFriend.name} />}
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="text-center py-16 text-sm" style={{ color: 'var(--text-sub)' }}>まだ記録がありません</p>
      ) : (
        <div className="flex flex-col gap-8">
          {ACTIVITY_CATEGORIES.map((cat) => {
            const catTags = cat.tags.filter((t) => usedTagIds.has(t.id))
            if (catTags.length === 0) return null
            return (
              <div key={cat.id}>
                <p className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-sub)' }}>
                  <span>{cat.icon}</span>{cat.label}
                </p>
                <div className="flex flex-col gap-4">
                  {catTags.map((tag) => {
                    const s = getActivityStats(entries, tag.id)
                    return (
                      <div key={tag.id} className="rounded-xl p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                        <p className="font-medium mb-3">{tag.icon} {tag.label}</p>
                        <div className="grid grid-cols-4 gap-2">
                          <StatCard label="今月" value={`${s.thisMonth}回`} />
                          <StatCard label="過去1年" value={`${s.pastYear}回`} />
                          <StatCard label="月平均" value={`${fmt(s.monthlyAvg)}回`} />
                          <StatCard label="週平均" value={`${fmt(s.weeklyAvg)}回`} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {usedCustom.size > 0 && (
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-sub)' }}>カスタム</p>
              <div className="flex flex-col gap-4">
                {[...usedCustom].map((label) => {
                  const s = getActivityStats(entries, label)
                  return (
                    <div key={label} className="rounded-xl p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                      <p className="font-medium mb-3">{label}</p>
                      <div className="grid grid-cols-4 gap-2">
                        <StatCard label="今月" value={`${s.thisMonth}回`} />
                        <StatCard label="過去1年" value={`${s.pastYear}回`} />
                        <StatCard label="月平均" value={`${fmt(s.monthlyAvg)}回`} />
                        <StatCard label="週平均" value={`${fmt(s.weeklyAvg)}回`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
