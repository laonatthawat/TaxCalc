import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OverviewClient from '@/components/OverviewClient'
import { calculateTotals } from '@/lib/subscriptionUtils'
import { calculateIncomeTotals } from '@/lib/incomeUtils'
import { calculateTaxEstimate, DEFAULT_TAX_DEDUCTIONS, TaxDeductions } from '@/lib/taxUtils'

export default async function OverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ดึงข้อมูลจากทั้ง 3 โมดูลพร้อมกัน — ไม่ error ถ้าบางตารางยังไม่มีข้อมูล
  // (การ์ดของโมดูลนั้นจะแสดงสถานะ "ยังไม่มีข้อมูล" พร้อมลิงก์ให้ไปเริ่มกรอกแทน)
  const [{ data: subscriptions }, { data: incomes }, { data: deductions }] = await Promise.all([
    supabase.from('subscriptions').select('*'),
    supabase.from('incomes').select('*'),
    supabase.from('tax_deductions').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  const { totalMonthly: monthlyExpense } = calculateTotals(subscriptions ?? [])
  const { totalMonthlyRecurring: monthlyIncome, totalAnnualEstimate: annualIncomeEstimate } =
    calculateIncomeTotals(incomes ?? [])

  // ใช้ค่าลดหย่อน default (0 ทั้งหมด) แทนถ้ายังไม่เคยกรอก — ให้ผลลัพธ์เดียวกับหน้า /tax ตอนยังไม่ตั้งค่า
  const fullDeductions: TaxDeductions = { ...DEFAULT_TAX_DEDUCTIONS, ...(deductions ?? {}) }
  const taxEstimate = calculateTaxEstimate(incomes ?? [], fullDeductions)

  return (
    <OverviewClient
      userEmail={user.email ?? ''}
      hasExpenseData={(subscriptions ?? []).length > 0}
      monthlyExpense={monthlyExpense}
      hasIncomeData={(incomes ?? []).length > 0}
      monthlyIncome={monthlyIncome}
      annualIncomeEstimate={annualIncomeEstimate}
      estimatedTax={taxEstimate.totalTax}
      effectiveTaxRate={taxEstimate.effectiveRate}
    />
  )
}
