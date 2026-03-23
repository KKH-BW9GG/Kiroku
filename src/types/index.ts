export interface Friend {
  id: string
  name: string
  color: string
  memo: string // 友人へのメモ
  createdAt: string
}

export interface Entry {
  id: string
  date: string // YYYY-MM-DD
  friendIds: string[]
  location: string
  activityIds: string[]
  customActivities: string[]
  memo: string
  createdAt: string
}

export interface ActivityTag {
  id: string
  label: string
  icon: string
  categoryId: string
}

export interface ActivityCategory {
  id: string
  label: string
  icon: string
  tags: ActivityTag[]
}
