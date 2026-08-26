export type Subscription = {
  id: string
  name: string
  price: number
  billing_cycle: string
  next_billing_date: string
  category: string | null
}

// แปลงราคาให้เป็น "ค่าเทียบเท่ารายเดือน" เสมอ ไม่ว่า billing_cycle จะเป็นแบบไหน
// เพื่อให้เปรียบเทียบ/รวมยอดข้ามกันได้อย่างยุติธรรม
export function toMonthlyPrice(sub: Subscription): number {
  return sub.billing_cycle === 'yearly' ? sub.price / 12 : sub.price
}

export function calculateTotals(subscriptions: Subscription[]) {
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + toMonthlyPrice(sub), 0)
  const totalYearly = totalMonthly * 12
  return { totalMonthly, totalYearly }
}

// จัดกลุ่มยอดตามหมวดหมู่ สำหรับกราฟวงกลม
// เรียงจากหมวดที่ยอดรวมมากไปน้อยเสมอ (ไม่เรียงตามลำดับที่ user เพิ่ม subscription เข้ามา)
// เพื่อให้กลีบวงกลมเรียงใหญ่ -> เล็กตามเข็มนาฬิกา อ่านสัดส่วนได้ง่ายขึ้น แทนที่จะสลับมั่วๆ
export function groupByCategory(subscriptions: Subscription[]) {
  const map = new Map<string, number>()

  subscriptions.forEach((sub) => {
    const key = sub.category?.trim() || 'ไม่ระบุหมวดหมู่'
    const current = map.get(key) ?? 0
    map.set(key, current + toMonthlyPrice(sub))
  })

  return Array.from(map.entries())
    .map(([category, value]) => ({
      name: category,
      value: Math.round(value * 100) / 100,
    }))
    .sort((a, b) => b.value - a.value)
}

// ข้อมูลสำหรับกราฟแท่ง เทียบค่าใช้จ่ายรายเดือนของแต่ละ subscription
export function getMonthlyComparisonData(subscriptions: Subscription[]) {
  return subscriptions
    .map((sub) => ({
      name: sub.name,
      monthlyPrice: Math.round(toMonthlyPrice(sub) * 100) / 100,
    }))
    .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
}

// จัดกลุ่มยอดตาม "วันที่ในเดือน" (1-31) ที่ต้องจ่าย เพื่อดูว่ารายจ่ายไปกองวันไหนของเดือนเยอะสุด
// ใช้ราคาจริง (ไม่แปลงเป็นรายเดือน) เพราะอยากรู้ว่าวันนั้นๆ มีเงินออกจากกระเป๋าเท่าไหร่จริงๆ
// parse วันที่จาก string ตรงๆ (แทนที่จะใช้ new Date().getDate()) เพื่อกันปัญหา timezone เพี้ยนวัน
export function groupByDayOfMonth(subscriptions: Subscription[]) {
  const totals = new Array(31).fill(0)

  subscriptions.forEach((sub) => {
    const day = Number(sub.next_billing_date.slice(8, 10))
    if (day >= 1 && day <= 31) {
      totals[day - 1] += sub.price
    }
  })

  return totals.map((total, index) => ({
    day: String(index + 1),
    total: Math.round(total * 100) / 100,
  }))
}

// หารายการที่ใกล้ถึงวันครบกำหนด "หรือเลยกำหนดไปแล้ว" (บั๊กเดิม: มีเงื่อนไข billingDate >= today
// กรองรายการที่เลยกำหนดออกไปหมด ทำให้ของที่ค้างจ่ายไม่ถูกแจ้งเตือนเลย — ตัดเงื่อนไขนี้ทิ้ง
// เอาแค่ "ครบกำหนดภายใน N วันข้างหน้า" นับรวมของที่เลยมาแล้วด้วย ไม่ว่าจะเลยมานานแค่ไหน)
export function getUpcomingRenewals(subscriptions: Subscription[], daysAhead: number) {
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() + daysAhead)

  return subscriptions.filter((sub) => {
    const billingDate = new Date(sub.next_billing_date)
    return billingDate <= cutoff
  })
}

// เรียง subscription ตามวันต่ออายุที่ใกล้ที่สุดก่อน
export function sortByNextBilling(subscriptions: Subscription[]) {
  return [...subscriptions].sort(
    (a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime()
  )
}

// จำนวนวันที่เหลือถึงวันต่ออายุ (ติดลบ = เลยกำหนดมาแล้วกี่วัน)
export function getDaysUntilRenewal(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const billingDate = new Date(dateStr)
  billingDate.setHours(0, 0, 0, 0)

  const diffMs = billingDate.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

// แปลงจำนวนวันเป็นข้อความอ่านง่าย เช่น "อีก 3 วัน", "พรุ่งนี้", "เลยกำหนด 2 วัน"
export function formatDaysUntilRenewal(days: number): string {
  if (days < 0) return `เลยกำหนด ${Math.abs(days)} วัน`
  if (days === 0) return 'ครบกำหนดวันนี้'
  if (days === 1) return 'พรุ่งนี้'
  return `อีก ${days} วัน`
}

// เลื่อนวันที่ครบกำหนดไปรอบถัดไป ใช้ตอนกดปุ่ม/checkbox "จ่ายแล้ว"
// รายเดือน: +1 เดือน, รายปี: +1 ปี — ถ้าวันที่เกินจำนวนวันของเดือนใหม่ (เช่น 31 ม.ค. -> ก.พ.)
// จะปรับเป็นวันสุดท้ายของเดือนนั้นแทนที่จะเลื่อนข้ามไปเดือนถัดไปอีก
export function getNextCycleDate(dateStr: string, billingCycle: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)

  if (billingCycle === 'yearly') {
    return toISODate(y + 1, m, d)
  }

  let newMonth = m + 1
  let newYear = y
  if (newMonth > 12) {
    newMonth = 1
    newYear += 1
  }

  const lastDayOfNewMonth = new Date(newYear, newMonth, 0).getDate()
  const newDay = Math.min(d, lastDayOfNewMonth)

  return toISODate(newYear, newMonth, newDay)
}

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// ===== มิเตอร์ความเจ็บ (budget / pain meter) =====
// ธีมแอป "จ่ายจนเจ็บ": ตั้งงบต่อเดือนไว้ แล้วดูว่าตอนนี้ใช้ไปกี่ % ของงบ
// ยิ่งใช้เยอะ ยิ่ง "เจ็บ" มากขึ้น (happy -> okay -> worried -> pain)
export type PainLevel = 'happy' | 'okay' | 'worried' | 'pain'

// ยังไม่ตั้งงบ (monthlyBudget เป็น null หรือ <= 0) -> คืน null ให้ UI แสดง prompt ให้ตั้งงบแทน
export function getPainLevel(
  totalMonthly: number,
  monthlyBudget: number | null
): { percent: number; level: PainLevel } | null {
  if (!monthlyBudget || monthlyBudget <= 0) return null

  const percent = Math.round((totalMonthly / monthlyBudget) * 100)

  let level: PainLevel = 'happy'
  if (percent >= 100) level = 'pain'
  else if (percent >= 80) level = 'worried'
  else if (percent >= 50) level = 'okay'

  return { percent, level }
}