// เครื่องมือประมาณการภาษีเงินได้บุคคลธรรมดา (ปีภาษี 2568/ยื่นปี 2569)
// ⚠️ นี่คือ "การประมาณการ" จากข้อมูลที่ผู้ใช้กรอกเองเท่านั้น ไม่ใช่การยื่นภาษีจริง
// อัตราหักค่าใช้จ่ายเหมาของเงินได้ประเภท 40(5)/40(6)/40(8) ในกฎหมายจริงมีรายละเอียดปลีกย่อยมากกว่านี้
// (แยกตามประเภททรัพย์สิน/วิชาชีพ/ธุรกิจ) ในนี้ใช้อัตราที่พบบ่อยที่สุดของแต่ละประเภทเพื่อความง่าย
import { Income, IncomeType } from './incomeUtils'

// ===== 1) รวมรายรับรายปีแยกตามประเภทเงินได้ (มาตรา 40) =====

export function groupIncomeByTypeAnnual(incomes: Income[]): Record<IncomeType, number> {
  const currentYear = new Date().getFullYear()

  const totals: Record<IncomeType, number> = {
    '40_1': 0,
    '40_2': 0,
    '40_3': 0,
    '40_4': 0,
    '40_5': 0,
    '40_6': 0,
    '40_7': 0,
    '40_8': 0,
  }

  incomes.forEach((income) => {
    if (income.is_recurring) {
      const annual = income.billing_cycle === 'yearly' ? income.amount : income.amount * 12
      totals[income.income_type] += annual
    } else if (income.received_date && Number(income.received_date.slice(0, 4)) === currentYear) {
      totals[income.income_type] += income.amount
    }
  })

  return totals
}

// ===== 2) หักค่าใช้จ่ายเหมาตามประเภทเงินได้ =====

export type ExpenseBreakdownItem = {
  label: string
  grossIncome: number
  deductibleExpense: number
  netIncome: number
  note?: string
}

export function calculateExpenseBreakdown(incomeByType: Record<IncomeType, number>): ExpenseBreakdownItem[] {
  const items: ExpenseBreakdownItem[] = []

  // 40(1)+40(2) ใช้เพดานร่วมกัน: หัก 50% ของยอดรวม แต่ไม่เกิน 100,000 บาท
  const salaryTotal = incomeByType['40_1'] + incomeByType['40_2']
  if (salaryTotal > 0) {
    const expense = Math.min(salaryTotal * 0.5, 100000)
    items.push({
      label: 'เงินเดือน/ค่าจ้าง/ค่านายหน้า (40(1)+40(2))',
      grossIncome: salaryTotal,
      deductibleExpense: expense,
      netIncome: salaryTotal - expense,
    })
  }

  if (incomeByType['40_3'] > 0) {
    const expense = Math.min(incomeByType['40_3'] * 0.5, 100000)
    items.push({
      label: 'ค่าลิขสิทธิ์ (40(3))',
      grossIncome: incomeByType['40_3'],
      deductibleExpense: expense,
      netIncome: incomeByType['40_3'] - expense,
    })
  }

  if (incomeByType['40_4'] > 0) {
    items.push({
      label: 'ดอกเบี้ย/เงินปันผล/กำไรขายหลักทรัพย์ (40(4))',
      grossIncome: incomeByType['40_4'],
      deductibleExpense: 0,
      netIncome: incomeByType['40_4'],
      note: 'หักค่าใช้จ่ายไม่ได้ตามกฎหมาย (กำไรขายหุ้นในตลาดหลักทรัพย์ไทยอาจได้รับยกเว้นภาษี — ไม่ได้คำนวณแยกในนี้)',
    })
  }

  if (incomeByType['40_5'] > 0) {
    const expense = incomeByType['40_5'] * 0.3
    items.push({
      label: 'ค่าเช่า (40(5))',
      grossIncome: incomeByType['40_5'],
      deductibleExpense: expense,
      netIncome: incomeByType['40_5'] - expense,
      note: 'ใช้อัตราเหมา 30% (ประมาณการ — อัตราจริงมี 10-30% ตามประเภททรัพย์สิน)',
    })
  }

  if (incomeByType['40_6'] > 0) {
    const expense = incomeByType['40_6'] * 0.3
    items.push({
      label: 'วิชาชีพอิสระ (40(6))',
      grossIncome: incomeByType['40_6'],
      deductibleExpense: expense,
      netIncome: incomeByType['40_6'] - expense,
      note: 'ใช้อัตราเหมา 30% (ประมาณการ — วิชาชีพเวชกรรมหักได้ 60%, อื่นๆ ส่วนใหญ่ 30%)',
    })
  }

  if (incomeByType['40_7'] > 0) {
    const expense = incomeByType['40_7'] * 0.6
    items.push({
      label: 'รับเหมาก่อสร้าง (40(7))',
      grossIncome: incomeByType['40_7'],
      deductibleExpense: expense,
      netIncome: incomeByType['40_7'] - expense,
    })
  }

  if (incomeByType['40_8'] > 0) {
    const expense = incomeByType['40_8'] * 0.6
    items.push({
      label: 'ธุรกิจ/พาณิชย์/ขายของออนไลน์ (40(8))',
      grossIncome: incomeByType['40_8'],
      deductibleExpense: expense,
      netIncome: incomeByType['40_8'] - expense,
      note: 'ใช้อัตราเหมา 60% (ประมาณการ — อัตราจริงมี 40-60% ตามประเภทธุรกิจ)',
    })
  }

  return items
}

// ===== 3) ค่าลดหย่อนภาษี =====

export type TaxDeductions = {
  has_spouse: boolean
  children_count: number
  children_count_esg: number
  parents_count: number
  disabled_dependents_count: number
  social_security_paid: number
  life_insurance_premium: number
  health_insurance_premium: number
  parent_health_insurance_premium: number
  pvd_contribution: number
  rmf_amount: number
  ssf_amount: number
  thai_esg_amount: number
  mortgage_interest: number
  donation_general: number
  donation_education_sports: number
}

export const DEFAULT_TAX_DEDUCTIONS: TaxDeductions = {
  has_spouse: false,
  children_count: 0,
  children_count_esg: 0,
  parents_count: 0,
  disabled_dependents_count: 0,
  social_security_paid: 0,
  life_insurance_premium: 0,
  health_insurance_premium: 0,
  parent_health_insurance_premium: 0,
  pvd_contribution: 0,
  rmf_amount: 0,
  ssf_amount: 0,
  thai_esg_amount: 0,
  mortgage_interest: 0,
  donation_general: 0,
  donation_education_sports: 0,
}

export type DeductionBreakdownItem = {
  label: string
  amount: number
  capped?: boolean
}

export function calculateDeductions(
  d: TaxDeductions,
  netIncomeAfterExpense: number
): { items: DeductionBreakdownItem[]; total: number } {
  const items: DeductionBreakdownItem[] = [{ label: 'ค่าลดหย่อนส่วนตัว', amount: 60000 }]

  if (d.has_spouse) items.push({ label: 'คู่สมรส (ไม่มีเงินได้)', amount: 60000 })

  if (d.children_count > 0) {
    items.push({ label: `บุตร ${d.children_count} คน`, amount: d.children_count * 30000 })
  }
  if (d.children_count_esg > 0) {
    items.push({
      label: `บุตรคนที่ 2 เป็นต้นไป (เกิดปี 2561+) ${d.children_count_esg} คน`,
      amount: d.children_count_esg * 60000,
    })
  }

  if (d.parents_count > 0) {
    const count = Math.min(d.parents_count, 4)
    items.push({
      label: `อุปการะบิดามารดา ${count} คน`,
      amount: count * 30000,
      capped: d.parents_count > 4,
    })
  }

  if (d.disabled_dependents_count > 0) {
    items.push({
      label: `อุปการะผู้พิการ/ทุพพลภาพ ${d.disabled_dependents_count} คน`,
      amount: d.disabled_dependents_count * 60000,
    })
  }

  if (d.social_security_paid > 0) {
    const amount = Math.min(d.social_security_paid, 9000)
    items.push({ label: 'ประกันสังคม', amount, capped: d.social_security_paid > 9000 })
  }

  // ประกันชีวิต + ประกันสุขภาพตนเอง: สุขภาพเดี่ยวๆ ไม่เกิน 25,000 แล้วรวมกับชีวิตไม่เกิน 100,000
  const healthCapped = Math.min(d.health_insurance_premium, 25000)
  const lifeAndHealth = Math.min(d.life_insurance_premium + healthCapped, 100000)
  if (lifeAndHealth > 0) {
    items.push({
      label: 'ประกันชีวิต + ประกันสุขภาพตนเอง',
      amount: lifeAndHealth,
      capped: d.life_insurance_premium + healthCapped > 100000 || d.health_insurance_premium > 25000,
    })
  }

  if (d.parent_health_insurance_premium > 0) {
    const amount = Math.min(d.parent_health_insurance_premium, 15000)
    items.push({
      label: 'ประกันสุขภาพบิดามารดา',
      amount,
      capped: d.parent_health_insurance_premium > 15000,
    })
  }

  // กลุ่มเกษียณ (กบข./PVD + RMF + SSF): แต่ละตัวมีเพดานย่อยของตัวเอง แล้วรวมกันทั้งกลุ่มต้องไม่เกิน 500,000
  const pvdCapped = Math.min(d.pvd_contribution, netIncomeAfterExpense * 0.15, 500000)
  const rmfCapped = Math.min(d.rmf_amount, netIncomeAfterExpense * 0.3, 500000)
  const ssfCapped = Math.min(d.ssf_amount, netIncomeAfterExpense * 0.3, 200000)
  const retirementGroupTotal = pvdCapped + rmfCapped + ssfCapped
  const retirementGroupFinal = Math.min(retirementGroupTotal, 500000)
  if (retirementGroupFinal > 0) {
    items.push({
      label: 'กลุ่มเกษียณ (กบข./PVD + RMF + SSF รวมกัน)',
      amount: retirementGroupFinal,
      capped:
        retirementGroupTotal > 500000 ||
        d.pvd_contribution > pvdCapped ||
        d.rmf_amount > rmfCapped ||
        d.ssf_amount > ssfCapped,
    })
  }

  if (d.thai_esg_amount > 0) {
    const amount = Math.min(d.thai_esg_amount, 300000)
    items.push({ label: 'Thai ESG', amount, capped: d.thai_esg_amount > 300000 })
  }

  if (d.mortgage_interest > 0) {
    const amount = Math.min(d.mortgage_interest, 100000)
    items.push({ label: 'ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย', amount, capped: d.mortgage_interest > 100000 })
  }

  // เงินบริจาค: เพดาน 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อนอื่นๆ ทั้งหมดที่คำนวณมาก่อนหน้านี้
  const subtotalBeforeDonation = items.reduce((sum, i) => sum + i.amount, 0)
  const baseForDonationCap = Math.max(0, netIncomeAfterExpense - subtotalBeforeDonation)
  const donationCap = baseForDonationCap * 0.1
  const totalDonationRequested = d.donation_general + d.donation_education_sports * 2
  const donationFinal = Math.min(totalDonationRequested, donationCap)
  if (donationFinal > 0) {
    items.push({ label: 'เงินบริจาค', amount: donationFinal, capped: totalDonationRequested > donationCap })
  }

  const total = items.reduce((sum, i) => sum + i.amount, 0)
  return { items, total }
}

// ===== 4) อัตราภาษีขั้นบันได =====

export type TaxBracketResult = {
  rangeLabel: string
  rate: number
  taxableInBracket: number
  taxFromBracket: number
}

const TAX_BRACKETS = [
  { upTo: 150000, rate: 0 },
  { upTo: 300000, rate: 0.05 },
  { upTo: 500000, rate: 0.1 },
  { upTo: 750000, rate: 0.15 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: 2000000, rate: 0.25 },
  { upTo: 5000000, rate: 0.3 },
  { upTo: Infinity, rate: 0.35 },
]

export function calculateProgressiveTax(netTaxableIncome: number): {
  brackets: TaxBracketResult[]
  totalTax: number
} {
  const brackets: TaxBracketResult[] = []
  let remaining = netTaxableIncome
  let lowerBound = 0
  let totalTax = 0

  for (const bracket of TAX_BRACKETS) {
    if (remaining <= 0) break
    const bracketSize = bracket.upTo - lowerBound
    const taxableInBracket = Math.min(remaining, bracketSize)

    if (taxableInBracket > 0) {
      const taxFromBracket = taxableInBracket * bracket.rate
      brackets.push({
        rangeLabel:
          bracket.upTo === Infinity
            ? `มากกว่า ${lowerBound.toLocaleString()}`
            : `${lowerBound.toLocaleString()} - ${bracket.upTo.toLocaleString()}`,
        rate: bracket.rate,
        taxableInBracket,
        taxFromBracket,
      })
      totalTax += taxFromBracket
    }

    remaining -= taxableInBracket
    lowerBound = bracket.upTo
  }

  return { brackets, totalTax: Math.round(totalTax) }
}

// ===== 5) รวมทุกอย่างเป็นผลลัพธ์เดียว =====

export type TaxEstimate = {
  incomeByType: Record<IncomeType, number>
  expenseBreakdown: ExpenseBreakdownItem[]
  totalGrossIncome: number
  netIncomeAfterExpense: number
  deductionItems: DeductionBreakdownItem[]
  totalDeductions: number
  netTaxableIncome: number
  brackets: TaxBracketResult[]
  totalTax: number
  effectiveRate: number
}

export function calculateTaxEstimate(incomes: Income[], deductions: TaxDeductions): TaxEstimate {
  const incomeByType = groupIncomeByTypeAnnual(incomes)
  const expenseBreakdown = calculateExpenseBreakdown(incomeByType)
  const totalGrossIncome = expenseBreakdown.reduce((sum, i) => sum + i.grossIncome, 0)
  const netIncomeAfterExpense = expenseBreakdown.reduce((sum, i) => sum + i.netIncome, 0)
  const { items: deductionItems, total: totalDeductions } = calculateDeductions(
    deductions,
    netIncomeAfterExpense
  )
  const netTaxableIncome = Math.max(0, Math.round(netIncomeAfterExpense - totalDeductions))
  const { brackets, totalTax } = calculateProgressiveTax(netTaxableIncome)
  const effectiveRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0

  return {
    incomeByType,
    expenseBreakdown,
    totalGrossIncome,
    netIncomeAfterExpense,
    deductionItems,
    totalDeductions,
    netTaxableIncome,
    brackets,
    totalTax,
    effectiveRate,
  }
}
