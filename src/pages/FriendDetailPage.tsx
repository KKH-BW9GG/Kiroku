import { useParams, useNavigate } from "react-router-dom";
import {
  useFriends,
  useEntries,
  daysSince,
  lastMetDate,
  countThisMonth,
} from "../store/useStore";
import { ALL_TAGS } from "../data/activities";
import { ChevronLeft, MapPin } from "../components/Icons";

export default function FriendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { friends } = useFriends();
  const { entries } = useEntries();

  const friend = friends.find((f) => f.id === id);
  if (!friend)
    return (
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          color: "var(--text-sub)",
        }}
      >
        友人が見つかりません
      </div>
    );

  const friendEntries = entries
    .filter((e) => e.friendIds.includes(friend.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  const last = lastMetDate(entries, friend.id);
  const days = last ? daysSince(last) : null;
  const monthCount = countThisMonth(entries, friend.id);
  const totalCount = friendEntries.length;

  const actFreq: Record<string, number> = {};
  for (const e of friendEntries) {
    for (const a of e.activityIds) actFreq[a] = (actFreq[a] ?? 0) + 1;
    for (const a of e.customActivities) actFreq[a] = (actFreq[a] ?? 0) + 1;
  }
  const topActivities = Object.entries(actFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="page-container fade-up">
      {/* Back */}
      <div style={{ paddingTop: "16px", marginBottom: "4px" }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="戻る"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "10px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            color: "var(--text-sub)",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "var(--font-sans)",
          }}
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
          戻る
        </button>
      </div>

      {/* Profile */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 0 20px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: friend.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "12px",
            boxShadow: `0 0 0 4px ${friend.color}33`,
          }}
        >
          {friend.name[0]}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            fontWeight: 800,
            margin: "0 0 4px",
            letterSpacing: "0.04em",
          }}
        >
          {friend.name}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-sub)", margin: 0 }}>
          {days === null
            ? "記録なし"
            : days === 0
              ? "今日会った"
              : `${days}日振り`}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "今月", value: monthCount + "回" },
          { label: "合計", value: totalCount + "回" },
          {
            label: "最後",
            value: last ? last.slice(5).replace("-", "/") : "-",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              borderRadius: "10px",
              padding: "12px 8px",
              textAlign: "center",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-sub)",
                margin: "2px 0 0",
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Top activities */}
      {topActivities.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--text-sub)",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            よくやること
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {topActivities.map(([actId, count]) => {
              const tag = ALL_TAGS.find((t) => t.id === actId);
              const label = tag ? tag.label : actId;
              return (
                <span
                  key={actId}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "5px 12px",
                    borderRadius: "99px",
                    fontSize: "13px",
                    background: "var(--bg3)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {label}
                  <span style={{ fontSize: "11px", color: "var(--text-sub)" }}>
                    {count}回
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Entry history */}
      <div>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-sub)",
            letterSpacing: "0.05em",
            marginBottom: "10px",
          }}
        >
          記録一覧
        </p>
        {friendEntries.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "32px 0",
              fontSize: "13px",
              color: "var(--text-sub)",
            }}
          >
            記録がありません
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {friendEntries.map((entry) => (
              <div
                key={entry.id}
                className="card"
                style={{ padding: "12px 14px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>
                    {entry.date}
                  </span>
                  {entry.location && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-sub)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <MapPin size={11} strokeWidth={2} />
                      {entry.location}
                    </span>
                  )}
                </div>
                {(entry.activityIds.length > 0 ||
                  entry.customActivities.length > 0) && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                  >
                    {entry.activityIds.map((aid) => {
                      const tag = ALL_TAGS.find((t) => t.id === aid);
                      return tag ? (
                        <span key={aid} className="chip">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
