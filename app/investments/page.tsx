import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InvestmentClient from '@/components/InvestmentClient'

export default async function InvestmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ไม่ error ถ้ายังไม่เคยตั้งแผน (ยังไม่มีแถว) — หน้า client จะใช้ค่า default แทน
  const { data: plan } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return <InvestmentClient initialPlan={plan} userEmail={user.email ?? ''} />
}
