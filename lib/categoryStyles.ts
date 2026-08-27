import { Tv, Music, Cloud, Briefcase, Dumbbell, Gamepad2, BookOpen, Sparkles, LucideIcon } from 'lucide-react'

type CategoryTheme = {
  gradientFrom: string
  gradientTo: string
  iconColor: string
  icon: LucideIcon
}

// ชุดธีมสี+ไอคอน วนลูปใช้ซ้ำ ไม่ผูกตายตัวกับชื่อหมวดหมู่ใดหมวดหมู่หนึ่ง
// ทุกสีมาจาก scale เดียวกันของธีม Organic (accent ส้ม / sage เขียว / neutral น้ำตาลอุ่น)
// แยกความต่างด้วย "ขั้น" ความเข้มบน scale เดียวกัน แทนที่จะสุ่มสีนอกธีม
const THEMES: CategoryTheme[] = [
  { gradientFrom: '#ffc6a5', gradientTo: '#fff2eb', iconColor: '#8c491a', icon: Tv },
  { gradientFrom: '#ccdbb2', gradientTo: '#f0fae1', iconColor: '#3d472b', icon: Music },
  { gradientFrom: '#dcd3c4', gradientTo: '#f9f4ed', iconColor: '#474238', icon: Cloud },
  { gradientFrom: '#d67f48', gradientTo: '#ffc6a5', iconColor: '#402310', icon: Briefcase },
  { gradientFrom: '#8fa073', gradientTo: '#ccdbb2', iconColor: '#272e1b', icon: Dumbbell },
  { gradientFrom: '#f6a06b', gradientTo: '#ffe1d0', iconColor: '#643312', icon: Gamepad2 },
  { gradientFrom: '#aebf92', gradientTo: '#e1eecc', iconColor: '#56633f', icon: BookOpen },
]

const FALLBACK_THEME: CategoryTheme = {
  gradientFrom: '#c0b6a5',
  gradientTo: '#eee7db',
  iconColor: '#645c50',
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