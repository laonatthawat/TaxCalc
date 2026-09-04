'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Save, FileSpreadsheet } from 'lucide-react'
import HelpTooltip from './HelpTooltip'
import { saveTaxDeductions } from '@/app/tax/actions'
import { Income, getIncomeTypeMeta, subLabelOf, toAnnualAmount, CYCLE_OPTIONS } from '@/lib/incomeUtils'
import { calculateTaxEstimate, ssoCapOf, DEFAULT_TAX_DEDUCTIONS, TaxDeductions } from '@/lib/taxUtils'

type Props = {
  initialIncomes: Income[]
  initialDeductions: Partial<TaxDeductions> | null
  userEmail: string
}

// ฟอร์มค่าลดหย่อนใช้ string ล้วนเพื่อให้พิมพ์ลบ/แก้เลขได้ลื่นๆ เหมือนฟอร์มอื่นในแอป
type DeductionFormState = {
  [K in keyof TaxDeductions]: TaxDeductions[K] extends boolean ? boolean : string
}

function toFormState(d: Partial<TaxDeductions> | null): DeductionFormState {
  const merged = { ...DEFAULT_TAX_DEDUCTIONS, ...d }
  return {
    has_spouse: merged.has_spouse,
    children_count: String(merged.children_count),
    children_count_esg: String(merged.children_count_esg),
    parents_count: String(merged.parents_count),
    disabled_dependents_count: String(merged.disabled_dependents_count),
    childbirth_expense: String(merged.childbirth_expense),
    social_security_paid: String(merged.social_security_paid),
    life_insurance_premium: String(merged.life_insurance_premium),
    health_insurance_premium: String(merged.health_insurance_premium),
    parent_health_insurance_premium: String(merged.parent_health_insurance_premium),
    pvd_contribution: String(merged.pvd_contribution),
    rmf_amount: String(merged.rmf_amount),
    pension_insurance: String(merged.pension_insurance),
    thai_esg_amount: String(merged.thai_esg_amount),
    mortgage_interest: String(merged.mortgage_interest),
    easy_e_receipt: String(merged.easy_e_receipt),
    donation_general: String(merged.donation_general),
    donation_education_sports: String(merged.donation_education_sports),
    withholding_tax: String(merged.withholding_tax),
  }
}

function toNumbers(form: DeductionFormState): TaxDeductions {
  return {
    has_spouse: form.has_spouse,
    children_count: Number(form.children_count) || 0,
    children_count_esg: Number(form.children_count_esg) || 0,
    parents_count: Number(form.parents_count) || 0,
    disabled_dependents_count: Number(form.disabled_dependents_count) || 0,
    childbirth_expense: Number(form.childbirth_expense) || 0,
    social_security_paid: Number(form.social_security_paid) || 0,
    life_insurance_premium: Number(form.life_insurance_premium) || 0,
    health_insurance_premium: Number(form.health_insurance_premium) || 0,
    parent_health_insurance_premium: Number(form.parent_health_insurance_premium) || 0,
    pvd_contribution: Number(form.pvd_contribution) || 0,
    rmf_amount: Number(form.rmf_amount) || 0,
    pension_insurance: Number(form.pension_insurance) || 0,
    thai_esg_amount: Number(form.thai_esg_amount) || 0,
    mortgage_interest: Number(form.mortgage_interest) || 0,
    easy_e_receipt: Number(form.easy_e_receipt) || 0,
    donation_general: Number(form.donation_general) || 0,
    donation_education_sports: Number(form.donation_education_sports) || 0,
    withholding_tax: Number(form.withholding_tax) || 0,
  }
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
const bt = (n: number) => (n < 0 ? '−฿' : '฿') + fmt(Math.abs(n))

// ข้อความบอกเพดานใต้ช่องกรอก — ให้เห็นทันทีว่ารายการนั้นลดหย่อนได้สูงสุดเท่าไร
function CapHint({ text }: { text: string }) {
  return (
    <span style={{ font: '400 11px/1.45 "IBM Plex Sans Thai",sans-serif', color: '#9c8f7c', paddingLeft: 16 }}>
      {text}
    </span>
  )
}

// input ตัวเลขแบบสั้นๆ ใช้ซ้ำหลายจุดในฟอร์ม
function NumberField({
  label,
  value,
  hint,
  onChange,
}: {
  label: string
  value: string
  hint?: string
  onChange: (v: string) => void
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 7, justifyContent: 'space-between' }}>
      <span style={{ minHeight: 18, font: '500 12px/1.45 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px 16px',
          borderRadius: 999,
          border: '1px solid #cfc2a8',
          background: '#f5ead8',
          font: '500 14px/1 "IBM Plex Sans Thai",sans-serif',
          outline: 'none',
        }}
      />
      {hint && <CapHint text={hint} />}
    </label>
  )
}

// ฟิลด์นับจำนวนคน (บุตร/บิดามารดา/ผู้พิการ) — พิมพ์เองได้ หรือกด −/+ ก็ได้ เพดานบังคับตรงนี้เลย ไม่ใช่แค่โชว์
function StepperField({
  label,
  value,
  max,
  hint,
  onChange,
}: {
  label: string
  value: string
  max: number
  hint?: string
  onChange: (v: string) => void
}) {
  const n = Math.max(0, Math.floor(Number(value) || 0))
  const atMin = n <= 0
  const atMax = n >= max
  const step = (delta: number) => onChange(String(Math.min(max, Math.max(0, n + delta))))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, justifyContent: 'space-between' }}>
      <span style={{ minHeight: 18, font: '500 12px/1.45 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>
        {label}
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 6px 5px 16px',
          borderRadius: 999,
          border: '1px solid #cfc2a8',
          background: '#f5ead8',
        }}
      >
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, padding: 0, border: 'none', background: 'transparent', font: '500 14px/1 "IBM Plex Sans Thai",sans-serif', outline: 'none' }}
        />
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atMin}
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 999,
            border: '1px solid #cfc2a8',
            background: atMin ? 'transparent' : '#fdf7ec',
            color: atMin ? '#c0b6a5' : '#474238',
            cursor: atMin ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '600 18px/1 "IBM Plex Sans Thai",sans-serif',
          }}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atMax}
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 999,
            border: 'none',
            background: atMax ? '#dcd3c4' : '#c67139',
            color: atMax ? '#82796a' : '#f5ead8',
            cursor: atMax ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '600 18px/1 "IBM Plex Sans Thai",sans-serif',
          }}
        >
          +
        </button>
      </div>
      {hint && <CapHint text={hint} />}
    </div>
  )
}

// grid ฟิลด์ค่าลดหย่อน — กว้างพอให้ label ภาษาไทยที่ยาวที่สุดไม่ตัดบรรทัด
const fieldGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,330px), 1fr))',
  gap: 14,
}

// หัวข้อหมวด — ตั้งชื่อให้ตรงกับกลุ่มในการ์ด "สรุปการคำนวณ" ฝั่งขวา จะได้ไล่ตามกันได้
function SectionHeader({ title }: { title: string }) {
  return (
    <span style={{ font: '600 12px/1 "IBM Plex Sans Thai",sans-serif', letterSpacing: '.08em', color: '#9c5527' }}>
      {title}
    </span>
  )
}

// ป้ายบอกว่ากลุ่มถัดไปคิดเพดานยังไง — ใช้คั่นระหว่าง "เพดานใครเพดานมัน" กับ "เพดานร่วมกัน"
function CapNote({ text }: { text: string }) {
  return (
    <span style={{ font: '400 12px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>{text}</span>
  )
}

// เส้นคั่นหมวดค่าลดหย่อน — ขีดยาวเต็มความกว้างการ์ด ให้เห็นขอบเขตแต่ละหมวดชัด
function SectionDivider() {
  return <div style={{ height: 1, background: '#e4d8c1' }} />
}

function escCsv(v: string | number): string {
  if (typeof v === 'number' && isFinite(v)) return String(v)
  return '"' + String(v).replace(/"/g, '""') + '"'
}

// ตัวเลือกปีภาษีย้อนหลัง — ใช้กรองว่ารายรับก้อนเดียว (ไม่ประจำ) รายการไหนนับเข้าปีที่กำลังดู
const currentTaxYear = new Date().getFullYear()
const TAX_YEAR_OPTIONS = [0, 1, 2, 3, 4].map((back) => currentTaxYear - back)

export default function TaxClient({ initialIncomes, initialDeductions, userEmail }: Props) {
  const [form, setForm] = useState<DeductionFormState>(toFormState(initialDeductions))
  const [taxYear, setTaxYear] = useState(currentTaxYear)
  const [isSaving, setIsSaving] = useState(false)
  const [savedAt, setSavedAt] = useState('')
  const [saveError, setSaveError] = useState('')
  const savedAtTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const router = useRouter()

  const updateField = (key: keyof DeductionFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value as never }))
  }

  const deductions = useMemo(() => toNumbers(form), [form])
  const estimate = useMemo(
    () => calculateTaxEstimate(initialIncomes, deductions, taxYear),
    [initialIncomes, deductions, taxYear]
  )

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError('')
    try {
      await saveTaxDeductions(deductions)
      setSavedAt(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }))
      router.refresh()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setIsSaving(false)
    }
    clearTimeout(savedAtTimer.current)
    savedAtTimer.current = setTimeout(() => setSavedAt(''), 4000)
  }

  // ส่งออก .csv (BOM นำหน้าให้ Excel เปิดภาษาไทยถูก, ตัวเลขไม่ใส่ ฿/คอมมา/quote จะได้ sum ต่อได้จริง)
  const handleExport = () => {
    const topBracket = estimate.brackets[estimate.brackets.length - 1]
    const csvRows: (string | number)[][] = [
      ['สรุปภาษีเงินได้บุคคลธรรมดา'],
      ['อีเมล', userEmail],
      ['ปีภาษี', taxYear + 543],
      ['วันที่ออกรายงาน', new Date().toLocaleDateString('th-TH')],
      [],
      ['รายรับ'],
      ['ชื่อรายรับ', 'ประเภทเงินได้', 'จำนวนต่อรอบ', 'รอบการรับเงิน', 'ประจำ/ครั้งเดียว', 'รวมทั้งปี'],
    ]
    initialIncomes.forEach((income) => {
      const typeMeta = getIncomeTypeMeta(income.income_type)
      const sub = typeMeta.subs ? subLabelOf(income.income_type, income.income_sub) : null
      const cycleLabel = income.is_recurring
        ? CYCLE_OPTIONS.find((c) => c.value === income.billing_cycle)?.label ?? 'รายเดือน'
        : 'ครั้งเดียว'
      csvRows.push([
        income.name,
        typeMeta.shortLabel + (sub ? ` · ${sub}` : ''),
        Math.round(income.amount),
        cycleLabel,
        income.is_recurring ? 'ประจำ' : 'ครั้งเดียว',
        Math.round(toAnnualAmount(income)),
      ])
    })
    csvRows.push([])
    csvRows.push(['ขั้นตอนการคำนวณ'])
    csvRows.push(['รายการ', 'หมายเหตุ', 'จำนวน (บาท)'])
    estimate.ladder.forEach((r) => csvRows.push([r.label, r.note, Math.round(r.value)]))
    csvRows.push([])
    csvRows.push(['ผลลัพธ์'])
    csvRows.push(['เงินได้สุทธิ', Math.round(estimate.netTaxableIncome)])
    csvRows.push(['ภาษีที่ต้องเสีย', Math.round(estimate.totalTax)])
    csvRows.push(['อัตราภาษีจริง (ตัวเลข %)', Number(estimate.effectiveRate.toFixed(2))])
    csvRows.push(['ขั้นภาษีสูงสุดที่แตะ (ตัวเลข %)', topBracket ? Number((topBracket.rate * 100).toFixed(0)) : 0])
    csvRows.push(['ภาษีหัก ณ ที่จ่ายทั้งปี', Math.round(deductions.withholding_tax)])
    csvRows.push([
      estimate.settlement.isRefund ? 'ขอคืนภาษีได้' : 'ต้องจ่ายเพิ่มตอนยื่น',
      Math.round(Math.abs(estimate.settlement.amount)),
    ])

    const csv = csvRows.map((row) => row.map(escCsv).join(',')).join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ภาษี-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const takeHome = estimate.totalGrossIncome - estimate.totalTax
  const taxMonthNote = estimate.totalTax > 0 ? `เท่ากับกันไว้เดือนละ ${bt(estimate.totalTax / 12)}` : 'เงินได้สุทธิยังไม่ถึงเกณฑ์เสียภาษี'
  const bracketNote =
    estimate.netTaxableIncome > 150000
      ? `เสียภาษีจริงเฉลี่ย ${estimate.effectiveRate.toFixed(1)}% ของเงินได้พึงประเมิน เพราะเงินได้สุทธิก้อนแรก ฿150,000 ได้รับยกเว้น`
      : 'เงินได้สุทธิยังไม่เกิน ฿150,000 ซึ่งเป็นช่วงที่ได้รับยกเว้นภาษี จึงยังไม่มีภาษีตามขั้นบันได'

  return (
    <div className="dashboard-page">
      <div style={{ padding: '24px clamp(16px,4vw,44px) 0' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 22, color: '#201e1d' }}>
                {estimate.totalTax > 0 ? (
                  <>
                    {taxYear === currentTaxYear ? 'ปีนี้' : `ปีภาษี ${taxYear + 543}`} ต้องเสียประมาณ{' '}
                    <span style={{ fontFamily: 'var(--font-number)' }}>{bt(estimate.totalTax)}</span>
                  </>
                ) : (
                  `${taxYear === currentTaxYear ? 'ปีนี้' : `ปีภาษี ${taxYear + 543}`}ยังไม่ต้องเสียภาษี`
                )}
              </h1>
              <HelpTooltip title="วิธีใช้หน้าภาษี">
                <p style={{ margin: '0 0 8px' }}>
                  ระบบดึงรายรับทั้งหมดจากหน้า &quot;รายรับ&quot; มาคำนวณให้อัตโนมัติ (ยกเว้นประเภท
                  &quot;เงินให้&quot; ที่ได้รับยกเว้นภาษี)
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  ขั้นที่ 1: หักค่าใช้จ่ายเหมาตามประเภทเงินได้ → ขั้นที่ 2: หักค่าลดหย่อนที่คุณกรอกด้านล่าง
                  (มีเพดานตามกฎหมาย ระบบจะขึ้นป้าย &quot;ถึงเพดานแล้ว&quot; ให้เห็น) → ขั้นที่ 3: คำนวณภาษีแบบ
                  ขั้นบันไดจากเงินได้สุทธิที่เหลือ พร้อมตรวจสอบภาษีขั้นต่ำตามมาตรา 48(2) → ขั้นที่ 4: หัก
                  ภาษีที่ถูกหักไปแล้ว (WHT) เพื่อดูว่าต้องขอคืนหรือจ่ายเพิ่มตอนยื่นจริง
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  ตัวเลือก &quot;ปีภาษี&quot; มุมขวาบนมีผลกับรายรับ<strong>ก้อนเดียว</strong> (เช่น โบนัส
                  งานฟรีแลนซ์ครั้งเดียว) ว่านับเข้าปีไหน และมีผลกับ<strong>เพดานประกันสังคม</strong>ที่ต่างกันในแต่ละปี
                  (ปีภาษี 2568 ลงไป ฿9,000 · ตั้งแต่ปีภาษี 2569 ขึ้นเป็น ฿10,500 ตามเพดานค่าจ้างใหม่) —
                  ส่วนรายรับ<strong>ประจำ</strong>ยังคำนวณเป็นยอดทั้งปีเสมอ และอัตราภาษีขั้นบันไดกับเพดานลดหย่อน
                  รายการอื่นใช้เกณฑ์เดียวกันทุกปีที่เลือก
                </p>
                <p style={{ margin: 0 }}>
                  ตัวเลขทั้งหมดเป็นการประมาณการเบื้องต้นเท่านั้น ไม่ใช่การคำนวณภาษีที่ยื่นจริงกับกรม
                  สรรพากร ควรตรวจสอบกับผู้เชี่ยวชาญ/โปรแกรมยื่นภาษีอย่างเป็นทางการอีกครั้ง
                </p>
              </HelpTooltip>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#645c50' }}>ปีภาษี</span>
            <select
              value={taxYear}
              onChange={(e) => setTaxYear(Number(e.target.value))}
              style={{
                padding: '9px 14px',
                borderRadius: 999,
                border: '1px solid #c0b6a5',
                background: '#fdf7ec',
                font: '600 13px/1 var(--font-number)',
                color: '#474238',
                cursor: 'pointer',
              }}
            >
              {TAX_YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y + 543}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            background: '#f7ddd0',
            borderRadius: 20,
            padding: '18px 22px',
            marginBottom: 20,
            color: '#6d3714',
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
          <span>
            ตัวเลขนี้เป็น<strong>การประมาณการ</strong> ไม่ใช่การยื่นภาษีจริง ระบบใช้การหักค่าใช้จ่ายแบบเหมาและ
            เพดานลดหย่อนตามเกณฑ์ล่าสุด (ประกันสังคมปรับตามปีภาษีที่เลือก) ยังไม่รวมทางเลือกหักค่าใช้จ่ายตามจริง
            สิทธิเฉพาะกรณี และการแยกยื่นของคู่สมรส ก่อนยื่นจริงควรตรวจกับกรมสรรพากรหรือผู้เชี่ยวชาญ
          </span>
        </div>

        <div className="tax-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 392px', gap: 22, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* ขั้นที่ 1: หักค่าใช้จ่าย */}
            <div style={{ background: '#fdf7ec', border: '1px solid #e4d8c1', borderRadius: 24, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
                <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                  ขั้นที่ <span style={{ fontFamily: 'var(--font-number)' }}>1</span> · หักค่าใช้จ่ายตามประเภทเงินได้
                </h3>
                <Link href="/income" style={{ fontSize: 13, fontWeight: 500, color: '#8c491a', textDecoration: 'underline' }}>
                  แก้ที่หน้ารายรับ
                </Link>
              </div>

              {estimate.expenseBreakdown.length === 0 ? (
                <p style={{ fontSize: 13, color: '#82796a', margin: 0 }}>
                  ยังไม่มีข้อมูลรายรับ — ไปเพิ่มรายรับก่อนเพื่อให้คำนวณภาษีได้
                </p>
              ) : (
                <>
                  {estimate.expenseBreakdown.map((item) => (
                    <div
                      key={item.label}
                      style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', paddingBottom: 14, borderBottom: '1px solid #ece0cb', marginBottom: 14 }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                        <span style={{ font: '500 14px/1.4 "IBM Plex Sans Thai",sans-serif' }}>{item.label}</span>
                        <span style={{ font: '400 12px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>{item.note}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span style={{ font: '600 14px/1 var(--font-number)' }}>{bt(item.grossIncome)}</span>
                        <span style={{ font: '400 12px/1 "IBM Plex Sans Thai",sans-serif', color: '#5f6e46' }}>เหลือ {bt(item.netIncome)}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
                    <span style={{ font: '600 14px/1 "IBM Plex Sans Thai",sans-serif' }}>เงินได้หลังหักค่าใช้จ่าย</span>
                    <span style={{ font: '600 18px/1 var(--font-number)' }}>{bt(estimate.netIncomeAfterExpense)}</span>
                  </div>
                </>
              )}

              {estimate.exemptGiftTotal > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #ece0cb', fontSize: 12, color: '#82796a' }}>
                  เงินให้ (ยกเว้นภาษี) {bt(estimate.exemptGiftTotal)} — ไม่นำมาคำนวณในหน้านี้
                </div>
              )}
            </div>

            {/* ขั้นที่ 2: ค่าลดหย่อน */}
            <div style={{ background: '#fdf7ec', border: '1px solid #e4d8c1', borderRadius: 24, padding: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                ขั้นที่ <span style={{ fontFamily: 'var(--font-number)' }}>2</span> · ค่าลดหย่อน
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionHeader title="ส่วนตัว + ครอบครัว" />
                <CapNote text="แต่ละรายการมีเพดานของตัวเอง ไม่ได้แชร์โควตากัน" />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', padding: '12px 18px', borderRadius: 16, background: '#f4ead9' }}>
                  <span style={{ font: '400 14px/1.4 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>ลดหย่อนส่วนตัว — ได้อัตโนมัติทุกคน</span>
                  <span style={{ font: '600 14px/1 var(--font-number)' }}>฿60,000</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.has_spouse}
                    onChange={(e) => updateField('has_spouse', e.target.checked)}
                    style={{ width: 19, height: 19, accentColor: '#c67139', cursor: 'pointer' }}
                  />
                  <span style={{ font: '400 14px/1.4 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>มีคู่สมรสที่ไม่มีเงินได้ (+฿60,000)</span>
                </label>
                <div style={fieldGridStyle}>
                  <StepperField label="บุตร (ทั่วไป)" value={form.children_count} max={20} hint="สูงสุดคนละ ฿30,000 · ไม่จำกัดจำนวนคน" onChange={(v) => updateField('children_count', v)} />
                  <StepperField label="บุตรคนที่ 2+ เกิดปี 2561 ขึ้นไป" value={form.children_count_esg} max={20} hint="สูงสุดคนละ ฿60,000 (รวมก้อนแรกแล้ว)" onChange={(v) => updateField('children_count_esg', v)} />
                  <StepperField label="อุปการะบิดามารดา" value={form.parents_count} max={4} hint="สูงสุดคนละ ฿30,000 · ไม่เกิน 4 คน (รวม ฿120,000) · อายุ 60 ปีขึ้นไป" onChange={(v) => updateField('parents_count', v)} />
                  <StepperField label="อุปการะผู้พิการ / ทุพพลภาพ" value={form.disabled_dependents_count} max={20} hint="สูงสุดคนละ ฿60,000" onChange={(v) => updateField('disabled_dependents_count', v)} />
                  <NumberField label="ค่าฝากครรภ์และคลอดบุตร" value={form.childbirth_expense} hint="สูงสุด ฿60,000 ต่อการตั้งครรภ์หนึ่งครั้ง" onChange={(v) => updateField('childbirth_expense', v)} />
                </div>
              </div>

              <SectionDivider />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionHeader title="ประกัน" />
                <CapNote text="ประกันชีวิตกับสุขภาพตนเองใช้เพดานร่วมกัน ฿100,000 · ที่เหลือเพดานใครเพดานมัน" />
                <div style={fieldGridStyle}>
                  <NumberField label="ประกันสังคมที่จ่ายจริงทั้งปี" value={form.social_security_paid} hint={`สูงสุด ${bt(ssoCapOf(taxYear))} (ลูกจ้าง ม.33 · เพดานปีภาษี ${taxYear + 543})`} onChange={(v) => updateField('social_security_paid', v)} />
                  <NumberField label="เบี้ยประกันชีวิตทั้งปี" value={form.life_insurance_premium} hint="รวมกับประกันสุขภาพตนเอง สูงสุด ฿100,000" onChange={(v) => updateField('life_insurance_premium', v)} />
                  <NumberField label="เบี้ยประกันสุขภาพตนเอง" value={form.health_insurance_premium} hint="สูงสุด ฿25,000 · อยู่ในเพดานรวม ฿100,000" onChange={(v) => updateField('health_insurance_premium', v)} />
                  <NumberField label="เบี้ยประกันสุขภาพบิดามารดา" value={form.parent_health_insurance_premium} hint="สูงสุด ฿15,000 · แยกเพดานต่างหาก" onChange={(v) => updateField('parent_health_insurance_premium', v)} />
                </div>
              </div>

              <SectionDivider />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionHeader title="กลุ่มเกษียณ + Thai ESG" />
                <CapNote text="กบข./PVD + RMF + ประกันบำนาญ ใช้เพดานร่วมกัน ฿500,000 · ส่วน Thai ESG แยกเพดานของตัวเอง" />
                <div style={fieldGridStyle}>
                  <NumberField label="กองทุนสำรองเลี้ยงชีพ / กบข." value={form.pvd_contribution} hint="15% ของเงินได้ · กลุ่มเกษียณรวมกันสูงสุด ฿500,000" onChange={(v) => updateField('pvd_contribution', v)} />
                  <NumberField label="กองทุน RMF" value={form.rmf_amount} hint="30% ของเงินได้ · กลุ่มเกษียณรวมกันสูงสุด ฿500,000" onChange={(v) => updateField('rmf_amount', v)} />
                  <NumberField label="ประกันชีวิตแบบบำนาญ" value={form.pension_insurance} hint="15% ของเงินได้ · สูงสุด ฿200,000 (อยู่ในเพดานรวม ฿500,000)" onChange={(v) => updateField('pension_insurance', v)} />
                  <NumberField label="กองทุน Thai ESG / Thai ESGX" value={form.thai_esg_amount} hint="30% ของเงินได้ · สูงสุด ฿300,000 · ไม่กินโควตากลุ่มเกษียณ" onChange={(v) => updateField('thai_esg_amount', v)} />
                </div>
                <CapNote text="สิทธิซื้อ SSF สิ้นสุดตั้งแต่ปีภาษี 2568 จึงไม่มีในกลุ่มนี้แล้ว" />
              </div>

              <SectionDivider />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionHeader title="บ้าน + มาตรการรายปี" />
                <CapNote text="แต่ละรายการมีเพดานของตัวเอง ไม่ได้แชร์โควตากัน" />
                <div style={fieldGridStyle}>
                  <NumberField label="ดอกเบี้ยกู้ซื้อที่อยู่อาศัย" value={form.mortgage_interest} hint="สูงสุด ฿100,000" onChange={(v) => updateField('mortgage_interest', v)} />
                  <NumberField label="Easy E-Receipt 2.0" value={form.easy_e_receipt} hint="สูงสุด ฿50,000" onChange={(v) => updateField('easy_e_receipt', v)} />
                </div>
              </div>

              <SectionDivider />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionHeader title="เงินบริจาค" />
                <CapNote text="ทุกก้อนรวมกันไม่เกิน 10% ของเงินได้หลังหักลดหย่อนอื่น · คิดเป็นลำดับสุดท้าย" />
                <div style={fieldGridStyle}>
                  <NumberField label="เงินบริจาคทั่วไป" value={form.donation_general} hint="นับตามที่จ่ายจริง · อยู่ในเพดาน 10% ร่วมกัน" onChange={(v) => updateField('donation_general', v)} />
                  <NumberField label="บริจาคการศึกษา / กีฬา / รพ.รัฐ" value={form.donation_education_sports} hint="นับ 2 เท่าของที่จ่าย · อยู่ในเพดาน 10% เดียวกัน" onChange={(v) => updateField('donation_education_sports', v)} />
                </div>
              </div>
            </div>

            {/* ขั้นที่ 3: ขั้นบันได */}
            <div style={{ background: '#fdf7ec', border: '1px solid #e4d8c1', borderRadius: 24, padding: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                  ขั้นที่ <span style={{ fontFamily: 'var(--font-number)' }}>3</span> · เงินได้สุทธิ{' '}
                  <span style={{ fontFamily: 'var(--font-number)' }}>{bt(estimate.netTaxableIncome)}</span> เข้าขั้นบันได
                </h3>
                <p style={{ margin: 0, font: '400 13px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>{bracketNote}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {estimate.brackets.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#82796a', margin: 0 }}>
                    เงินได้สุทธิอยู่ในเกณฑ์ได้รับยกเว้นภาษี (ไม่เกิน 150,000 บาท)
                  </p>
                ) : (
                  estimate.brackets.map((b) => (
                    <div key={b.rangeLabel} style={{ background: '#f7efe1', borderRadius: 16, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ font: '600 11px/1 var(--font-number)', padding: '5px 9px', borderRadius: 999, background: '#c67139', color: '#f5ead8' }}>
                        {(b.rate * 100).toFixed(0)}%
                      </span>
                      <span style={{ flex: 1, font: '500 12px/1 var(--font-number)', color: '#474238' }}>{b.rangeLabel}</span>
                      <span style={{ minWidth: 82, textAlign: 'right', font: '600 13px/1 var(--font-number)' }}>{bt(b.taxFromBracket)}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
                <span style={{ font: '600 14px/1 "IBM Plex Sans Thai",sans-serif' }}>ภาษีตามขั้นบันได</span>
                <span style={{ font: '600 18px/1 var(--font-number)' }}>{bt(estimate.progressiveTax)}</span>
              </div>

              {estimate.minTax.note && (
                <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', background: '#f4ead9', borderRadius: 16, padding: '14px 18px' }}>
                  <span style={{ font: '400 13px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#5c4b39' }}>{estimate.minTax.note}</span>
                </div>
              )}
            </div>

            {/* ขั้นที่ 4: หักภาษีที่ถูกหักไปแล้ว (WHT) */}
            <div style={{ background: '#fdf7ec', border: '1px solid #e4d8c1', borderRadius: 24, padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                ขั้นที่ <span style={{ fontFamily: 'var(--font-number)' }}>4</span> · หักภาษีที่ถูกหักไปแล้ว
              </h3>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ font: '500 12px/1.45 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>
                  ภาษีหัก ณ ที่จ่ายทั้งปี — ดูจากหนังสือรับรอง 50 ทวิ
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.withholding_tax}
                  onChange={(e) => updateField('withholding_tax', e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 16px',
                    borderRadius: 999,
                    border: '1px solid #cfc2a8',
                    background: '#f5ead8',
                    font: '500 14px/1 "IBM Plex Sans Thai",sans-serif',
                    outline: 'none',
                  }}
                />
                <CapHint text="ผลลัพธ์ว่าได้คืนหรือต้องจ่ายเพิ่ม ดูที่การ์ดสรุปด้านขวา" />
              </label>
            </div>
          </div>

          {/* สรุปการคำนวณ — sticky sidebar */}
          <div
            className="tax-sidebar"
            style={{
              position: 'sticky',
              top: 86,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              background: '#fdf7ec',
              border: '1px solid #e4d8c1',
              borderRadius: 24,
              padding: 26,
              boxShadow: '0 12px 30px rgba(46,43,37,.07)',
            }}
          >
            <span style={{ font: '600 12px/1 var(--font-number)', letterSpacing: '.12em', textTransform: 'uppercase', color: '#82796a' }}>
              สรุปการคำนวณ
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {estimate.ladder.map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ font: '400 13px/1.45 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>{r.label}</span>
                    <span style={{ font: '400 11px/1.45 "IBM Plex Sans Thai",sans-serif', color: '#a2907a' }}>{r.note}</span>
                  </div>
                  <span style={{ font: '500 13px/1 var(--font-number)', whiteSpace: 'nowrap' }}>
                    {bt(r.value)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#ece0cb' }} />

            {/* ช่วงที่ 1 · ภาษีทั้งปี — ฐานคำนวณสองบรรทัด แล้วจบที่ยอดภาษี (เลขใหญ่ตัวเดียวของการ์ด) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>รายได้รวมทั้งปี</span>
              <span style={{ font: '600 15px/1 var(--font-number)' }}>{bt(estimate.totalGrossIncome)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>เงินได้สุทธิที่ใช้คิดภาษี</span>
              <span style={{ font: '600 15px/1 var(--font-number)' }}>{bt(estimate.netTaxableIncome)}</span>
            </div>

            <div style={{ background: '#f2e0cb', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#6d3714' }}>
                ภาษีทั้งปี · อัตราจริง {estimate.effectiveRate.toFixed(1)}%
              </span>
              <span style={{ font: '600 36px/1 var(--font-number)', color: '#8c491a' }}>{bt(estimate.totalTax)}</span>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6d3714' }}>{taxMonthNote}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>เหลือหลังภาษีทั้งปี</span>
              <span style={{ font: '600 15px/1 var(--font-number)' }}>{bt(takeHome)}</span>
            </div>

            <div style={{ height: 1, background: '#ece0cb' }} />

            {/* ช่วงที่ 2 · ตอนยื่นจริง — เทียบภาษีทั้งปีกับที่ถูกหักไปแล้ว เหลือเป็นยอดคืน/จ่ายเพิ่ม */}
            <span style={{ font: '600 11px/1 "IBM Plex Sans Thai",sans-serif', letterSpacing: '.1em', color: '#9c8f7c' }}>
              ตอนยื่นจริง
            </span>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>หัก ณ ที่จ่ายไปแล้ว</span>
              <span style={{ font: '600 15px/1 var(--font-number)' }}>{bt(deductions.withholding_tax)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                padding: '14px 18px',
                borderRadius: 18,
                background: estimate.settlement.isRefund ? '#e6ecd6' : '#f7ddd0',
              }}
            >
              <span style={{ font: '600 13px/1.4 "IBM Plex Sans Thai",sans-serif', color: estimate.settlement.isRefund ? '#3f5230' : '#8c491a' }}>
                {estimate.settlement.isRefund ? 'ขอคืนภาษีได้' : 'ต้องจ่ายเพิ่ม'}
              </span>
              <span style={{ font: '600 20px/1 var(--font-number)', color: estimate.settlement.isRefund ? '#3f5230' : '#8c491a' }}>
                {estimate.settlement.isRefund ? '+' : '−'}
                {bt(Math.abs(estimate.settlement.amount))}
              </span>
            </div>

            {estimate.capNotes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, padding: 16, borderRadius: 18, background: '#f4ead9' }}>
                <span style={{ font: '600 12px/1 "IBM Plex Sans Thai",sans-serif', color: '#9c5527' }}>ที่กรอกเกินเพดาน</span>
                {estimate.capNotes.map((c) => (
                  <span key={c} style={{ font: '400 12px/1.55 "IBM Plex Sans Thai",sans-serif', color: '#5c4b39' }}>
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid #e4d8c1' }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 999,
                  border: 'none',
                  background: '#c67139',
                  font: '600 14px/1 "IBM Plex Sans Thai",sans-serif',
                  color: '#f5ead8',
                  cursor: isSaving ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Save size={16} /> {isSaving ? 'กำลังบันทึก...' : 'บันทึกการคำนวณ'}
              </button>
              <button
                type="button"
                onClick={handleExport}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 999,
                  border: '1px solid #c0b6a5',
                  background: 'transparent',
                  font: '600 14px/1 "IBM Plex Sans Thai",sans-serif',
                  color: '#474238',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <FileSpreadsheet size={16} /> ส่งออกเป็นไฟล์ Excel
              </button>
              {savedAt && (
                <span style={{ font: '500 12px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#4f5b3c', textAlign: 'center' }}>
                  บันทึกแล้ว {savedAt}
                </span>
              )}
              {/* บันทึกไม่สำเร็จต้องเห็นชัด ไม่งั้นผู้ใช้นึกว่าเซฟแล้วแต่จริง ๆ ข้อมูลหาย */}
              {saveError && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: '#fbe4dc',
                    border: '1px solid #e0a08c',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <span style={{ font: '600 13px/1.4 "IBM Plex Sans Thai",sans-serif', color: '#8a3a22' }}>
                    บันทึกไม่สำเร็จ — ข้อมูลยังไม่ถูกเซฟ
                  </span>
                  <span style={{ font: '400 12px/1.55 "IBM Plex Sans Thai",sans-serif', color: '#6d3714', wordBreak: 'break-word' }}>
                    {saveError}
                  </span>
                </div>
              )}
              <span style={{ font: '400 11px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#82796a', textAlign: 'center' }}>
                ไฟล์ที่ได้เป็น .csv เปิดใน Excel หรือ Google Sheets ได้ทันที
              </span>
            </div>

            <Link
              href="/income"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'center',
                padding: 14,
                borderRadius: 999,
                border: '1px solid #c0b6a5',
                background: 'transparent',
                font: '600 14px/1 "IBM Plex Sans Thai",sans-serif',
                color: '#474238',
                textDecoration: 'none',
              }}
            >
              กลับไปหน้ารายรับ
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tax-grid { grid-template-columns: 1fr !important; }
          .tax-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  )
}
