import { Tv, Music, Cloud, Briefcase, Dumbbell, Gamepad2, BookOpen, Sparkles, LucideIcon } from 'lucide-react'

type CategoryTheme = {
  gradientFrom: string
  gradientTo: string
  iconColor: string
  icon: LucideIcon
}

// ชุดธีมสี+ไอคอน วนลูปใช้ซ้ำ ไม่ผูกตายตัวกับชื่อหมวดหมู่ใดหมวดหมู่หนึ่ง
const THEMES: CategoryTheme[] = [
  { gradientFrom: '#F5C4B3', gradientTo: '#FAECE7', iconColor: '#993C1D', icon: Tv },
  { gradientFrom: '#C0DD97', gradientTo: '#EAF3DE', iconColor: '#3B6D11', icon: Music },
  { gradientFrom: '#B5D4F4', gradientTo: '#E6F1FB', iconColor: '#185FA5', icon: Cloud },
  { gradientFrom: '#CECBF6', gradientTo: '#EEEDFE', iconColor: '#3C3489', icon: Briefcase },
  { gradientFrom: '#F4C0D1', gradientTo: '#FBEAF0', iconColor: '#993556', icon: Dumbbell },
  { gradientFrom: '#FAC775', gradientTo: '#FAEEDA', iconColor: '#854F0B', icon: Gamepad2 },
  { gradientFrom: '#9FE1CB', gradientTo: '#E1F5EE', iconColor: '#0F6E56', icon: BookOpen },
]

const FALLBACK_THEME: CategoryTheme = {
  gradientFrom: '#D3D1C7',
  gradientTo: '#F1EFE8',
  iconColor: '#5F5E5A',
  icon: Sparkles,
}

// แปลงชื่อหมวดหมู่เป็นตัวเลขคงที่ (hash) เพื่อให้หมวดหมู่เดียวกัน
// ได้สี/ไอคอนเดิมเสมอ ไม่สุ่มใหม่ทุกครั้งที่ render
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getCategoryStyle(category: string | null): CategoryTheme {
  const key = category?.trim()
  if (!key) return FALLBACK_THEME

  const index = hashString(key) % THEMES.length
  return THEMES[index]
}