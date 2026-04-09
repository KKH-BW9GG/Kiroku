import { Link } from "react-router-dom";
import {
  useEntries,
  useFriends,
  daysSince,
  lastMetDate,
} from "../store/useStore";
import { ALL_TAGS } from "../data/activities";
import { MapPin, Plus, Edit2, Trash2 } from "../components/Icons";

function groupByMonth(entries: ReturnType<typeof useEntries>["entries"]) {
  const groups: Record<string, typeof entries> = {};
  for (const e of entries) {
    const key = e.date.slice(0, 7);
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  const now = new Date();
  if (Number(y) === now.getFullYear() && Number(m) === now.getMonth() + 1)
    return "今月";
  return `${y}年${Number(m)}月`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
}

export default function HomePage() {
  const { entries, deleteEntry } = useEntries();
  const { friends } = useFriends();

  const getFriendName = (id: string) =>
    friends.find((f) => f.id === id)?.name ?? "不明";
  const getFriendColor = (id: string) =>
    friends.find((f) => f.id === id)?.color ?? "#888";
  const grouped = groupByMonth(entries);

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthCount = entries.filter((e) =>
    e.date.startsWith(thisMonthKey),
  ).length;
  const thisMonthDays = new Set(
    entries.filter((e) => e.date.startsWith(thisMonthKey)).map((e) => e.date),
  ).size;

  return (
    <main className="page-container fade-up">
      {/* Header */}
      <div
        className="ruled-header"
        style={{ paddingTop: "20px", marginTop: "4px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(22px, 5vw, 28px)",
              fontWeight: 800,
              color: "var(--text)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            きろく
          </h1>
          {thisMonthCount > 0 && (
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
              今月 {thisMonthDays}日 / {thisMonthCount}件
            </span>
          )}
        </div>
      </div>

      {/* Friends quick stats */}
      {friends.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "4px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", minWidth: "max-content" }}>
            {friends.map((f) => {
              const last = lastMetDate(entries, f.id);
              const days = last ? daysSince(last) : null;
              return (
                <Link
                  key={f.id}
                  to={`/friends/${f.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    minWidth: "72px",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: f.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {f.name[0]}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text)",
                      fontWeight: 500,
                    }}
                  >
                    {f.name}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-sub)" }}>
                    {days === null ? "-" : days === 0 ? "今日" : `${days}日前`}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ marginTop: "24px" }}>
        {entries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              color: "var(--text-sub)",
            }}
          >
            <BookOpenIllustration />
            <p
              style={{
                marginTop: "16px",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              まだ記録がありません
            </p>
            <Link
              to="/new"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: "12px",
                background: "var(--accent)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.03em",
              }}
            >
              最初の記録を追加
            </Link>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "28px" }}
          >
            {grouped.map(([month, monthEntries]) => (
              <section key={month}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      margin: 0,
                      color: "var(--text-sub)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {formatMonth(month)}
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "var(--border)",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--border)" }}>
                    {monthEntries.length}件
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {monthEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="card"
                      style={{ padding: "14px 16px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <time
                          style={{
                            fontSize: "12px",
                            color: "var(--text-sub)",
                            fontWeight: 500,
                          }}
                        >
                          {formatDate(entry.date)}
                        </time>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {entry.location && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                fontSize: "11px",
                                color: "var(--text-sub)",
                                background: "var(--bg3)",
                                padding: "2px 8px",
                                borderRadius: "99px",
                                border: "1px solid var(--border)",
                              }}
                            >
                              <MapPin size={11} strokeWidth={2} />
                              {entry.location}
                            </span>
                          )}
                          <Link
                            to={`/edit/${entry.id}`}
                            aria-label="編集"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "28px",
                              height: "28px",
                              borderRadius: "8px",
                              color: "var(--text-sub)",
                              background: "var(--bg3)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <Edit2 size={13} strokeWidth={2} />
                          </Link>
                          <button
                            aria-label="削除"
                            onClick={() => {
                              if (confirm("この記録を削除しますか？"))
                                deleteEntry(entry.id);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "28px",
                              height: "28px",
                              borderRadius: "8px",
                              color: "var(--red)",
                              background: "var(--red-bg)",
                              border: "1px solid #f5c6c2",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={13} strokeWidth={2} />
                          </button>
                        </div>
                      </div>

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

                      {entry.memo && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--text-sub)",
                            margin: "6px 0 0",
                            lineHeight: 1.6,
                          }}
                        >
                          {entry.memo}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        to="/new"
        aria-label="新しい記録を追加"
        style={{
          position: "fixed",
          bottom: "calc(72px + env(safe-area-inset-bottom))",
          right: "20px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "var(--accent)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(62, 107, 136, 0.35)",
          transition: "transform 0.15s, box-shadow 0.15s",
          textDecoration: "none",
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </Link>
    </main>
  );
}

function BookOpenIllustration() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--border)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
