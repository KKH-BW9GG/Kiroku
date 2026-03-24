import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'ホーム', icon: '📖' },
  { to: '/calendar', label: 'カレンダー', icon: '📅' },
  { to: '/stats', label: 'イベント', icon: '📊' },
  { to: '/friends', label: '友人', icon: '👥' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 px-2"
      style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}
    >
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          aria-label={item.label}
          className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl text-xs transition-all"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--text-sub)',
          })}
        >
          <span className="text-xl" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
