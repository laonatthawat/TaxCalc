// เครื่องคำนวณผลตอบแทนทบต้นแบบมีเงินลงทุนเพิ่มทุกเดือน (compound interest + monthly contribution)
// นี่คือ "การประมาณการ" ล้วนๆ ไม่ใช่การพยากรณ์ผลตอบแทนจริง เพราะตลาดจริงมีความผันผวนที่คาดเดาไม่ได้

export type InvestmentPlan = {
  initial_amount: number
  monthly_contribution: number
  annual_return_rate: number // % ต่อปี เช่น 7 หมายถึงคาดหวังผลตอบแทน 7% ต่อปี
  years: number
}

export type ProjectionPoint = {
  year: number // อาจเป็นเลขทศนิยม (เช่น 5.5) เมื่อคำนวณแบบละเอียดรายเดือน
  totalContributed: number // เงินต้น + เงินที่ทยอยลงทุนเพิ่มเอง (ไม่รวมดอกเบี้ย) สะสมถึงจุดนั้น
  totalInterestEarned: number // ผลตอบแทน/ดอกเบี้ยสะสมที่ "งอกเงย" ขึ้นมาเอง (ไม่ใช่เงินที่ใส่เอง)
  totalValue: number // มูลค่าพอร์ตรวมทั้งหมด ณ จุดนั้น
}

function projectAtMonth(plan: InvestmentPlan, months: number): ProjectionPoint {
  const { initial_amount, monthly_contribution, annual_return_rate } = plan
  const monthlyRate = annual_return_rate / 100 / 12
  const growthFactor = Math.pow(1 + monthlyRate, months)

  const futureValueOfPrincipal = initial_amount * growthFactor
  const futureValueOfContributions =
    monthlyRate === 0
      ? monthly_contribution * months
      : monthly_contribution * ((growthFactor - 1) / monthlyRate)

  const totalValue = futureValueOfPrincipal + futureValueOfContributions
  const totalContributed = initial_amount + monthly_contribution * months
  const totalInterestEarned = totalValue - totalContributed

  return {
    year: Math.round((months / 12) * 100) / 100,
    totalContributed: Math.round(totalContributed),
    totalInterestEarned: Math.round(Math.max(0, totalInterestEarned)),
    totalValue: Math.round(totalValue),
  }
}

// จุดข้อมูลรายปี — ใช้กับการ์ดสรุปตัวเลขปีสุดท้าย (ไม่ต้องละเอียดมาก)
export function calculateProjection(plan: InvestmentPlan): ProjectionPoint[] {
  const points: ProjectionPoint[] = []
  for (let year = 0; year <= plan.years; year++) {
    points.push(projectAtMonth(plan, year * 12))
  }
  return points
}

// จุดข้อมูลละเอียดรายเดือน — ใช้วาดกราฟให้เส้นโค้ง exponential เนียนขึ้น และหาจุดตัดได้แม่นยำกว่ารายปี
export function calculateMonthlyProjection(plan: InvestmentPlan): ProjectionPoint[] {
  const totalMonths = plan.years * 12
  const points: ProjectionPoint[] = []
  for (let month = 0; month <= totalMonths; month++) {
    points.push(projectAtMonth(plan, month))
  }
  return points
}

export type CrossoverPoint = {
  year: number
  value: number
}

// หา "จุดตัดที่น่าสนใจ" ทั้งหมด (ไม่ได้สมมติว่ามีแค่จุดเดียว) — คือจุดที่เส้น "ดอกเบี้ยสะสม"
// สลับฝั่งกับเส้น "เงินที่ลงทุนไปเอง" ไม่ว่าจะจากต่ำกว่าไปสูงกว่า หรือสูงกว่ากลับไปต่ำกว่า
// (เผื่อกรณีผลตอบแทนติดลบ/เงื่อนไขพิเศษที่เส้นสลับกันไปมาได้มากกว่า 1 ครั้ง)
// ใช้การประมาณเชิงเส้น (linear interpolation) ระหว่าง 2 จุดข้อมูลที่คร่อมจุดตัด เพื่อหาตำแหน่งที่แม่นยำกว่าแค่ปัดเป็นปีเต็ม
export function findCrossoverPoints(points: ProjectionPoint[]): CrossoverPoint[] {
  const crossovers: CrossoverPoint[] = []

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]

    const prevDiff = prev.totalInterestEarned - prev.totalContributed
    const currDiff = curr.totalInterestEarned - curr.totalContributed

    // ข้ามช่วงที่ปีเริ่มต้น (year=0) เพราะทั้งสองเส้นเท่ากันเป็นทุนเดิมอยู่แล้ว ไม่ใช่ "จุดตัด" จริงๆ
    if (prev.year === 0 && curr.year <= 1 && prevDiff === currDiff) continue

    const signChanged = (prevDiff < 0 && currDiff >= 0) || (prevDiff > 0 && currDiff <= 0)
    if (!signChanged || prevDiff === currDiff) continue

    // สัดส่วนระหว่างจุดสองจุดที่ diff กลายเป็น 0 พอดี
    const ratio = prevDiff / (prevDiff - currDiff)
    const interpolatedYear = prev.year + (curr.year - prev.year) * ratio
    const interpolatedValue =
      prev.totalContributed + (curr.totalContributed - prev.totalContributed) * ratio

    crossovers.push({
      year: Math.round(interpolatedYear * 10) / 10,
      value: Math.round(interpolatedValue),
    })
  }

  return crossovers
}
