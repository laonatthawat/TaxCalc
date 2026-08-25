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
export function groupByCategory(subscriptions: Subscription[]) {
  const map = new Map<string, number>()

  subscriptions.forEach((sub) => {
    const key = sub.category?.trim() || 'ไม่ระบุหมวดหมู่'
    const current = map.get(key) ?? 0
    map.set(key, current + toMonthlyPrice(sub))
  })

  return Array.from(map.entries()).map(([category, value]) => ({
    name: category,
    value: Math.round(value * 100) / 100,
  }))
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

// หา subscription ที่ใกล้ต่ออายุภายในจำนวนวันที่กำหนด
export function getUpcomingRenewals(subscriptions: Subscription[], daysAhead: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() + daysAhead)

  return subscriptions.filter((sub) => {
    const billingDate = new Date(sub.next_billing_date)
    return billingDate >= today && billingDate <= cutoff
  })
}