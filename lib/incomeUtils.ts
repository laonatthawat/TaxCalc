// เงินได้ 8 ประเภทตามมาตรา 40 ประมวลรัษฎากร — เก็บไว้ตั้งแต่ตอนกรอกรายรับ
// เพื่อให้โมดูลภาษีคำนวณค่าใช้จ่ายเหมาของแต่ละประเภทได้ถูกต้อง โดยไม่ต้องย้อนกลับมาแก้ข้อมูลเก่า
export type AssessableIncomeType = '40_1' | '40_2' | '40_3' | '40_4' | '40_5' | '40_6' | '40_7' | '40_8'

// 'gift' = เงินให้จากพ่อแม่/คู่สมรส/บุตร/ญาติ หรือให้โดยเสน่หา — ไม่ใช่เงินได้ตามมาตรา 40
// เป็นเงินได้ที่ได้รับยกเว้นภาษีตามมาตรา 42(27)/(28) (จากบุพการี/คู่สมรส/บุตร ไม่เกิน 20 ล้านบาท/ปี
// จากบุคคลอื่นไม่เกิน 10 ล้านบาท/ปี) จึงแยกออกจากประเภทเงินได้ที่ต้องเสียภาษี และไม่ถูกนำไปคำนวณในโมดูลภาษี
export type IncomeType = AssessableIncomeType | 'gift'

// บางประเภท (ค่าเช่า 40(5), วิชาชีพอิสระ 40(6)) มีอัตราหักค่าใช้จ่ายเหมาที่ต่างกันตาม "ลักษณะย่อย"
// ของเงินได้ — ต้องรู้ลักษณะย่อยถึงจะรู้อัตราที่ถูกต้อง เก็บเป็น sub id แยกจาก income_type หลัก
export type IncomeSub = string | null

export type IncomeSubOption = { id: string; label: string; rate: number }

export type IncomeTypeMeta = {
  value: IncomeType
  label: string
  shortLabel: string
  icon: string
  exempt?: true
  /** 40(1)+40(2) ใช้เพดานหักค่าใช้จ่าย 100,000 ร่วมกัน แยกจากประเภทอื่นที่มีเพดานของตัวเอง */
  capGroup?: 'salary'
  /** อัตราเหมาคงที่ (ไม่มีลักษณะย่อย) — undefined เมื่อ exempt หรือมี subs */
  rate?: number
  /** เพดานเงินหักสูงสุด (บาท) — undefined = ไม่มีเพดาน (หักตามจริงได้ทั้งหมดของอัตรา) */
  cap?: number
  /** ลักษณะย่อยที่มีอัตราเหมาต่างกัน (40(5) ค่าเช่า, 40(6) วิชาชีพอิสระ) */
  subs?: IncomeSubOption[]
}

export const INCOME_TYPES: IncomeTypeMeta[] = [
  { value: '40_1', label: 'เงินเดือน / ค่าจ้าง (40(1))', shortLabel: 'เงินเดือน 40(1)', icon: 'briefcase', capGroup: 'salary' },
  { value: '40_2', label: 'ค่านายหน้า / คอมมิชชั่น / ฟรีแลนซ์ (40(2))', shortLabel: 'ฟรีแลนซ์ 40(2)', icon: 'laptop', capGroup: 'salary' },
  { value: '40_3', label: 'ค่าลิขสิทธิ์ / กู๊ดวิลล์ (40(3))', shortLabel: 'ค่าลิขสิทธิ์ 40(3)', icon: 'file-text', rate: 0.5, cap: 100000 },
  { value: '40_4', label: 'ดอกเบี้ย / เงินปันผล / กำไรขายหลักทรัพย์ (40(4))', shortLabel: 'ดอกเบี้ย·ปันผล 40(4)', icon: 'piggy-bank', rate: 0, cap: 0 },
  {
    value: '40_5',
    label: 'ค่าเช่า (40(5))',
    shortLabel: 'ค่าเช่า 40(5)',
    icon: 'key-round',
    // อัตราตามพระราชกฤษฎีกา (ฉบับที่ 629) มีผลตั้งแต่ปีภาษี 2560 เป็นต้นไป —
    // ที่ดินเกษตรกรรมปรับลดจาก 20% เหลือ 15% และแยกที่ดินที่ไม่ใช้เกษตรกรรมออกมาเป็นอีกลักษณะย่อยที่ 15% เท่ากัน
    subs: [
      { id: 'building', label: 'บ้าน / โรงเรือน / สิ่งปลูกสร้างอย่างอื่น / แพ — เหมา 30%', rate: 0.3 },
      { id: 'farm', label: 'ที่ดินที่ใช้ในการเกษตรกรรม — เหมา 15%', rate: 0.15 },
      { id: 'land_other', label: 'ที่ดินที่มิได้ใช้ในการเกษตรกรรม — เหมา 15%', rate: 0.15 },
      { id: 'vehicle', label: 'ยานพาหนะ — เหมา 30%', rate: 0.3 },
      { id: 'other', label: 'ทรัพย์สินอื่น — เหมา 10%', rate: 0.1 },
    ],
  },
  {
    value: '40_6',
    label: 'วิชาชีพอิสระ (40(6))',
    shortLabel: 'วิชาชีพอิสระ 40(6)',
    icon: 'stethoscope',
    subs: [
      { id: 'medical', label: 'ประกอบโรคศิลปะ (แพทย์ พยาบาล) — เหมา 60%', rate: 0.6 },
      { id: 'pro', label: 'กฎหมาย วิศวกรรม สถาปัตย์ บัญชี ประณีตศิลป์ — เหมา 30%', rate: 0.3 },
    ],
  },
  { value: '40_7', label: 'รับเหมาก่อสร้าง (จัดหาสัมภาระเอง) (40(7))', shortLabel: 'รับเหมา 40(7)', icon: 'hammer', rate: 0.6 },
  { value: '40_8', label: 'ธุรกิจ / พาณิชย์ / ขายของออนไลน์ (40(8))', shortLabel: 'ธุรกิจ 40(8)', icon: 'store', rate: 0.6 },
  { value: 'gift', label: 'เงินให้ (จากพ่อแม่/คู่สมรส/ญาติ) — ยกเว้นภาษี', shortLabel: 'เงินให้ (ยกเว้นภาษี)', icon: 'gift', exempt: true },
]

// คงชื่อเดิม INCOME_TYPE_OPTIONS ไว้ (label สั้นพอสำหรับ dropdown) ให้โค้ดเก่าที่ import ชื่อนี้ยังใช้ได้
export const INCOME_TYPE_OPTIONS: { value: IncomeType; label: string }[] = INCOME_TYPES.map((t) => ({
  value: t.value,
  label: t.label,
}))

export function getIncomeTypeMeta(type: IncomeType): IncomeTypeMeta {
  return INCOME_TYPES.find((t) => t.value === type) ?? INCOME_TYPES[0]
}

export function getIncomeTypeLabel(type: IncomeType): string {
  return getIncomeTypeMeta(type).label
}

export function isExemptGiftIncome(type: IncomeType): type is 'gift' {
  return type === 'gift'
}

// อัตราหักค่าใช้จ่ายเหมาที่แท้จริงของรายการหนึ่ง — ต้องรู้ sub ด้วยถ้าประเภทนั้นมีลักษณะย่อย
export function expenseRateOf(type: IncomeType, sub: IncomeSub): number {
  const t = getIncomeTypeMeta(type)
  if (t.exempt) return 0
  if (t.capGroup === 'salary') return 0.5
  if (t.subs) {
    const s = t.subs.find((x) => x.id === sub) ?? t.subs[0]
    return s.rate
  }
  return t.rate ?? 0
}

export function subLabelOf(type: IncomeType, sub: IncomeSub): string {
  const t = getIncomeTypeMeta(type)
  if (!t.subs) return ''
  const s = t.subs.find((x) => x.id === sub) ?? t.subs[0]
  return s.label.split(' — ')[0]
}

// 4 รอบการรับเงิน (เดิมมีแค่รายเดือน/รายปี — เพิ่มราย 3 เดือนกับราย 6 เดือน ให้ตรงกับรอบจ่ายจริงที่พบบ่อย
// เช่น ค่าเช่าบางที่จ่ายเป็นไตรมาส หรือโบนัสครึ่งปี)
export type BillingCycle = 'monthly' | 'quarterly' | 'biannual' | 'yearly'

export const CYCLE_OPTIONS: { value: BillingCycle; label: string; timesPerYear: number }[] = [
  { value: 'monthly', label: 'รายเดือน', timesPerYear: 12 },
  { value: 'quarterly', label: 'ราย 3 เดือน', timesPerYear: 4 },
  { value: 'biannual', label: 'ราย 6 เดือน', timesPerYear: 2 },
  { value: 'yearly', label: 'รายปี', timesPerYear: 1 },
]

export function timesPerYearOf(cycle: BillingCycle | string | null): number {
  return CYCLE_OPTIONS.find((c) => c.value === cycle)?.timesPerYear ?? 12
}

function monthsPerCycle(cycle: BillingCycle | string | null): number {
  switch (cycle) {
    case 'yearly':
      return 12
    case 'biannual':
      return 6
    case 'quarterly':
      return 3
    default:
      return 1
  }
}

function toISODate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

// เลื่อนวันที่ไปรอบถัดไปตามรอบการรับเงิน — ถ้าวันที่เดิมเป็นวันสุดท้ายของเดือน (เช่น 31)
// แล้วเดือนถัดไปมีวันน้อยกว่า จะปรับลงมาเป็นวันสุดท้ายของเดือนนั้นแทน ไม่ล้นไปเดือนถัดไปอีกที
export function getNextCycleDate(dateStr: string, billingCycle: string | null): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const monthsToAdd = monthsPerCycle(billingCycle)

  let newMonth = m + monthsToAdd
  let newYear = y
  while (newMonth > 12) {
    newMonth -= 12
    newYear += 1
  }

  const lastDayOfNewMonth = new Date(newYear, newMonth, 0).getDate()
  const newDay = Math.min(d, lastDayOfNewMonth)

  return toISODate(newYear, newMonth, newDay)
}

export type Income = {
  id: string
  name: string
  amount: number
  income_type: IncomeType
  income_sub: IncomeSub
  is_recurring: boolean
  billing_cycle: BillingCycle | null // มีค่าเมื่อ is_recurring = true เท่านั้น
  next_payment_date: string | null // มีค่าเมื่อ is_recurring = true เท่านั้น
  received_date: string | null // มีค่าเมื่อ is_recurring = false เท่านั้น (วันที่ได้รับเงินก้อนนั้น)
}

// แปลงรายรับประจำให้เป็น "ค่าเทียบเท่ารายเดือน" เสมอ (เหมือน toMonthlyPrice ฝั่งรายจ่ายเดิม)
// รายรับแบบครั้งเดียว (one-time) ไม่นับในนี้ เพราะไม่ใช่กระแสเงินสดที่เกิดซ้ำทุกเดือน
export function toMonthlyRecurringAmount(income: Income): number {
  if (!income.is_recurring) return 0
  const n = timesPerYearOf(income.billing_cycle)
  return (income.amount * n) / 12
}

// แปลงรายรับหนึ่งรายการเป็นยอดรวมทั้งปี (ใช้ทั้งในหน้ารายรับและหน้าภาษี)
export function toAnnualAmount(income: Income): number {
  if (!income.is_recurring) return income.amount
  return income.amount * timesPerYearOf(income.billing_cycle)
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

// แปลงจำนวนวันเป็นข้อความอ่านง่ายฝั่งรายรับ (ต่างจาก formatDaysUntilRenewal ของฝั่งรายจ่ายเดิม
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
