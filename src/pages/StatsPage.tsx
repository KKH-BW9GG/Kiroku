import {
  useEntries,
  useFriends,
  getActivityStats,
  getMonthSummary,
} from "../store/useStore";
import { ACTIVITY_CATEGORIES, ALL_TAGS } from "../data/activities";
import { Share2, BarChart } from "../components/Icons";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "10px",
        padding: "12px 8px",
        textAlign: "center",
        background: "var(--bg3)",
        border: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          fontSize: "clamp(16px, 4vw, 20px)",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "11px",
          color: "var(--text-sub)",
          marginTop: "2px",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function fmt(n: number) {
  return n === 0 ? "0" : n.toFixed(1).replace(/\.0$/, "");
}

const CATEGORY_LABEL: Record<string, string> = {
  food: "食事・飲み",
  sports: "運動・スポーツ",
  entertainment: "エンタメ",
  outdoor: "アウトドア・旅行",
  oshi: "推し活",
  daily: "日常",
};

export default function StatsPage() {
  const { entries } = useEntries();
  const { friends } = useFriends();
  const now = new Date();

  const usedTagIds = new Set<string>();
  const usedCustom = new Set<string>();
  for (const e of entries) {
    e.activityIds.forEach((id) => usedTagIds.add(id));
    e.customActivities.forEach((a) => usedCustom.add(a));
  }

  const summary = getMonthSummary(
    entries,
    friends,
    now.getFullYear(),
    now.getMonth(),
  );

  const handleShare = async () => {
    const topActLabel = summary.topActId
      ? ALL_TAGS.find((t) => t.id === summary.topActId)?.label
      : null;
    const text = [
      `${now.getFullYear()}年${now.getMonth() + 1}月のきろく`,
      `記録した日: ${summary.recordedDays}日 / ${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}日`,
      summary.topFriend ? `一番会った人: ${summary.topFriend.name}` : "",
      topActLabel ? `一番多かった: ${topActLabel}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("クリップボードにコピーしました");
    }
  };

  return (
    <div className="page-container fade-up">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          marginBottom: "20px",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "12px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          イベント管理
        </h1>
        <button
          onClick={handleShare}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "7px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            background: "var(--bg3)",
            color: "var(--text-sub)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          <Share2 size={13} strokeWidth={2} />
          今月をシェア
        </button>
      </div>

      {/* Monthly summary */}
      {summary.total > 0 && (
        <div
          style={{
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-sub)",
              marginBottom: "12px",
              letterSpacing: "0.05em",
            }}
          >
            {now.getFullYear()}年{now.getMonth() + 1}月のまとめ
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            <StatCard label="記録した日" value={`${summary.recordedDays}日`} />
            <StatCard label="記録件数" value={`${summary.total}件`} />
            {summary.topFriend ? (
              <StatCard label="最多" value={summary.topFriend.name} />
            ) : (
              <StatCard label="友人" value="-" />
            )}
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 0",
            color: "var(--text-sub)",
          }}
        >
          <BarChart size={48} strokeWidth={1.2} color="var(--border)" />
          <p style={{ marginTop: "16px", fontSize: "13px" }}>
            まだ記録がありません
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {ACTIVITY_CATEGORIES.map((cat) => {
            const catTags = cat.tags.filter((t) => usedTagIds.has(t.id));
            if (catTags.length === 0) return null;
            return (
              <section key={cat.id}>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "var(--text-sub)",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  {CATEGORY_LABEL[cat.id] ?? cat.label}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {catTags.map((tag) => {
                    const s = getActivityStats(entries, tag.id);
                    return (
                      <div
                        key={tag.id}
                        className="card"
                        style={{ padding: "14px 16px" }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            marginBottom: "12px",
                            fontSize: "14px",
                          }}
                        >
                          {tag.label}
                        </p>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "6px",
                          }}
                        >
                          <StatCard label="今月" value={`${s.thisMonth}回`} />
                          <StatCard label="過去1年" value={`${s.pastYear}回`} />
                          <StatCard
                            label="月平均"
                            value={`${fmt(s.monthlyAvg)}回`}
                          />
                          <StatCard
                            label="週平均"
                            value={`${fmt(s.weeklyAvg)}回`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {usedCustom.size > 0 && (
            <section>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--text-sub)",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                カスタム
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {[...usedCustom].map((label) => {
                  const s = getActivityStats(entries, label);
                  return (
                    <div
                      key={label}
                      className="card"
                      style={{ padding: "14px 16px" }}
                    >
                      <p
                        style={{
                          fontWeight: 600,
                          marginBottom: "12px",
                          fontSize: "14px",
                        }}
                      >
                        {label}
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "6px",
                        }}
                      >
                        <StatCard label="今月" value={`${s.thisMonth}回`} />
                        <StatCard label="過去1年" value={`${s.pastYear}回`} />
                        <StatCard
                          label="月平均"
                          value={`${fmt(s.monthlyAvg)}回`}
                        />
                        <StatCard
                          label="週平均"
                          value={`${fmt(s.weeklyAvg)}回`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
