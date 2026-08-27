'use client'

import { useState } from 'react'
import { addIncome, updateIncome, IncomeInput } from '@/app/income/actions'
import {
  INCOME_TYPES,
  CYCLE_OPTIONS,
  getIncomeTypeMeta,
  expenseRateOf,
  timesPerYearOf,
  IncomeType,
  IncomeSub,
  BillingCycle,
  Income,
} from '@/lib/incomeUtils'

type Props = {
  isOpen: boolean
  onClose: () => void
  editingIncome: Income | null
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

// รับ props เริ่มต้นจาก editingIncome ตรงๆ ผ่าน useState initializer — คอมโพเนนต์นี้ต้อง remount ทุกครั้งที่เปิด
// (ผู้เรียกใส่ key={editingIncome?.id ?? 'new'} ตอนเปิด modal) แทนที่จะ sync ด้วย useEffect+setState
export default function IncomeModal({ isOpen, onClose, editingIncome }: Props) {
  const [name, setName] = useState(editingIncome?.name ?? '')
  const [amount, setAmount] = useState(editingIncome ? String(editingIncome.amount) : '')
  const [incomeType, setIncomeType] = useState<IncomeType>(editingIncome?.income_type ?? '40_1')
  const [incomeSub, setIncomeSub] = useState<IncomeSub>(editingIncome?.income_sub ?? null)
  const [isRecurring, setIsRecurring] = useState(editingIncome?.is_recurring ?? true)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    (editingIncome?.billing_cycle as BillingCycle) ?? 'monthly'
  )
  const [nextPaymentDate, setNextPaymentDate] = useState(editingIncome?.next_payment_date ?? '')
  const [receivedDate, setReceivedDate] = useState(editingIncome?.received_date ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const typeMeta = getIncomeTypeMeta(incomeType)
  const rate = expenseRateOf(incomeType, incomeSub)
  const amountNum = parseFloat(amount) || 0
  const yearPreview = isRecurring ? amountNum * timesPerYearOf(billingCycle) : amountNum

  const handleTypeChange = (value: IncomeType) => {
    setIncomeType(value)
    const meta = getIncomeTypeMeta(value)
    setIncomeSub(meta.subs ? meta.subs[0].id : null)
  }

  const dedHint = typeMeta.exempt
    ? 'เงินได้ประเภทนี้ได้รับยกเว้นภาษี ระบบจะไม่นำไปคำนวณ'
    : rate === 0
      ? 'ประเภทนี้หักค่าใช้จ่ายแบบเหมาไม่ได้ ทั้งก้อนถูกนำไปคิดภาษี'
      : `ประเภทนี้หักค่าใช้จ่ายแบบเหมาได้ ${(rate * 100).toFixed(0)}%` +
        (typeMeta.capGroup === 'salary'
          ? ' โดยรวมกับ 40(1)(2) อื่นแล้วไม่เกิน ฿100,000'
          : typeMeta.cap
            ? ` ไม่เกิน ฿${fmt(typeMeta.cap)}`
            : ' ตามจริง')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('กรุณากรอกชื่อรายรับ')
      return
    }

    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('กรุณากรอกจำนวนเงินที่ถูกต้อง')
      return
    }

    if (isRecurring && !nextPaymentDate) {
      setError('กรุณาเลือกวันที่จะได้รับเงินครั้งถัดไป')
      return
    }

    if (!isRecurring && !receivedDate) {
      setError('กรุณาเลือกวันที่ได้รับเงิน')
      return
    }

    setIsSaving(true)

    const input: IncomeInput = {
      name,
      amount: parseFloat(amount),
      income_type: incomeType,
      income_sub: typeMeta.subs ? incomeSub : null,
      is_recurring: isRecurring,
      billing_cycle: isRecurring ? billingCycle : null,
      next_payment_date: isRecurring ? nextPaymentDate : null,
      received_date: isRecurring ? null : receivedDate,
    }

    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id, input)
      } else {
        await addIncome(input)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSaving(false)
    }
  }

  const saveDisabled = isSaving || !name.trim() || amountNum <= 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{editingIncome ? 'แก้ไขรายรับ' : 'เพิ่มรายรับ'}</h2>
        {/* noValidate: โชว์ error ของเราเองแทน popup ของ browser */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">ชื่อรายรับ</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น เงินเดือน, งาน freelance บริษัท X"
            />
          </div>

          <div className="form-field">
            <label className="form-label">จำนวนเงิน (บาท) ต่อรอบ</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">ประเภทเงินได้ (ตามมาตรา 40)</label>
            <select
              className="form-input"
              value={incomeType}
              onChange={(e) => handleTypeChange(e.target.value as IncomeType)}
            >
              {INCOME_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {typeMeta.subs && (
            <div className="form-field">
              <label className="form-label">ลักษณะเงินได้ย่อย</label>
              <select
                className="form-input"
                value={incomeSub ?? typeMeta.subs[0].id}
                onChange={(e) => setIncomeSub(e.target.value)}
              >
                {typeMeta.subs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              background: '#f4ead9',
              borderRadius: 16,
              padding: '12px 16px',
              marginBottom: 16,
              font: '400 12px/1.6 "IBM Plex Sans Thai",sans-serif',
              color: '#5c4b39',
            }}
          >
            {dedHint}
          </div>

          {/* toggle รายรับประจำ vs ครั้งเดียว — ปุ่มคู่สไตล์ pill กดสลับกันได้ */}
          <div className="form-field">
            <label className="form-label">ลักษณะรายรับ</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setIsRecurring(true)}
                className={isRecurring ? 'btn-gradient-primary' : 'btn-secondary'}
                style={{ flex: 1, width: 'auto', padding: '9px 0' }}
              >
                ประจำ (recurring)
              </button>
              <button
                type="button"
                onClick={() => setIsRecurring(false)}
                className={!isRecurring ? 'btn-gradient-primary' : 'btn-secondary'}
                style={{ flex: 1, width: 'auto', padding: '9px 0' }}
              >
                ครั้งเดียว (one-time)
              </button>
            </div>
          </div>

          {isRecurring ? (
            <>
              <div className="form-field">
                <label className="form-label">รอบการรับเงิน</label>
                <select
                  className="form-input"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                >
                  {CYCLE_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">วันที่จะได้รับเงินครั้งถัดไป</label>
                <input
                  type="date"
                  className="form-input"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="form-field">
              <label className="form-label">วันที่ได้รับเงิน</label>
              <input
                type="date"
                className="form-input"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              alignItems: 'baseline',
              padding: '12px 16px',
              borderRadius: 14,
              background: '#e6ecd6',
              marginBottom: 18,
              color: '#3f5230',
            }}
          >
            <span style={{ font: '500 13px/1.4 "IBM Plex Sans Thai",sans-serif' }}>รวมเป็นรายรับทั้งปี</span>
            <span style={{ font: '600 17px/1 "Figtree",sans-serif' }}>฿{fmt(yearPreview)}</span>
          </div>

          {error && <p className="auth-alert-error">{error}</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="submit" disabled={saveDisabled} className="btn-gradient-primary">
              {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
