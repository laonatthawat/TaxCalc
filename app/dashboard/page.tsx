import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'
import { calculateIncomeTotals } from '@/lib/incomeUtils'

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

  // ดึงรายรับมาด้วย เพื่อคำนวณ "กระแสเงินสดสุทธิ" (รายรับประจำ − รายจ่ายประจำ) โชว์ในการ์ดสรุป
  // ไม่ error ถ้า query พลาด เพราะหน้านี้โฟกัสรายจ่ายเป็นหลัก รายรับเป็นแค่ข้อมูลเสริม
  const { data: incomes } = await supabase.from('incomes').select('*')
  const { totalMonthlyRecurring: monthlyIncome } = calculateIncomeTotals(incomes ?? [])

  return (
    <DashboardClient
      initialSubscriptions={subscriptions ?? []}
      userEmail={user.email ?? ''}
      monthlyBudget={settings?.monthly_budget ?? null}
      monthlyIncome={monthlyIncome}
    />
  )
}