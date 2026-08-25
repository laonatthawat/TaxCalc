'use client'

import { useState, useEffect } from 'react'
import { addSubscription, updateSubscription, SubscriptionInput } from '@/app/dashboard/actions'

type Subscription = {
  id: string
  name: string
  price: number
  billing_cycle: string
  next_billing_date: string
  category: string | null
}

type Props = {
  isOpen: boolean
  onClose: () => void
  editingSubscription: Subscription | null
}

export default function SubscriptionModal({ isOpen, onClose, editingSubscription }: Props) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [nextBillingDate, setNextBillingDate] = useState('')
  const [category, setCategory] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // เมื่อเปิด modal สำหรับ "แก้ไข" ให้เติมค่าเดิมลงในฟอร์ม
  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name)
      setPrice(String(editingSubscription.price))
      setBillingCycle(editingSubscription.billing_cycle as 'monthly' | 'yearly')
      setNextBillingDate(editingSubscription.next_billing_date)
      setCategory(editingSubscription.category ?? '')
    } else {
      // เปิด modal สำหรับ "เพิ่มใหม่" ให้เคลียร์ฟอร์มว่าง
      setName('')
      setPrice('')
      setBillingCycle('monthly')
      setNextBillingDate('')
      setCategory('')
    }
    setError('')
  }, [editingSubscription, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    const input: SubscriptionInput = {
      name,
      price: parseFloat(price),
      billing_cycle: billingCycle,
      next_billing_date: nextBillingDate,
      category,
    }

    try {
      if (editingSubscription) {
        await updateSubscription(editingSubscription.id, input)
      } else {
        await addSubscription(input)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    // พื้นหลังสีเข้มโปร่งแสง คลิกแล้วปิด modal
    <div className="modal-overlay" onClick={onClose}>
      {/* กล่อง modal เอง: stopPropagation กันไม่ให้คลิกข้างในแล้วปิดตัวเอง */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {editingSubscription ? 'แก้ไข Subscription' : 'เพิ่ม Subscription'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">ชื่อ</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">ราคา (บาท)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">รอบการต่ออายุ</label>
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
            <label className="form-label">วันที่ต่ออายุถัดไป</label>
            <input
              type="date"
              className="form-input"
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field" style={{ marginBottom: 20 }}>
            <label className="form-label">หมวดหมู่ (ไม่บังคับ)</label>
            <input
              type="text"
              list="category-options"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="เลือกจากรายการ หรือพิมพ์เอง"
            />
            <datalist id="category-options">
              <option value="Entertainment" />
              <option value="Productivity" />
              <option value="Music" />
              <option value="Cloud Storage" />
              <option value="Software" />
              <option value="Fitness" />
              <option value="Education" />
              <option value="Gaming" />
            </datalist>
          </div>

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
