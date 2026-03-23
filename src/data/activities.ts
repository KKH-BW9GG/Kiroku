import type { ActivityCategory } from '../types'

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'food',
    label: '食事・飲み',
    icon: '🍻',
    tags: [
      { id: 'nomikai', label: '飲み会', icon: '🍺', categoryId: 'food' },
      { id: 'lunch', label: 'ランチ', icon: '🍱', categoryId: 'food' },
      { id: 'dinner', label: 'ディナー', icon: '🍽️', categoryId: 'food' },
      { id: 'cafe', label: 'カフェ', icon: '☕', categoryId: 'food' },
      { id: 'izakaya', label: '居酒屋', icon: '🏮', categoryId: 'food' },
    ],
  },
  {
    id: 'sports',
    label: '運動・スポーツ',
    icon: '🏃',
    tags: [
      { id: 'gym', label: 'ジム', icon: '💪', categoryId: 'sports' },
      { id: 'running', label: 'ランニング', icon: '🏃', categoryId: 'sports' },
      { id: 'tennis', label: 'テニス', icon: '🎾', categoryId: 'sports' },
      { id: 'golf', label: 'ゴルフ', icon: '⛳', categoryId: 'sports' },
      { id: 'soccer', label: 'サッカー', icon: '⚽', categoryId: 'sports' },
      { id: 'baseball', label: '野球', icon: '⚾', categoryId: 'sports' },
      { id: 'basketball', label: 'バスケ', icon: '🏀', categoryId: 'sports' },
      { id: 'swimming', label: '水泳', icon: '🏊', categoryId: 'sports' },
      { id: 'badminton', label: 'バドミントン', icon: '🏸', categoryId: 'sports' },
    ],
  },
  {
    id: 'entertainment',
    label: 'エンタメ',
    icon: '🎬',
    tags: [
      { id: 'movie', label: '映画', icon: '🎬', categoryId: 'entertainment' },
      { id: 'karaoke', label: 'カラオケ', icon: '🎤', categoryId: 'entertainment' },
      { id: 'live', label: 'ライブ', icon: '🎵', categoryId: 'entertainment' },
      { id: 'game', label: 'ゲーム', icon: '🎮', categoryId: 'entertainment' },
      { id: 'bowling', label: 'ボウリング', icon: '🎳', categoryId: 'entertainment' },
      { id: 'escape', label: '謎解き', icon: '🔐', categoryId: 'entertainment' },
    ],
  },
  {
    id: 'outdoor',
    label: 'アウトドア・旅行',
    icon: '🌳',
    tags: [
      { id: 'travel', label: '旅行', icon: '✈️', categoryId: 'outdoor' },
      { id: 'hiking', label: 'ハイキング', icon: '🥾', categoryId: 'outdoor' },
      { id: 'bbq', label: 'BBQ', icon: '🔥', categoryId: 'outdoor' },
      { id: 'drive', label: 'ドライブ', icon: '🚗', categoryId: 'outdoor' },
      { id: 'camping', label: 'キャンプ', icon: '⛺', categoryId: 'outdoor' },
      { id: 'beach', label: 'ビーチ', icon: '🏖️', categoryId: 'outdoor' },
    ],
  },
  {
    id: 'oshi',
    label: '推し活',
    icon: '✨',
    tags: [
      { id: 'concert', label: 'コンサート', icon: '🎤', categoryId: 'oshi' },
      { id: 'goods', label: 'グッズ購入', icon: '🛍️', categoryId: 'oshi' },
      { id: 'fanmeet', label: '会いに行く', icon: '🤝', categoryId: 'oshi' },
      { id: 'streaming', label: '配信・観覧', icon: '📺', categoryId: 'oshi' },
    ],
  },
  {
    id: 'daily',
    label: '日常',
    icon: '🏠',
    tags: [
      { id: 'shopping', label: '買い物', icon: '🛒', categoryId: 'daily' },
      { id: 'study', label: '勉強', icon: '📚', categoryId: 'daily' },
      { id: 'work', label: '作業', icon: '💻', categoryId: 'daily' },
      { id: 'tea', label: 'お茶', icon: '🍵', categoryId: 'daily' },
      { id: 'party', label: 'ホームパーティ', icon: '🎉', categoryId: 'daily' },
    ],
  },
]

export const ALL_TAGS = ACTIVITY_CATEGORIES.flatMap((c) => c.tags)
