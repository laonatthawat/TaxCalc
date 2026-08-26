import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TaxClient from '@/components/TaxClient'

export default async function TaxPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ดึงรายรับทั้งหมดมาคำนวณ (groupIncomeByTypeAnnual ฝั่ง lib จะเป็นคนกรอง/annualize เอง)
  const { data: incomes } = await supabase.from('incomes').select('*')

  // ไม่ error ถ้ายังไม่เคยกรอกค่าลดหย่อน (ยังไม่มีแถว) — หน้า client จะใช้ค่า default (0) แทน
  const { data: deductions } = await supabase
    .from('tax_deductions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return <TaxClient initialIncomes={incomes ?? []} initialDeductions={deductions} userEmail={user.email ?? ''} />
}
