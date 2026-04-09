import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ONBOARDED_KEY } from "../store/useStore";
import { BookOpen, Users, Sparkles } from "../components/Icons";

const STEPS = [
  {
    Icon: BookOpen,
    title: "きろくへようこそ",
    desc: "誰と、どこで、何したかを5秒で記録。\n友達との思い出を振り返れるようになります。",
  },
  {
    Icon: Users,
    title: "友達を登録する",
    desc: "一度登録すれば次からリストで選ぶだけ。\n最後に会った日や今月何回会ったかも自動で分かります。",
  },
  {
    Icon: Sparkles,
    title: "さあ始めよう",
    desc: "記録が増えると「最近遊んでない友達」や\nイベントの統計も見られるようになります。",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem(ONBOARDED_KEY, "1");
    navigate("/");
  };

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fade-up"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        background: "var(--bg)",
      }}
    >
      {/* Decorative ruled lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${i * 52 + 40}px`,
              height: "1px",
              background: "var(--border)",
            }}
          />
        ))}
        {/* Red margin line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "52px",
            width: "1.5px",
            background: "#e8a5a0",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "28px",
          position: "relative",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "var(--accent-light)",
            border: "2px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <s.Icon size={36} strokeWidth={1.5} color="var(--accent)" />
        </div>

        {/* Text */}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(20px, 5vw, 26px)",
              fontWeight: 800,
              margin: "0 0 12px",
              letterSpacing: "0.04em",
            }}
          >
            {s.title}
          </h1>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.8,
              color: "var(--text-sub)",
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {s.desc}
          </p>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: "99px",
                height: "6px",
                transition: "all 0.25s",
                width: i === step ? "24px" : "6px",
                background: i === step ? "var(--accent)" : "var(--border)",
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={isLast ? finish : () => setStep((v) => v + 1)}
            className="btn-primary"
          >
            {isLast ? "始める" : "次へ"}
          </button>
          {!isLast && (
            <button
              onClick={finish}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                color: "var(--text-sub)",
                fontFamily: "var(--font-sans)",
                padding: "4px",
              }}
            >
              スキップ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
