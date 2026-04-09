import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntries, useFriends } from "../store/useStore";
import { ALL_TAGS } from "../data/activities";
import { ChevronLeft, MapPin, Plus } from "../components/Icons";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarPage() {
  const navigate = useNavigate();
  const { entries } = useEntries();
  const { friends } = useFriends();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const entryMap: Record<string, typeof entries> = {};
  for (const e of entries) {
    if (!entryMap[e.date]) entryMap[e.date] = [];
    entryMap[e.date].push(e);
  }

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const pad = (d: number) => String(d).padStart(2, "0");
  const dateStr = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;
  const todayStr = now.toISOString().slice(0, 10);

  const selectedEntries = selectedDate ? (entryMap[selectedDate] ?? []) : [];

  const getFriendName = (id: string) =>
    friends.find((f) => f.id === id)?.name ?? "不明";
  const getFriendColor = (id: string) =>
    friends.find((f) => f.id === id)?.color ?? "#888";

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const thisMonthDays = Object.keys(entryMap).filter((d) =>
    d.startsWith(`${year}-${pad2(month + 1)}`),
  ).length;

  return (
    <div className="page-container fade-up">
      {/* Header */}
      <div style={{ paddingTop: "20px", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(20px, 4vw, 26px)",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "0.04em",
              color: "var(--text)",
            }}
          >
            カレンダー
          </h1>
          {thisMonthDays > 0 && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-sub)",
                background: "var(--bg3)",
                padding: "3px 10px",
                borderRadius: "99px",
                border: "1px solid var(--border)",
              }}
            >
              {thisMonthDays}日記録
            </span>
          )}
        </div>
      </div>

      {/* Month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          padding: "10px 14px",
          background: "var(--bg2)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
        }}
      >
        <button
          onClick={prevMonth}
          aria-label="前の月"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text)",
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <span
          style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "0.04em" }}
        >
          {year}年{month + 1}月
        </span>
        <button
          onClick={nextMonth}
          aria-label="次の月"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text)",
            transform: "rotate(180deg)",
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "4px",
        }}
      >
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 0",
              letterSpacing: "0.04em",
              color:
                i === 0 ? "#e85d4a" : i === 6 ? "#4a7ec7" : "var(--text-sub)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          marginBottom: "20px",
        }}
      >
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const ds = dateStr(day);
          const hasEntry = !!entryMap[ds];
          const isToday = ds === todayStr;
          const isSel = ds === selectedDate;
          const dow = (firstDow + i) % 7;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSel ? null : ds)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px 4px",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.12s",
                background: isSel
                  ? "var(--accent)"
                  : isToday
                    ? "var(--accent-light)"
                    : "transparent",
                border:
                  isToday && !isSel
                    ? "1.5px solid var(--accent)"
                    : "1.5px solid transparent",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: isSel || isToday ? 700 : 400,
                  lineHeight: 1,
                  color: isSel
                    ? "#fff"
                    : dow === 0
                      ? "#e85d4a"
                      : dow === 6
                        ? "#4a7ec7"
                        : "var(--text)",
                }}
              >
                {day}
              </span>
              {hasEntry && (
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    marginTop: "3px",
                    background: isSel
                      ? "rgba(255,255,255,0.8)"
                      : "var(--accent)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date entries */}
      {selectedDate && (
        <div className="scale-in">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
              {selectedDate}
            </p>
            <button
              onClick={() => navigate(`/new?date=${selectedDate}`)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "7px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Plus size={14} strokeWidth={2.5} />
              記録
            </button>
          </div>

          {selectedEntries.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "32px 0",
                fontSize: "13px",
                color: "var(--text-sub)",
              }}
            >
              この日の記録はありません
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {selectedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="card"
                  style={{ padding: "12px 14px" }}
                >
                  {entry.friendIds.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        marginBottom: "6px",
                      }}
                    >
                      {entry.friendIds.map((id) => (
                        <span
                          key={id}
                          style={{
                            fontSize: "12px",
                            padding: "2px 10px",
                            borderRadius: "99px",
                            fontWeight: 600,
                            background: getFriendColor(id) + "22",
                            color: getFriendColor(id),
                            border: `1px solid ${getFriendColor(id)}44`,
                          }}
                        >
                          {getFriendName(id)}
                        </span>
                      ))}
                    </div>
                  )}
                  {(entry.activityIds.length > 0 ||
                    entry.customActivities.length > 0) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {entry.activityIds.map((id) => {
                        const tag = ALL_TAGS.find((t) => t.id === id);
                        return tag ? (
                          <span key={id} className="chip">
                            {tag.label}
                          </span>
                        ) : null;
                      })}
                      {entry.customActivities.map((a, i) => (
                        <span key={i} className="chip">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.location && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-sub)",
                        margin: "4px 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <MapPin size={11} strokeWidth={2} />
                      {entry.location}
                    </p>
                  )}
                  {entry.memo && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-sub)",
                        margin: "4px 0 0",
                        lineHeight: 1.6,
                      }}
                    >
                      {entry.memo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedDate && thisMonthDays === 0 && (
        <p
          style={{
            textAlign: "center",
            padding: "32px 0",
            fontSize: "13px",
            color: "var(--text-sub)",
          }}
        >
          今月の記録はまだありません
        </p>
      )}
    </div>
  );
}
