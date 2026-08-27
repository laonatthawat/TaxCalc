'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import HelpTooltip from './HelpTooltip'
import { signOut } from '@/app/dashboard/actions'
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
    ssf_amount: String(merged.ssf_amount),
    thai_esg_amount: String(merged.thai_esg_amount),
    mortgage_interest: String(merged.mortgage_interest),
    donation_general: String(merged.donation_general),
    donation_education_sports: String(merged.donation_education_sports),
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
    ssf_amount: Number(form.ssf_amount) || 0,
    thai_esg_amount: Number(form.thai_esg_amount) || 0,
    mortgage_interest: Number(form.mortgage_interest) || 0,
    donation_general: Number(form.donation_general) || 0,
    donation_education_sports: Number(form.donation_education_sports) || 0,
  }
}

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

export default function TaxClient({ initialIncomes, initialDeductions, userEmail }: Props) {
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
      setSaveMessage('บันทึกค่าลดหย่อนแล้ว')
      router.refresh()
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="dashboard-page">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Logo />
        </div>

        <div className="page-tabs">
          <Link href="/dashboard" className="page-tab">
            รายจ่าย
          </Link>
          <Link href="/income" className="page-tab">
            รายรับ
          </Link>
          <span className="page-tab page-tab-active">ภาษี</span>
          <Link href="/overview" className="page-tab">
            ภาพรวม
          </Link>
        </div>

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
                ประมาณการภาษีเงินได้บุคคลธรรมดา
              </h1>
              <HelpTooltip title="วิธีใช้หน้าภาษี">
                <p style={{ margin: '0 0 8px' }}>
                  ระบบดึงรายรับทั้งหมดจากหน้า &quot;รายรับ&quot; มาคำนวณให้อัตโนมัติ (ยกเว้นประเภท
                  &quot;เงินให้&quot; ที่ได้รับยกเว้นภาษี)
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  ขั้นตอน: หักค่าใช้จ่ายตามประเภทเงินได้ → หักค่าลดหย่อนที่คุณกรอกด้านล่าง (มีเพดานตาม
                  กฎหมาย ระบบจะขึ้นป้าย &quot;ถึงเพดานแล้ว&quot; ให้เห็น) → คำนวณภาษีแบบขั้นบันไดจาก
                  เงินได้สุทธิที่เหลือ
                </p>
                <p style={{ margin: 0 }}>
                  ตัวเลขทั้งหมดเป็นการประมาณการเบื้องต้นเท่านั้น ไม่ใช่การคำนวณภาษีที่ยื่นจริงกับกรม
                  สรรพากร ควรตรวจสอบกับผู้เชี่ยวชาญ/โปรแกรมยื่นภาษีอย่างเป็นทางการอีกครั้ง
                </p>
              </HelpTooltip>
            </div>
            <p style={{ color: '#474238', margin: '4px 0 0' }}>{userEmail}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            ออกจากระบบ
          </button>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #f4c9bd, #fbe4dc)',
            borderRadius: 28,
            padding: '14px 20px',
            marginBottom: 20,
            color: '#8a3a22',
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          ⚠️ นี่คือ<strong>การประมาณการเบื้องต้น</strong>จากข้อมูลรายรับในแอปและค่าลดหย่อนที่คุณกรอกเองเท่านั้น
          ไม่ใช่การยื่นภาษีจริง กฎหมายภาษีมีเงื่อนไข/ข้อยกเว้นปลีกย่อยอีกมาก และอัตราหักค่าใช้จ่ายบางประเภท
          (40(5)/40(6)/40(8)) ใช้อัตรากลางที่พบบ่อยสุด ไม่ใช่อัตราที่แม่นยำสำหรับทุกกรณี
          ควรตรวจสอบกับกรมสรรพากรหรือผู้เชี่ยวชาญก่อนยื่นจริงเสมอ
        </div>

        {/* รายรับที่ใช้คำนวณ — ดึงมาจากหน้ารายรับอัตโนมัติ แก้ไขได้ที่หน้านั้นเท่านั้น */}
        <div
          style={{
            background: '#f9f4ed',
            border: '0.5px solid #dcd3c4',
            borderRadius: 28,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>
              รายรับที่ใช้คำนวณ (ประมาณการทั้งปี)
            </h3>
            <Link href="/income" style={{ fontSize: 12, fontWeight: 600, color: '#8c491a', textDecoration: 'none' }}>
              แก้ไขที่หน้ารายรับ →
            </Link>
          </div>

          {estimate.expenseBreakdown.length === 0 ? (
            <p style={{ fontSize: 13, color: '#82796a', margin: 0 }}>
              ยังไม่มีข้อมูลรายรับ — ไปเพิ่มรายรับก่อนเพื่อให้คำนวณภาษีได้
            </p>
          ) : (
            estimate.expenseBreakdown.map((item) => (
              <div
                key={item.label}
                style={{ padding: '10px 0', borderTop: '1px solid #dcd3c4', fontSize: 13 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: '#201e1d', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ color: '#201e1d' }}>฿{item.grossIncome.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: '#82796a', fontSize: 12 }}>
                  <span>หักค่าใช้จ่าย ฿{item.deductibleExpense.toLocaleString()}</span>
                  <span>เหลือ ฿{item.netIncome.toLocaleString()}</span>
                </div>
                {item.note && (
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#a19786' }}>{item.note}</p>
                )}
              </div>
            ))
          )}

          {/* โชว์ยอด "เงินให้" ที่ตั้งใจไม่เอามารวมคำนวณ เพื่อความโปร่งใส — ผู้ใช้จะได้เห็นว่าไม่ใช่ข้อมูลหาย
              แต่ระบบจงใจแยกออกเพราะเป็นเงินได้ที่กฎหมายยกเว้นภาษี ไม่ใช่เงินได้ตามมาตรา 40 */}
          {estimate.exemptGiftTotal > 0 && (
            <div
              style={{
                marginTop: 8,
                padding: '10px 0 0',
                borderTop: '1px solid #dcd3c4',
                fontSize: 12,
                color: '#82796a',
              }}
            >
              เงินให้ (ยกเว้นภาษี) ฿{estimate.exemptGiftTotal.toLocaleString()} — ไม่นำมาคำนวณในหน้านี้
            </div>
          )}
        </div>

        {/* ฟอร์มค่าลดหย่อน */}
        <form
          onSubmit={handleSave}
          style={{
            background: '#f9f4ed',
            border: '0.5px solid #dcd3c4',
            borderRadius: 28,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>ค่าลดหย่อนภาษี</h3>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8c491a', margin: '16px 0 8px' }}>
            ส่วนบุคคล/ครอบครัว
          </h4>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#201e1d',
              marginBottom: 12,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={form.has_spouse}
              onChange={(e) => updateField('has_spouse', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#c67139' }}
            />
            มีคู่สมรสที่ไม่มีเงินได้ (+60,000)
          </label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <NumberField
              label="บุตร (ทั่วไป) — คน"
              value={form.children_count}
              onChange={(v) => updateField('children_count', v)}
            />
            <NumberField
              label="บุตรคนที่ 2+ เกิดปี 2561+ — คน"
              value={form.children_count_esg}
              onChange={(v) => updateField('children_count_esg', v)}
            />
            <NumberField
              label="อุปการะบิดามารดา — คน (สูงสุด 4)"
              value={form.parents_count}
              onChange={(v) => updateField('parents_count', v)}
            />
            <NumberField
              label="อุปการะผู้พิการ/ทุพพลภาพ — คน"
              value={form.disabled_dependents_count}
              onChange={(v) => updateField('disabled_dependents_count', v)}
            />
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8c491a', margin: '16px 0 8px' }}>ประกัน</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <NumberField
              label="ประกันสังคมที่จ่ายจริง (บาท)"
              value={form.social_security_paid}
              onChange={(v) => updateField('social_security_paid', v)}
            />
            <NumberField
              label="เบี้ยประกันชีวิต (บาท)"
              value={form.life_insurance_premium}
              onChange={(v) => updateField('life_insurance_premium', v)}
            />
            <NumberField
              label="เบี้ยประกันสุขภาพตนเอง (บาท)"
              value={form.health_insurance_premium}
              onChange={(v) => updateField('health_insurance_premium', v)}
            />
            <NumberField
              label="เบี้ยประกันสุขภาพบิดามารดา (บาท)"
              value={form.parent_health_insurance_premium}
              onChange={(v) => updateField('parent_health_insurance_premium', v)}
            />
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8c491a', margin: '16px 0 8px' }}>
            กองทุนเพื่อการเกษียณ/ลงทุน
          </h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <NumberField
              label="กองทุนสำรองเลี้ยงชีพ/กบข. (บาท)"
              value={form.pvd_contribution}
              onChange={(v) => updateField('pvd_contribution', v)}
            />
            <NumberField
              label="เงินลงทุน RMF (บาท)"
              value={form.rmf_amount}
              onChange={(v) => updateField('rmf_amount', v)}
            />
            <NumberField
              label="เงินลงทุน SSF (บาท)"
              value={form.ssf_amount}
              onChange={(v) => updateField('ssf_amount', v)}
            />
            <NumberField
              label="เงินลงทุน Thai ESG (บาท)"
              value={form.thai_esg_amount}
              onChange={(v) => updateField('thai_esg_amount', v)}
            />
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8c491a', margin: '16px 0 8px' }}>อื่นๆ</h4>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <NumberField
              label="ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย (บาท)"
              value={form.mortgage_interest}
              onChange={(v) => updateField('mortgage_interest', v)}
            />
            <NumberField
              label="เงินบริจาคทั่วไป (บาท)"
              value={form.donation_general}
              onChange={(v) => updateField('donation_general', v)}
            />
            <NumberField
              label="เงินบริจาคการศึกษา/กีฬา (หักได้ 2 เท่า)"
              value={form.donation_education_sports}
              onChange={(v) => updateField('donation_education_sports', v)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-gradient-primary"
              style={{ width: 'auto', padding: '9px 20px' }}
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกค่าลดหย่อน'}
            </button>
            {saveMessage && <span style={{ fontSize: 12, color: '#474238' }}>{saveMessage}</span>}
          </div>
        </form>

        {/* การ์ดสรุปผลลัพธ์ — โทนเทาเข้ม/official ให้ต่างจากรายจ่าย(ม่วง)/รายรับ(เขียว) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #645c50 0%, #474238 55%, #2e2b25 100%)',
            borderRadius: 28,
            padding: '22px 24px',
            marginBottom: 16,
            color: '#f9f4ed',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            ภาษีที่ต้องจ่ายโดยประมาณ (ทั้งปี)
          </p>
          <p style={{ margin: '6px 0 20px', fontSize: 34, fontWeight: 700 }}>
            ฿{estimate.totalTax.toLocaleString()}
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>เงินได้สุทธิ (หลังหักทุกอย่าง)</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{estimate.netTaxableIncome.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>อัตราภาษีเฉลี่ย</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{estimate.effectiveRate.toFixed(1)}%</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>ค่าลดหย่อนรวม</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{estimate.totalDeductions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* breakdown ค่าลดหย่อนที่ใช้จริง (หลังหักเพดานแล้ว) */}
        <div
          style={{
            background: '#f9f4ed',
            border: '0.5px solid #dcd3c4',
            borderRadius: 28,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>
            ค่าลดหย่อนที่ใช้จริง (หลังหักเพดานแล้ว)
          </h3>
          {estimate.deductionItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderTop: '1px solid #dcd3c4',
                fontSize: 13,
              }}
            >
              <span style={{ color: '#201e1d' }}>
                {item.label}
                {item.capped && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#8a3a22',
                      background: '#fbe4dc',
                      padding: '1px 6px',
                      borderRadius: 999,
                    }}
                  >
                    ถึงเพดานแล้ว
                  </span>
                )}
              </span>
              <span style={{ color: '#201e1d', fontWeight: 500 }}>฿{item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* breakdown ขั้นบันไดภาษี */}
        <div
          style={{
            background: '#f9f4ed',
            border: '0.5px solid #dcd3c4',
            borderRadius: 28,
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>
            รายละเอียดภาษีขั้นบันได
          </h3>
          {estimate.brackets.length === 0 ? (
            <p style={{ fontSize: 13, color: '#82796a', margin: 0 }}>
              เงินได้สุทธิอยู่ในเกณฑ์ได้รับยกเว้นภาษี (ไม่เกิน 150,000 บาท)
            </p>
          ) : (
            estimate.brackets.map((b) => (
              <div
                key={b.rangeLabel}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderTop: '1px solid #dcd3c4',
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#201e1d' }}>
                  {b.rangeLabel} <span style={{ color: '#82796a' }}>({(b.rate * 100).toFixed(0)}%)</span>
                </span>
                <span style={{ color: '#201e1d', fontWeight: 500 }}>฿{Math.round(b.taxFromBracket).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
