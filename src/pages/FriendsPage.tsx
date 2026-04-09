import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useFriends,
  useEntries,
  lastMetDate,
  daysSince,
  countThisMonth,
} from "../store/useStore";
import {
  ChevronLeft,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Clock,
} from "../components/Icons";

const COLORS = [
  "#4FC3F7",
  "#F48FB1",
  "#A5D6A7",
  "#FFD54F",
  "#CE93D8",
  "#80DEEA",
  "#FFAB91",
];

export default function FriendsPage() {
  const navigate = useNavigate();
  const { friends, addFriend, deleteFriend } = useFriends();
  const { entries } = useEntries();
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addFriend(name, COLORS[friends.length % COLORS.length]);
    setNewName("");
  };

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const inactiveFriends = [...friends]
    .map((f) => {
      const last = lastMetDate(entries, f.id);
      const days = last ? daysSince(last) : 99999;
      return { ...f, days };
    })
    .sort((a, b) => b.days - a.days);

  const inputStyle = {
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "16px",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-sans)",
  };

  return (
    <div className="page-container fade-up">
      {/* Header */}
      <div
        style={{
          paddingTop: "20px",
          marginBottom: "20px",
          borderBottom: "2px solid var(--border)",
          paddingBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              fontSize: "clamp(20px, 4vw, 26px)",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "0.04em",
              flex: 1,
            }}
          >
            友人管理
          </h1>
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
            {friends.length}人
          </span>
        </div>
      </div>

      {/* Add friend */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="名前を入力..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={handleAdd}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "12px 18px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            whiteSpace: "nowrap",
          }}
        >
          <UserPlus size={15} strokeWidth={2} />
          追加
        </button>
      </div>

      {/* Search */}
      {friends.length > 4 && (
        <div style={{ marginBottom: "16px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="友人を検索..."
            style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
          />
        </div>
      )}

      {/* Friends list */}
      {friends.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--text-sub)",
          }}
        >
          <UserPlus size={40} strokeWidth={1.2} color="var(--border)" />
          <p style={{ marginTop: "12px", fontSize: "13px" }}>
            友人を追加しましょう
          </p>
        </div>
      ) : filteredFriends.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "32px 0",
            fontSize: "13px",
            color: "var(--text-sub)",
          }}
        >
          「{search}」は見つかりませんでした
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {filteredFriends.map((f) => {
            const last = lastMetDate(entries, f.id);
            const days = last ? daysSince(last) : null;
            const monthCount = countThisMonth(entries, f.id);
            return (
              <div
                key={f.id}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                }}
              >
                <Link
                  to={`/friends/${f.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    minWidth: 0,
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: f.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    {f.name[0]}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        margin: 0,
                        color: "var(--text)",
                      }}
                    >
                      {f.name}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-sub)",
                        margin: "2px 0 0",
                      }}
                    >
                      {days === null
                        ? "記録なし"
                        : days === 0
                          ? "今日会った"
                          : `${days}日振り`}
                      {monthCount > 0 && ` · 今月${monthCount}回`}
                    </p>
                    {f.memo && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-sub)",
                          opacity: 0.7,
                          margin: "2px 0 0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.memo}
                      </p>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`${f.name}を削除しますか？`))
                      deleteFriend(f.id);
                  }}
                  style={{
                    fontSize: "12px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    color: "var(--text-sub)",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  削除
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Recently inactive */}
      {friends.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <button
            onClick={() => setShowInactive((v) => !v)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              background: "var(--bg2)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} strokeWidth={2} color="var(--text-sub)" />
              最近遊んでない友達
            </span>
            {showInactive ? (
              <ChevronUp size={16} strokeWidth={2} color="var(--text-sub)" />
            ) : (
              <ChevronDown size={16} strokeWidth={2} color="var(--text-sub)" />
            )}
          </button>

          {showInactive && (
            <div
              style={{
                marginTop: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
              className="fade-in"
            >
              {inactiveFriends.map((f) => (
                <Link
                  key={f.id}
                  to={`/friends/${f.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: f.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {f.name[0]}
                  </div>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: "13px",
                      flex: 1,
                      margin: 0,
                      color: "var(--text)",
                    }}
                  >
                    {f.name}
                  </p>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color:
                        f.days > 30
                          ? "#C0392B"
                          : f.days > 14
                            ? "#e67e22"
                            : "var(--text-sub)",
                    }}
                  >
                    {f.days === 99999 ? "記録なし" : `${f.days}日前`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
