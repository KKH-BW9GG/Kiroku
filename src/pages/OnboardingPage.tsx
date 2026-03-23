import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ONBOARDED_KEY } from '../store/useStore'

const STEPS = [
  {
    icon: '📖',
    title: 'きろくへようこそ',
    desc: '誰と、どこで、何したかを5秒で記録。\n友達との思い出を振り返れるようになります。',
  },
  {
    icon: '👥',
    title: '友達を登録する',
    desc: '一度登録すれば次からリストで選ぶだけ。\n最後に会った日や今月何回会ったかも自動で分かります。',
  },
  {
    icon: '✨',
    title: 'さあ始めよう',
    desc: '記録が増えると「最近遊んでない友達」や\nイベントの統計も見られるようになります。',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const finish = () => {
    localStorage.setItem(ONBOARDED_KEY, '1')
    navigate('/')
  }

  const s = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 fade-up" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
        <div className="text-7xl">{s.icon}</div>
        <div>
          <h1 className="text-2xl font-bold mb-3">{s.title}</h1>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-sub)' }}>{s.desc}</p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                background: i === step ? 'var(--accent)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        <button
          onClick={isLast ? finish : () => setStep((v) => v + 1)}
          className="w-full py-4 rounded-2xl text-base font-bold"
          style={{ background: 'var(--accent)', color: '#0F1117' }}
        >
          {isLast ? '始める' : '次へ'}
        </button>

        {!isLast && (
          <button onClick={finish} className="text-sm" style={{ color: 'var(--text-sub)' }}>
            スキップ
          </button>
        )}
      </div>
    </div>
  )
}
