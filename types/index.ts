export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Todo {
  id: string
  userId: string
  title: string
  description?: string
  status: 'pending' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  icon?: string
  color?: string
  targetFrequency?: number
  createdAt: Date
  updatedAt: Date
  records: HabitRecord[]
}

export interface HabitRecord {
  id: string
  habitId: string
  userId: string
  completedAt: Date
  note?: string
  createdAt: Date
}

export interface JournalEntry {
  id: string
  userId: string
  title?: string
  content: string
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious'
  tags: string[]
  weather?: string
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface ExportData {
  exportDate: string
  version: string
  user: {
    email: string
    username: string
  }
  todos: Todo[]
  habits: Habit[]
  journal: JournalEntry[]
}