import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_billing_date', { ascending: true })

  if (error) {
    return <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error.message}</p>
  }

  // งบรายจ่ายต่อเดือนของ user (สำหรับการ์ด "มิเตอร์ความเจ็บ") — ไม่ error ถ้ายังไม่เคยตั้งงบ (ยังไม่มีแถว)
  const { data: settings } = await supabase
    .from('user_settings')
    .select('monthly_budget')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <DashboardClient
      initialSubscriptions={subscriptions ?? []}
      userEmail={user.email ?? ''}
      monthlyBudget={settings?.monthly_budget ?? null}
    />
  )
}