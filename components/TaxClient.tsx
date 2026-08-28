'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HelpTooltip from './HelpTooltip'
import { saveTaxDeductions } from '@/app/tax/actions'
import { Income } from '@/lib/incomeUtils'
import { calculateTaxEstimate, DEFAULT_TAX_DEDUCTIONS, TaxDeductions } from '@/lib/taxUtils'

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

// input ตัวเลขแบบสั้นๆ ใช้ซ้ำหลายจุดในฟอร์ม
function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="form-field" style={{ flex: '1 1 220px', marginBottom: 12 }}>
      <label className="form-label">{label}</label>
      <input
        type="number"
        min="0"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default function TaxClient({ initialIncomes, initialDeductions }: Props) {
  const [form, setForm] = useState<DeductionFormState>(toFormState(initialDeductions))
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const router = useRouter()

  const updateField = (key: keyof DeductionFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value as never }))
  }

  const deductions = useMemo(() => toNumbers(form), [form])
  const estimate = useMemo(
    () => calculateTaxEstimate(initialIncomes, deductions),
    [initialIncomes, deductions]
  )

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      await saveTaxDeductions(deductions)
      setSaveMessage('บันทึกแล้ว')
      router.refresh()
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSaving(false)
    }
  }

  const takeHome = estimate.totalGrossIncome - estimate.totalTax
  const taxMonthNote = estimate.totalTax > 0 ? `เท่ากับกันไว้เดือนละ ${bt(estimate.totalTax / 12)}` : 'เงินได้สุทธิยังไม่ถึงเกณฑ์เสียภาษี'
  const bracketNote =
    estimate.netTaxableIncome > 150000
      ? `เสียภาษีจริงเฉลี่ย ${estimate.effectiveRate.toFixed(1)}% ของเงินได้พึงประเมิน เพราะเงินได้สุทธิก้อนแรก ฿150,000 ได้รับยกเว้น`
      : 'เงินได้สุทธิยังไม่เกิน ฿150,000 ซึ่งเป็นช่วงที่ได้รับยกเว้นภาษี จึงยังไม่มีภาษีตามขั้นบันได'

  return (
    <div className="dashboard-page">
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 0' }}>
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
                    ปีนี้ต้องเสียประมาณ <span style={{ fontFamily: 'var(--font-number)' }}>{bt(estimate.totalTax)}</span>
                  </>
                ) : (
                  'ปีนี้ยังไม่ต้องเสียภาษี'
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
                <p style={{ margin: 0 }}>
                  ตัวเลขทั้งหมดเป็นการประมาณการเบื้องต้นเท่านั้น ไม่ใช่การคำนวณภาษีที่ยื่นจริงกับกรม
                  สรรพากร ควรตรวจสอบกับผู้เชี่ยวชาญ/โปรแกรมยื่นภาษีอย่างเป็นทางการอีกครั้ง
                </p>
              </HelpTooltip>
            </div>
          </div>
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
            เพดานลดหย่อนตามเกณฑ์ปีภาษี 2568 ยังไม่รวมทางเลือกหักค่าใช้จ่ายตามจริง สิทธิเฉพาะกรณี และการแยกยื่น
            ของคู่สมรส ก่อนยื่นจริงควรตรวจกับกรมสรรพากรหรือผู้เชี่ยวชาญ
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
            <form onSubmit={handleSave} style={{ background: '#fdf7ec', border: '1px solid #e4d8c1', borderRadius: 24, padding: 26, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                ขั้นที่ <span style={{ fontFamily: 'var(--font-number)' }}>2</span> · ค่าลดหย่อน
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ font: '600 12px/1 "IBM Plex Sans Thai",sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#9c5527' }}>
                  ส่วนตัวและครอบครัว
                </span>
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
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <NumberField label="บุตร (ทั่วไป) — คนละ ฿30,000" value={form.children_count} onChange={(v) => updateField('children_count', v)} />
                  <NumberField label="บุตรคนที่ 2+ เกิดปี 2561 ขึ้นไป — คนละ ฿60,000" value={form.children_count_esg} onChange={(v) => updateField('children_count_esg', v)} />
                  <NumberField label="อุปการะบิดามารดา — คนละ ฿30,000 (ไม่เกิน 4 คน)" value={form.parents_count} onChange={(v) => updateField('parents_count', v)} />
                  <NumberField label="อุปการะผู้พิการ/ทุพพลภาพ — คนละ ฿60,000" value={form.disabled_dependents_count} onChange={(v) => updateField('disabled_dependents_count', v)} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ font: '600 12px/1 "IBM Plex Sans Thai",sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#9c5527' }}>
                  ประกัน
                </span>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <NumberField label="ประกันสังคมที่จ่ายจริงทั้งปี" value={form.social_security_paid} onChange={(v) => updateField('social_security_paid', v)} />
                  <NumberField label="เบี้ยประกันชีวิตทั้งปี" value={form.life_insurance_premium} onChange={(v) => updateField('life_insurance_premium', v)} />
                  <NumberField label="เบี้ยประกันสุขภาพตนเอง" value={form.health_insurance_premium} onChange={(v) => updateField('health_insurance_premium', v)} />
                  <NumberField label="เบี้ยประกันสุขภาพบิดามารดา" value={form.parent_health_insurance_premium} onChange={(v) => updateField('parent_health_insurance_premium', v)} />
                </div>
                <p style={{ margin: 0, font: '400 12px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>
                  เบี้ยประกันชีวิตกับประกันสุขภาพตนเองรวมกันไม่เกิน ฿100,000 โดยส่วนสุขภาพนับได้ไม่เกิน
                  ฿25,000 · ประกันสุขภาพบิดามารดาไม่เกิน ฿15,000 · ประกันสังคมลูกจ้าง ม.33 ไม่เกิน ฿9,000
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ font: '600 12px/1 "IBM Plex Sans Thai",sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#9c5527' }}>
                  กองทุนเกษียณและการลงทุน
                </span>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <NumberField label="กองทุนสำรองเลี้ยงชีพ / กบข." value={form.pvd_contribution} onChange={(v) => updateField('pvd_contribution', v)} />
                  <NumberField label="กองทุน RMF" value={form.rmf_amount} onChange={(v) => updateField('rmf_amount', v)} />
                  <NumberField label="ประกันชีวิตแบบบำนาญ" value={form.pension_insurance} onChange={(v) => updateField('pension_insurance', v)} />
                  <NumberField label="กองทุน Thai ESG / Thai ESGX" value={form.thai_esg_amount} onChange={(v) => updateField('thai_esg_amount', v)} />
                </div>
                <p style={{ margin: 0, font: '400 12px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>
                  กลุ่มเกษียณ (PVD/กบข. + RMF + ประกันบำนาญ) แต่ละตัวมีเพดานของตัวเอง และรวมกันไม่เกิน
                  ฿500,000 · Thai ESG / ESGX แยกเพดานเอง ไม่เกิน 30% ของเงินได้และไม่เกิน ฿300,000 · สิทธิซื้อ
                  SSF สิ้นสุดตั้งแต่ปีภาษี 2568
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span style={{ font: '600 12px/1 "IBM Plex Sans Thai",sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#9c5527' }}>
                  บ้าน มาตรการรายปี และบริจาค
                </span>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <NumberField label="ดอกเบี้ยกู้ซื้อที่อยู่อาศัย" value={form.mortgage_interest} onChange={(v) => updateField('mortgage_interest', v)} />
                  <NumberField label="Easy E-Receipt 2.0" value={form.easy_e_receipt} onChange={(v) => updateField('easy_e_receipt', v)} />
                  <NumberField label="เงินบริจาคทั่วไป" value={form.donation_general} onChange={(v) => updateField('donation_general', v)} />
                  <NumberField label="บริจาคการศึกษา / กีฬา / รพ.รัฐ (นับ 2 เท่า)" value={form.donation_education_sports} onChange={(v) => updateField('donation_education_sports', v)} />
                </div>
                <p style={{ margin: 0, font: '400 12px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>
                  บริจาคเพื่อการศึกษา กีฬา และโรงพยาบาลรัฐ นับได้ 2 เท่าของที่จ่าย · เงินบริจาคทุกก้อนรวมกัน
                  หักได้ไม่เกิน 10% ของเงินได้หลังหักค่าลดหย่อนอื่นแล้ว
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="submit" disabled={isSaving} className="btn-gradient-primary" style={{ width: 'auto', padding: '9px 20px' }}>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกค่าลดหย่อน'}
                </button>
                {saveMessage && <span style={{ fontSize: 12, color: '#474238' }}>{saveMessage}</span>}
              </div>
            </form>

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
              <div className="wht-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'end' }}>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label">ภาษีหัก ณ ที่จ่ายทั้งปี — ดูจากหนังสือรับรอง 50 ทวิ</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={form.withholding_tax}
                    onChange={(e) => updateField('withholding_tax', e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    padding: '16px 20px',
                    borderRadius: 18,
                    background: estimate.settlement.isRefund ? '#e6ecd6' : '#f7ddd0',
                  }}
                >
                  <span style={{ font: '500 12px/1.4 "IBM Plex Sans Thai",sans-serif', color: estimate.settlement.isRefund ? '#3f5230' : '#8c491a' }}>
                    {estimate.settlement.isRefund ? 'ขอคืนภาษีได้' : 'ต้องจ่ายเพิ่มตอนยื่น'}
                  </span>
                  <span style={{ font: '600 28px/1 var(--font-number)', color: estimate.settlement.isRefund ? '#3f5230' : '#8c491a' }}>
                    {bt(Math.abs(estimate.settlement.amount))}
                  </span>
                </div>
              </div>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>เงินได้สุทธิ</span>
              <span style={{ font: '600 26px/1 var(--font-number)' }}>{bt(estimate.netTaxableIncome)}</span>
            </div>

            <div style={{ background: '#f2e0cb', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#6d3714' }}>
                ภาษีทั้งปี · อัตราจริง {estimate.effectiveRate.toFixed(1)}%
              </span>
              <span style={{ font: '600 36px/1 var(--font-number)', color: '#8c491a' }}>{bt(estimate.totalTax)}</span>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6d3714' }}>{taxMonthNote}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ font: '400 13px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>เหลือหลังภาษีทั้งปี</span>
              <span style={{ font: '600 14px/1 var(--font-number)' }}>{bt(takeHome)}</span>
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
        @media (max-width: 520px) {
          .wht-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
