import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomeContent from '@/components/marketing/HomeContent'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ถ้า login อยู่แล้วเด้งเข้า dashboard ตรงๆ เหมือนเดิม — หน้านี้ (landing page) สำหรับคนที่ยังไม่ login เท่านั้น
  if (user) {
    redirect('/dashboard')
  }

  return <HomeContent />
}
