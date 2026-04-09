import { NavLink } from "react-router-dom";
import { BookOpen, CalendarIcon, BarChart, Users } from "./Icons";

const ITEMS = [
  { to: "/", label: "ホーム", Icon: BookOpen },
  { to: "/calendar", label: "カレンダー", Icon: CalendarIcon },
  { to: "/stats", label: "イベント", Icon: BarChart },
  { to: "/friends", label: "友人", Icon: Users },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="メインナビゲーション"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 8px calc(8px + env(safe-area-inset-bottom))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          aria-label={label}
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            padding: "6px 20px",
            borderRadius: "12px",
            textDecoration: "none",
            color: isActive ? "var(--accent)" : "var(--text-sub)",
            transition: "color 0.15s",
            background: isActive ? "var(--accent-light)" : "transparent",
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
