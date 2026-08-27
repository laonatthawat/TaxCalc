import HomeContent from '@/components/marketing/HomeContent'

// หน้านี้ดูได้ทั้งคนที่ login อยู่แล้วและยังไม่ได้ login (เช่น กดโลโก้จากหน้ารายรับ/ภาษีกลับมาดู)
// ไม่บังคับเด้งออกจากหน้านี้เมื่อ login อยู่แล้ว เพื่อให้ "กลับหน้าแรก" ใช้งานได้จริง
export default function Home() {
  return <HomeContent />
}
