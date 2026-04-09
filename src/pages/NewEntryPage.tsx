import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEntries,
  useFriends,
  useRecentTags,
  lastMetDate,
  daysSince,
} from "../store/useStore";
import { ACTIVITY_CATEGORIES, ALL_TAGS } from "../data/activities";
import type { Entry } from "../types";
import { ChevronLeft, MapPin, Clock } from "../components/Icons";

function today() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const COLORS = [
  "#4FC3F7",
  "#F48FB1",
  "#A5D6A7",
  "#FFD54F",
  "#CE93D8",
  "#80DEEA",
  "#FFAB91",
];

interface Props {
  existing?: Entry;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: "食事・飲み",
  sports: "運動",
  entertainment: "エンタメ",
  outdoor: "アウトドア",
  oshi: "推し活",
  daily: "日常",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "var(--text-sub)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: "8px",
      }}
    >
      {children}
    </label>
  );
}

function EntryForm({ existing }: Props) {
  const navigate = useNavigate();
  const { addEntry, updateEntry, entries } = useEntries();
  const { friends, addFriend } = useFriends();
  const recentTagIds = useRecentTags();

  const [date, setDate] = useState(existing?.date ?? today());
  const [selectedFriends, setSelectedFriends] = useState<string[]>(
    existing?.friendIds ?? [],
  );
  const [location, setLocation] = useState(existing?.location ?? "");
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    existing?.activityIds ?? [],
  );
  const [customActivity, setCustomActivity] = useState("");
  const [customActivities, setCustomActivities] = useState<string[]>(
    existing?.customActivities ?? [],
  );
  const [memo, setMemo] = useState(existing?.memo ?? "");
  const [newFriendName, setNewFriendName] = useState("");

  const isEdit = !!existing;

  const recentTags = recentTagIds
    .map((id) => ALL_TAGS.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 5) as typeof ALL_TAGS;

  const toggleFriend = (id: string) =>
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleActivity = (id: string) =>
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const addCustomActivity = () => {
    const v = customActivity.trim();
    if (v && !customActivities.includes(v))
      setCustomActivities((prev) => [...prev, v]);
    setCustomActivity("");
  };

  const handleAddFriend = () => {
    const name = newFriendName.trim();
    if (!name) return;
    const color = COLORS[friends.length % COLORS.length];
    const f = addFriend(name, color);
    setSelectedFriends((prev) => [...prev, f.id]);
    setNewFriendName("");
  };

  const handleSubmit = () => {
    const payload = {
      date,
      friendIds: selectedFriends,
      location,
      activityIds: selectedActivities,
      customActivities,
      memo,
    };
    isEdit ? updateEntry(existing.id, payload) : addEntry(payload);
    navigate("/");
  };

  const DATE_SHORTCUTS = [
    { label: "今日", value: today() },
    { label: "昨日", value: daysAgo(1) },
    { label: "一昨日", value: daysAgo(2) },
  ];

  const inputStyle = {
    width: "100%",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "16px",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-sans)",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  };

  return (
    <div className="page-container fade-up">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          paddingTop: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          aria-label="戻る"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            color: "var(--text-sub)",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "20px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          {isEdit ? "記録を編集" : "記録する"}
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Date */}
        <div>
          <SectionLabel>日付</SectionLabel>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            {DATE_SHORTCUTS.map((s) => (
              <button
                key={s.label}
                onClick={() => setDate(s.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.12s",
                  background: date === s.value ? "var(--accent)" : "var(--bg3)",
                  color: date === s.value ? "#fff" : "var(--text)",
                  border: `1px solid ${date === s.value ? "var(--accent)" : "var(--border)"}`,
                  fontWeight: date === s.value ? 700 : 400,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Who */}
        <div>
          <SectionLabel>誰と（任意）</SectionLabel>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            {friends.map((f) => {
              const sel = selectedFriends.includes(f.id);
              const last = lastMetDate(
                entries.filter((e) => !isEdit || e.id !== existing?.id),
                f.id,
              );
              const days = last ? daysSince(last) : null;
              return (
                <button
                  key={f.id}
                  onClick={() => toggleFriend(f.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    background: sel ? f.color + "18" : "var(--bg2)",
                    border: `1.5px solid ${sel ? f.color : "var(--border)"}`,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: f.color,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {f.name[0]}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: sel ? f.color : "var(--text)",
                        fontWeight: sel ? 700 : 400,
                      }}
                    >
                      {f.name}
                    </span>
                  </div>
                  {days !== null && (
                    <span
                      style={{ fontSize: "10px", color: "var(--text-sub)" }}
                    >
                      {days === 0 ? "今日" : `${days}日振り`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
              placeholder="友人を追加..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={handleAddFriend}
              style={{
                padding: "0 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                background: "var(--bg3)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
              }}
            >
              追加
            </button>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionLabel>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <MapPin size={12} strokeWidth={2} />
              どこで
            </span>
          </SectionLabel>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="渋谷、新宿、オンライン..."
            style={inputStyle}
          />
        </div>

        {/* Activities */}
        <div>
          <SectionLabel>何した</SectionLabel>

          {recentTags.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "6px",
                  letterSpacing: "0.04em",
                }}
              >
                <Clock size={11} strokeWidth={2.5} />
                最近使った
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {recentTags.map((tag) => {
                  const sel = selectedActivities.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleActivity(tag.id)}
                      className={`chip${sel ? " active" : ""}`}
                      style={{
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {ACTIVITY_CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-sub)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  marginBottom: "6px",
                }}
              >
                {CATEGORY_ICONS[cat.id] ?? cat.label}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {cat.tags.map((tag) => {
                  const sel = selectedActivities.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleActivity(tag.id)}
                      className={`chip${sel ? " active" : ""}`}
                      style={{
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {customActivities.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              {customActivities.map((a, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: "13px",
                    background: "var(--accent)",
                    color: "#fff",
                  }}
                >
                  {a}
                  <button
                    onClick={() =>
                      setCustomActivities((prev) =>
                        prev.filter((_, j) => j !== i),
                      )
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "14px",
                      lineHeight: 1,
                      opacity: 0.8,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
            <input
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomActivity()}
              placeholder="その他を追加..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={addCustomActivity}
              style={{
                padding: "0 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                background: "var(--bg3)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
              }}
            >
              追加
            </button>
          </div>
        </div>

        {/* Memo */}
        <div>
          <SectionLabel>補足メモ（任意）</SectionLabel>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="楽しかった、久しぶりだった..."
            rows={3}
            style={{
              ...inputStyle,
              resize: "none",
              lineHeight: 1.6,
            }}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          {isEdit ? "変更を保存" : "記録する"}
        </button>
      </div>
    </div>
  );
}

export default function NewEntryPage() {
  const { id } = useParams<{ id?: string }>();
  const { entries } = useEntries();
  const existing = id ? entries.find((e) => e.id === id) : undefined;
  return <EntryForm existing={existing} />;
}
