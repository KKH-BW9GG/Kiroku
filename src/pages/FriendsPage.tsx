import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFriends, useEntries, lastMetDate, daysSince, countThisMonth } from '../store/useStore'

const COLORS = ['#4FC3F7', '#F48FB1', '#A5D6A7', '#FFD54F', '#CE93D8', '#80DEEA', '#FFAB91']

export default function FriendsPage() {
  const navigate = useNavigate()
  const { friends, addFriend, deleteFriend } = useFriends()
  const { entries } = useEntries()
  const [newName, setNewName] = useState('')
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return
    addFriend(name, COLORS[friends.length % COLORS.length])
    setNewName('')
  }

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const inactiveFriends = [...friends]
    .map((f) => {
      const last = lastMetDate(entries, f.id)
      const days = last ? daysSince(last) : 99999
      return { ...f, days }
    })
    .sort((a, b) => b.days - a.days)

  return (
    <div className="max-w-md mx-auto px-4 pb-24 fade-up">
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => navigate(-1)} style={{ color: 'var(--text-sub)' }} className="text-xl">←</button>
        <h1 className="text-lg font-bold">友人管理</h1>
        <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text-sub)' }}>
          {friends.length}人
        </span>
      </div>

      {/* Add friend */}
      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="名前を入力..."
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'var(--accent)', color: '#0F1117' }}
        >
          追加
        </button>
      </div>

      {/* Search */}
      {friends.length > 4 && (
        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="友人を検索..."
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
      )}

      {/* Friends list */}
      {friends.length === 0 ? (
        <p className="text-center py-10 text-sm" style={{ color: 'var(--text-sub)' }}>友人を追加しましょう</p>
      ) : filteredFriends.length === 0 ? (
        <p className="text-center py-8 text-sm" style={{ color: 'var(--text-sub)' }}>「{search}」は見つかりませんでした</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredFriends.map((f) => {
            const last = lastMetDate(entries, f.id)
            const days = last ? daysSince(last) : null
            const monthCount = countThisMonth(entries, f.id)
            return (
              <div key={f.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <Link to={`/friends/${f.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: f.color, color: '#fff' }}>
                    {f.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{f.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-sub)' }}>
                      {days === null ? '記録なし' : days === 0 ? '今日会った' : `${days}日振り`}
                      {monthCount > 0 && ` · 今月${monthCount}回`}
                    </p>
                    {f.memo && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-sub)', opacity: 0.7 }}>
                        {f.memo}
                      </p>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => { if (confirm(`${f.name}を削除しますか？`)) deleteFriend(f.id) }}
                  className="text-sm px-2 py-1 rounded-lg"
                  style={{ color: 'var(--text-sub)' }}
                >
                  削除
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Recently inactive */}
      {friends.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowInactive((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <span>😴 最近遊んでない友達</span>
            <span style={{ color: 'var(--text-sub)' }}>{showInactive ? '▲' : '▼'}</span>
          </button>

          {showInactive && (
            <div className="mt-2 flex flex-col gap-2">
              {inactiveFriends.map((f) => (
                <Link
                  key={f.id}
                  to={`/friends/${f.id}`}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: f.color, color: '#fff' }}>
                    {f.name[0]}
                  </div>
                  <p className="font-medium text-sm flex-1">{f.name}</p>
                  <span className="text-sm font-bold" style={{
                    color: f.days > 30 ? '#ef4444' : f.days > 14 ? '#f59e0b' : 'var(--text-sub)'
                  }}>
                    {f.days === 99999 ? '記録なし' : `${f.days}日前`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
