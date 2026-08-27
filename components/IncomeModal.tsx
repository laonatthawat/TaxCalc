'use client'

import { useState, useEffect } from 'react'
import { addIncome, updateIncome, IncomeInput } from '@/app/income/actions'
import { INCOME_TYPE_OPTIONS, IncomeType, Income } from '@/lib/incomeUtils'

type Props = {
  isOpen: boolean
  onClose: () => void
  editingIncome: Income | null
}

export default function IncomeModal({ isOpen, onClose, editingIncome }: Props) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [incomeType, setIncomeType] = useState<IncomeType>('40_1')
  const [isRecurring, setIsRecurring] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [nextPaymentDate, setNextPaymentDate] = useState('')
  const [receivedDate, setReceivedDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingIncome) {
      setName(editingIncome.name)
      setAmount(String(editingIncome.amount))
      setIncomeType(editingIncome.income_type)
      setIsRecurring(editingIncome.is_recurring)
      setBillingCycle((editingIncome.billing_cycle as 'monthly' | 'yearly') ?? 'monthly')
      setNextPaymentDate(editingIncome.next_payment_date ?? '')
      setReceivedDate(editingIncome.received_date ?? '')
    } else {
      setName('')
      setAmount('')
      setIncomeType('40_1')
      setIsRecurring(true)
      setBillingCycle('monthly')
      setNextPaymentDate('')
      setReceivedDate('')
    }
    setError('')
  }, [editingIncome, isOpen])

  if (!isOpen) return null

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
            <label className="form-label">จำนวนเงิน (บาท)</label>
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
              onChange={(e) => setIncomeType(e.target.value as IncomeType)}
            >
              {INCOME_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* คำใบ้พิเศษเมื่อเลือก "เงินให้" — อธิบายว่าทำไมไม่ต้องเสียภาษี กันคนสงสัย/กังวลว่ากรอกผิดหมวด */}
            {incomeType === 'gift' && (
              <p style={{ margin: '6px 0 0', fontSize: 11, color: '#82796a', lineHeight: 1.5 }}>
                เงินให้จากบุพการี/คู่สมรส/บุตร ได้รับยกเว้นภาษีไม่เกิน 20 ล้านบาท/ปี (จากบุคคลอื่นไม่เกิน 10
                ล้านบาท/ปี) รายการนี้จะไม่ถูกนำไปรวมคำนวณในหน้าภาษี แต่ยังนับเป็นรายรับปกติในหน้านี้
              </p>
            )}
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
                  onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                >
                  <option value="monthly">รายเดือน</option>
                  <option value="yearly">รายปี</option>
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
            <div className="form-field" style={{ marginBottom: 20 }}>
              <label className="form-label">วันที่ได้รับเงิน</label>
              <input
                type="date"
                className="form-input"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
          )}

          {error && <p className="auth-alert-error">{error}</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="submit" disabled={isSaving} className="btn-gradient-primary">
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
