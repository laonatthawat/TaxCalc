// เงินได้ 8 ประเภทตามมาตรา 40 ประมวลรัษฎากร — เก็บไว้ตั้งแต่ตอนกรอกรายรับ
// เพื่อให้โมดูลภาษี (ทำทีหลัง) คำนวณค่าใช้จ่ายเหมา/เครดิตภาษีของแต่ละประเภทได้ถูกต้อง
// โดยไม่ต้องย้อนกลับมาแก้ข้อมูลเก่า
export type IncomeType = '40_1' | '40_2' | '40_3' | '40_4' | '40_5' | '40_6' | '40_7' | '40_8'

export const INCOME_TYPE_OPTIONS: { value: IncomeType; label: string }[] = [
  { value: '40_1', label: 'เงินเดือน/ค่าจ้าง (40(1))' },
  { value: '40_2', label: 'ค่านายหน้า/คอมมิชชั่น/ฟรีแลนซ์ (40(2))' },
  { value: '40_3', label: 'ค่าลิขสิทธิ์ (40(3))' },
  { value: '40_4', label: 'ดอกเบี้ย/เงินปันผล/กำไรขายหลักทรัพย์ (40(4))' },
  { value: '40_5', label: 'ค่าเช่า (40(5))' },
  { value: '40_6', label: 'วิชาชีพอิสระ (40(6))' },
  { value: '40_7', label: 'รับเหมาก่อสร้าง (40(7))' },
  { value: '40_8', label: 'ธุรกิจ/พาณิชย์/ขายของออนไลน์ (40(8))' },
]

export function getIncomeTypeLabel(type: IncomeType): string {
  return INCOME_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
}

export type Income = {
  id: string
  name: string
  amount: number
  income_type: IncomeType
  is_recurring: boolean
  billing_cycle: string | null // 'monthly' | 'yearly' — มีค่าเมื่อ is_recurring = true เท่านั้น
  next_payment_date: string | null // มีค่าเมื่อ is_recurring = true เท่านั้น
  received_date: string | null // มีค่าเมื่อ is_recurring = false เท่านั้น (วันที่ได้รับเงินก้อนนั้น)
}

// แปลงรายรับประจำให้เป็น "ค่าเทียบเท่ารายเดือน" เสมอ (เหมือน toMonthlyPrice ฝั่งรายจ่าย)
// รายรับแบบครั้งเดียว (one-time) ไม่นับในนี้ เพราะไม่ใช่กระแสเงินสดที่เกิดซ้ำทุกเดือน
export function toMonthlyRecurringAmount(income: Income): number {
  if (!income.is_recurring) return 0
  return income.billing_cycle === 'yearly' ? income.amount / 12 : income.amount
}

export function calculateIncomeTotals(incomes: Income[]) {
  const currentYear = new Date().getFullYear()

  const totalMonthlyRecurring = incomes
    .filter((i) => i.is_recurring)
    .reduce((sum, i) => sum + toMonthlyRecurringAmount(i), 0)

  // รวมรายรับก้อนเดียว (โบนัส/ฟรีแลนซ์) เฉพาะที่ได้รับในปีปัจจุบัน — ใช้เป็นฐานประมาณการภาษีทีหลัง
  const totalOneTimeThisYear = incomes
    .filter((i) => !i.is_recurring && i.received_date)
    .filter((i) => Number(i.received_date!.slice(0, 4)) === currentYear)
    .reduce((sum, i) => sum + i.amount, 0)

  const totalAnnualEstimate = totalMonthlyRecurring * 12 + totalOneTimeThisYear

  return { totalMonthlyRecurring, totalOneTimeThisYear, totalAnnualEstimate }
}

// แปลงจำนวนวันเป็นข้อความอ่านง่ายฝั่งรายรับ (ต่างจาก formatDaysUntilRenewal ของฝั่งรายจ่าย
// ตรงคำที่ใช้ — รายรับพูดว่า "จะได้รับ" ไม่ใช่ "ครบกำหนด")
export function formatDaysUntilIncome(days: number): string {
  if (days < 0) return `เลยกำหนด ${Math.abs(days)} วัน`
  if (days === 0) return 'วันนี้'
  if (days === 1) return 'พรุ่งนี้'
  return `อีก ${days} วัน`
}

// แยก list รายรับประจำ (เรียงตามวันจ่ายถัดไปใกล้สุดก่อน) กับรายรับที่ได้รับแล้ว (เรียงล่าสุดก่อน)
export function splitAndSortIncomes(incomes: Income[]) {
  const recurring = incomes
    .filter((i) => i.is_recurring)
    .sort((a, b) => new Date(a.next_payment_date!).getTime() - new Date(b.next_payment_date!).getTime())

  const oneTime = incomes
    .filter((i) => !i.is_recurring)
    .sort((a, b) => new Date(b.received_date!).getTime() - new Date(a.received_date!).getTime())

  return { recurring, oneTime }
}
