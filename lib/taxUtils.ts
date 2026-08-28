// เครื่องมือประมาณการภาษีเงินได้บุคคลธรรมดา (ปีภาษี 2568/ยื่นปี 2569)
// ⚠️ นี่คือ "การประมาณการ" จากข้อมูลที่ผู้ใช้กรอกเองเท่านั้น ไม่ใช่การยื่นภาษีจริง
// ยังไม่รวมทางเลือกหักค่าใช้จ่ายตามจริง สิทธิเฉพาะกรณี และการแยกยื่นของคู่สมรส
import {
  Income,
  getIncomeTypeMeta,
  expenseRateOf,
  subLabelOf,
} from './incomeUtils'

const fmtNum = (n: number) => Math.round(n).toLocaleString('en-US')
const bt = (n: number) => (n < 0 ? '−฿' : '฿') + fmtNum(Math.abs(n))

// รายการหนึ่งนับเข้าฐานภาษีปีนี้หรือไม่ — ประจำนับเสมอ (annualize), ครั้งเดียวนับเฉพาะที่ได้รับปีนี้จริง
function annualForTaxYear(income: Income): number {
  if (income.is_recurring) {
    const timesPerYear = income.billing_cycle === 'yearly' ? 1 : income.billing_cycle === 'biannual' ? 2 : income.billing_cycle === 'quarterly' ? 4 : 12
    return income.amount * timesPerYear
  }
  const currentYear = new Date().getFullYear()
  if (income.received_date && Number(income.received_date.slice(0, 4)) === currentYear) {
    return income.amount
  }
  return 0
}

// ===== 1) รวมรายรับรายปีแยกตามประเภทเงินได้ (มาตรา 40) — ใช้โชว์สรุปในหน้ารายรับ =====

export function groupIncomeByTypeAnnual(incomes: Income[]): Record<string, number> {
  const totals: Record<string, number> = {
    '40_1': 0, '40_2': 0, '40_3': 0, '40_4': 0, '40_5': 0, '40_6': 0, '40_7': 0, '40_8': 0,
  }
  incomes.forEach((income) => {
    if (income.income_type === 'gift') return
    totals[income.income_type] += annualForTaxYear(income)
  })
  return totals
}

// รวมยอด "เงินให้" ที่ยกเว้นภาษีทั้งปี — ใช้แค่โชว์เป็นข้อมูลความโปร่งใสบนหน้าภาษี ไม่ได้เอาไปรวมในฐานภาษี
export function calculateExemptGiftTotal(incomes: Income[]): number {
  return incomes.filter((i) => i.income_type === 'gift').reduce((sum, i) => sum + annualForTaxYear(i), 0)
}

// ===== 2) หักค่าใช้จ่ายเหมาตามประเภทเงินได้ (และลักษณะย่อย ถ้ามี) =====
// 40(1)+40(2) ใช้เพดานร่วมกัน (หัก 50% ไม่เกิน ฿100,000 รวมกัน) — ประเภทอื่นแยกเพดานตัวเอง
// ค่าเช่า 40(5) และวิชาชีพอิสระ 40(6) อัตราขึ้นกับ "ลักษณะย่อย" ของแต่ละรายการ จึงต้อง bucket แยกตาม sub ด้วย

export type ExpenseBreakdownItem = {
  label: string
  grossIncome: number
  deductibleExpense: number
  netIncome: number
  note?: string
}

type Bucket = { gross: number; rate: number; cap: number; label: string }

export function calculateExpenseBreakdown(incomes: Income[]): ExpenseBreakdownItem[] {
  const buckets: Record<string, Bucket> = {}

  incomes.forEach((income) => {
    const t = getIncomeTypeMeta(income.income_type)
    if (t.exempt) return
    const annual = annualForTaxYear(income)
    if (annual <= 0) return

    const key = t.capGroup === 'salary' ? 'salary' : income.income_type + (income.income_sub ? ':' + income.income_sub : '')
    if (!buckets[key]) {
      buckets[key] = {
        gross: 0,
        rate: expenseRateOf(income.income_type, income.income_sub),
        cap: t.capGroup === 'salary' ? 100000 : t.cap === undefined ? Infinity : t.cap,
        label:
          t.capGroup === 'salary'
            ? 'เงินเดือน + ฟรีแลนซ์ (40(1)(2))'
            : t.subs
              ? t.shortLabel + ' · ' + subLabelOf(income.income_type, income.income_sub)
              : t.shortLabel,
      }
    }
    buckets[key].gross += annual
  })

  return Object.values(buckets).map((b) => {
    const deductibleExpense = Math.min(b.gross * b.rate, b.cap)
    const netIncome = b.gross - deductibleExpense
    return {
      label: b.label,
      grossIncome: b.gross,
      deductibleExpense,
      netIncome,
      note:
        b.rate === 0
          ? 'ประเภทนี้หักค่าใช้จ่ายแบบเหมาไม่ได้'
          : 'หักเหมา ' + (b.rate * 100).toFixed(0) + '%' + (b.cap === Infinity ? ' ตามจริง' : ' ไม่เกิน ' + bt(b.cap)) + ' = ' + bt(deductibleExpense),
    }
  })
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
  pension_insurance: number
  thai_esg_amount: number
  mortgage_interest: number
  easy_e_receipt: number
  donation_general: number
  donation_education_sports: number
  withholding_tax: number
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
  pension_insurance: 0,
  thai_esg_amount: 0,
  mortgage_interest: 0,
  easy_e_receipt: 0,
  donation_general: 0,
  donation_education_sports: 0,
  withholding_tax: 0,
}

export type DeductionBreakdownItem = {
  label: string
  amount: number
  capped?: boolean
}

// กลุ่มลดหย่อนรวมกัน 5 ก้อน ตรงกับที่การ์ด "สรุปการคำนวณ" (ladder) ฝั่งหน้าภาษีใช้โชว์เป็นขั้นบันไดหักทีละก้อน
export type DeductionGroups = {
  personalFamily: number
  insurance: number
  retirementAndEsg: number
  houseAndAnnual: number
  donation: number
}

export function calculateDeductions(
  d: TaxDeductions,
  netIncomeAfterExpense: number
): { items: DeductionBreakdownItem[]; total: number; groups: DeductionGroups; capNotes: string[] } {
  const items: DeductionBreakdownItem[] = [{ label: 'ค่าลดหย่อนส่วนตัว', amount: 60000 }]
  const capNotes: string[] = []
  // เก็บ note ไว้เมื่อกรอกเกินเพดาน — ใช้โชว์เตือนในการ์ดสรุปการคำนวณฝั่งหน้าภาษี
  const noteIfCapped = (label: string, raw: number, limit: number) => {
    if (raw > limit) capNotes.push(`${label} กรอก ${bt(raw)} นับได้ ${bt(limit)}`)
  }

  const dPersonal = 60000
  const dSpouse = d.has_spouse ? 60000 : 0
  if (d.has_spouse) items.push({ label: 'คู่สมรส (ไม่มีเงินได้)', amount: 60000 })

  const dKids = d.children_count * 30000 + d.children_count_esg * 30000
  if (d.children_count > 0) {
    items.push({ label: `บุตร ${d.children_count} คน`, amount: d.children_count * 30000 })
  }
  if (d.children_count_esg > 0) {
    items.push({
      label: `บุตรคนที่ 2 เป็นต้นไป (เกิดปี 2561+) ${d.children_count_esg} คน`,
      amount: d.children_count_esg * 30000, // ส่วนเพิ่มอีกคนละ 30,000 (รวมกับก้อนแรก = 60,000/คน)
    })
  }

  const parentsCountCapped = Math.min(d.parents_count, 4)
  const dParents = parentsCountCapped * 30000
  if (d.parents_count > 0) {
    noteIfCapped('อุปการะบิดามารดา', d.parents_count * 30000, 4 * 30000)
    items.push({
      label: `อุปการะบิดามารดา ${parentsCountCapped} คน`,
      amount: dParents,
      capped: d.parents_count > 4,
    })
  }

  const dDisabled = d.disabled_dependents_count * 60000
  if (d.disabled_dependents_count > 0) {
    items.push({
      label: `อุปการะผู้พิการ/ทุพพลภาพ ${d.disabled_dependents_count} คน`,
      amount: dDisabled,
    })
  }

  const dSso = Math.min(d.social_security_paid, 9000)
  if (d.social_security_paid > 0) {
    noteIfCapped('ประกันสังคม', d.social_security_paid, 9000)
    items.push({ label: 'ประกันสังคม', amount: dSso, capped: d.social_security_paid > 9000 })
  }

  // ประกันชีวิต + ประกันสุขภาพตนเอง: สุขภาพเดี่ยวๆ ไม่เกิน 25,000 แล้วรวมกับชีวิตไม่เกิน 100,000
  const healthCapped = Math.min(d.health_insurance_premium, 25000)
  const dLifeHealth = Math.min(d.life_insurance_premium + healthCapped, 100000)
  if (dLifeHealth > 0) {
    noteIfCapped('ประกันสุขภาพตนเอง', d.health_insurance_premium, 25000)
    noteIfCapped('ประกันชีวิต + สุขภาพรวมกัน', d.life_insurance_premium + healthCapped, 100000)
    items.push({
      label: 'ประกันชีวิต + ประกันสุขภาพตนเอง',
      amount: dLifeHealth,
      capped: d.life_insurance_premium + healthCapped > 100000 || d.health_insurance_premium > 25000,
    })
  }

  const dParentHealth = Math.min(d.parent_health_insurance_premium, 15000)
  if (d.parent_health_insurance_premium > 0) {
    noteIfCapped('ประกันสุขภาพบิดามารดา', d.parent_health_insurance_premium, 15000)
    items.push({
      label: 'ประกันสุขภาพบิดามารดา',
      amount: dParentHealth,
      capped: d.parent_health_insurance_premium > 15000,
    })
  }

  // กลุ่มเกษียณ (กบข./PVD 15% + RMF 30% + ประกันชีวิตแบบบำนาญ 15%) แต่ละตัวมีเพดานย่อยของตัวเอง
  // แล้วรวมกันทั้งกลุ่มต้องไม่เกิน 500,000 — สิทธิซื้อ SSF สิ้นสุดตั้งแต่ปีภาษี 2568 จึงไม่มีในกลุ่มนี้แล้ว
  const pvdCapped = Math.min(d.pvd_contribution, netIncomeAfterExpense * 0.15, 500000)
  const rmfCapped = Math.min(d.rmf_amount, netIncomeAfterExpense * 0.3, 500000)
  const pensionCapped = Math.min(d.pension_insurance, netIncomeAfterExpense * 0.15, 200000)
  const retirementGroupTotal = pvdCapped + rmfCapped + pensionCapped
  const dRetire = Math.min(retirementGroupTotal, 500000)
  if (dRetire > 0) {
    noteIfCapped('กลุ่มเกษียณรวมกัน (เพดาน ฿500,000)', retirementGroupTotal, 500000)
    items.push({
      label: 'กลุ่มเกษียณ (กบข./PVD + RMF + ประกันบำนาญ รวมกัน)',
      amount: dRetire,
      capped:
        retirementGroupTotal > 500000 ||
        d.pvd_contribution > pvdCapped ||
        d.rmf_amount > rmfCapped ||
        d.pension_insurance > pensionCapped,
    })
  }

  const esgLimit = Math.min(netIncomeAfterExpense * 0.3, 300000)
  const dEsg = Math.min(d.thai_esg_amount, esgLimit)
  if (d.thai_esg_amount > 0) {
    noteIfCapped('Thai ESG / ESGX', d.thai_esg_amount, esgLimit)
    items.push({ label: 'Thai ESG / ESGX', amount: dEsg, capped: d.thai_esg_amount > esgLimit })
  }

  const dMortgage = Math.min(d.mortgage_interest, 100000)
  if (d.mortgage_interest > 0) {
    noteIfCapped('ดอกเบี้ยที่อยู่อาศัย', d.mortgage_interest, 100000)
    items.push({ label: 'ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย', amount: dMortgage, capped: d.mortgage_interest > 100000 })
  }

  const dEReceipt = Math.min(d.easy_e_receipt, 50000)
  if (d.easy_e_receipt > 0) {
    noteIfCapped('Easy E-Receipt', d.easy_e_receipt, 50000)
    items.push({ label: 'Easy E-Receipt 2.0', amount: dEReceipt, capped: d.easy_e_receipt > 50000 })
  }

  // เงินบริจาค: การศึกษา/กีฬา/รพ.รัฐ นับ 2 เท่า แล้วเพดานรวม 10% ของเงินได้หลังหักค่าใช้จ่ายและค่าลดหย่อนอื่นๆ
  const subtotalBeforeDonation = items.reduce((sum, i) => sum + i.amount, 0)
  const baseForDonationCap = Math.max(0, netIncomeAfterExpense - subtotalBeforeDonation)
  const donationCap = baseForDonationCap * 0.1
  const totalDonationRequested = d.donation_general + d.donation_education_sports * 2
  const dDonate = Math.min(totalDonationRequested, donationCap)
  if (dDonate > 0) {
    noteIfCapped('เงินบริจาค (เพดาน 10% ของเงินได้หลังหักลดหย่อนอื่น)', totalDonationRequested, donationCap)
    items.push({ label: 'เงินบริจาค', amount: dDonate, capped: totalDonationRequested > donationCap })
  }

  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const groups: DeductionGroups = {
    personalFamily: dPersonal + dSpouse + dKids + dParents + dDisabled,
    insurance: dSso + dLifeHealth + dParentHealth,
    retirementAndEsg: dRetire + dEsg,
    houseAndAnnual: dMortgage + dEReceipt,
    donation: dDonate,
  }
  return { items, total, groups, capNotes }
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

// ===== 5) ภาษีเงินได้ขั้นต่ำ ตามมาตรา 48(2) =====
// เงินได้ประเภท 40(2)-(8) (ไม่รวมเงินเดือน 40(1)) รวมกันเกิน ฿120,000 ต้องเสียภาษีไม่น้อยกว่า 0.5%
// ของยอดนั้น (ยกเว้นถ้าคำนวณได้ไม่เกิน ฿5,000) — ใช้ยอดที่สูงกว่าระหว่างนี้กับภาษีขั้นบันได
export type MinTax = { minTax: number; applies: boolean; note: string | null }

export function calculateMinimumTax(incomes: Income[], progressiveTax: number): MinTax {
  const nonSalary = incomes
    .filter((i) => i.income_type !== 'gift' && i.income_type !== '40_1')
    .reduce((sum, i) => sum + annualForTaxYear(i), 0)

  if (nonSalary <= 120000) return { minTax: 0, applies: false, note: null }

  const half = nonSalary * 0.005
  if (half <= 5000) {
    return {
      minTax: 0,
      applies: false,
      note: `เงินได้ 40(2)–(8) เกิน ฿120,000 แต่ภาษีขั้นต่ำ 0.5% คิดได้เพียง ${bt(half)} ซึ่งไม่เกิน ฿5,000 จึงได้รับยกเว้น ไม่ต้องใช้กฎนี้`,
    }
  }

  const applies = half > progressiveTax
  return {
    minTax: half,
    applies,
    note: applies
      ? `เงินได้ประเภท 40(2)–(8) รวม ${bt(nonSalary)} เกิน ฿120,000 กฎภาษีขั้นต่ำจึงกำหนดให้เสียไม่น้อยกว่า 0.5% ของยอดนั้น = ${bt(half)} ระบบใช้ยอดนี้แทนภาษีขั้นบันได`
      : `เข้าเกณฑ์ภาษีขั้นต่ำ 0.5% ของเงินได้ 40(2)–(8) = ${bt(half)} แต่ภาษีขั้นบันไดสูงกว่า จึงใช้ยอดขั้นบันได`,
  }
}

// ===== 6) รวมทุกอย่างเป็นผลลัพธ์เดียว =====

export type TaxEstimate = {
  incomeByType: Record<string, number>
  expenseBreakdown: ExpenseBreakdownItem[]
  totalGrossIncome: number
  netIncomeAfterExpense: number
  deductionItems: DeductionBreakdownItem[]
  totalDeductions: number
  netTaxableIncome: number
  brackets: TaxBracketResult[]
  progressiveTax: number
  minTax: MinTax
  totalTax: number
  effectiveRate: number
  exemptGiftTotal: number
  deductionGroups: DeductionGroups
  capNotes: string[]
  ladder: { label: string; note: string; value: number }[]
  settlement: { amount: number; isRefund: boolean }
}

export function calculateTaxEstimate(incomes: Income[], deductions: TaxDeductions): TaxEstimate {
  const incomeByType = groupIncomeByTypeAnnual(incomes)
  const expenseBreakdown = calculateExpenseBreakdown(incomes)
  const totalGrossIncome = expenseBreakdown.reduce((sum, i) => sum + i.grossIncome, 0)
  const netIncomeAfterExpense = expenseBreakdown.reduce((sum, i) => sum + i.netIncome, 0)
  const {
    items: deductionItems,
    total: totalDeductions,
    groups: deductionGroups,
    capNotes,
  } = calculateDeductions(deductions, netIncomeAfterExpense)
  const netTaxableIncome = Math.max(0, Math.round(netIncomeAfterExpense - totalDeductions))
  const { brackets, totalTax: progressiveTax } = calculateProgressiveTax(netTaxableIncome)
  const minTax = calculateMinimumTax(incomes, progressiveTax)
  const totalTax = Math.max(progressiveTax, minTax.minTax)
  const effectiveRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0
  const exemptGiftTotal = calculateExemptGiftTotal(incomes)

  // ขั้นบันไดหักทีละก้อนจากเงินได้พึงประเมิน — โชว์ในการ์ด "สรุปการคำนวณ" ฝั่งหน้าภาษี
  const ladder = [
    { label: 'เงินได้พึงประเมินที่ต้องเสียภาษี', note: 'ไม่รวมเงินได้ยกเว้น', value: totalGrossIncome },
    { label: 'หักค่าใช้จ่ายตามประเภทเงินได้', note: 'แบบเหมา', value: -(totalGrossIncome - netIncomeAfterExpense) },
    { label: 'หักส่วนตัว + ครอบครัว', note: 'ส่วนตัว คู่สมรส บุตร บิดามารดา ผู้พิการ', value: -deductionGroups.personalFamily },
    { label: 'หักประกัน', note: 'ประกันสังคม ชีวิต สุขภาพ', value: -deductionGroups.insurance },
    { label: 'หักกลุ่มเกษียณ + Thai ESG', note: 'เพดานรวม ฿500,000 และ ESG แยก ฿300,000', value: -deductionGroups.retirementAndEsg },
    { label: 'หักบ้าน + มาตรการรายปี', note: 'ดอกเบี้ยบ้าน Easy E-Receipt', value: -deductionGroups.houseAndAnnual },
    { label: 'หักเงินบริจาค', note: 'เพดาน 10% ของเงินได้หลังหักลดหย่อนอื่น', value: -deductionGroups.donation },
  ]

  const settlementAmount = deductions.withholding_tax - totalTax
  const settlement = { amount: settlementAmount, isRefund: settlementAmount >= 0 }

  return {
    incomeByType,
    expenseBreakdown,
    totalGrossIncome,
    netIncomeAfterExpense,
    deductionItems,
    totalDeductions,
    netTaxableIncome,
    brackets,
    progressiveTax,
    minTax,
    totalTax,
    exemptGiftTotal,
    effectiveRate,
    deductionGroups,
    capNotes,
    ladder,
    settlement,
  }
}
