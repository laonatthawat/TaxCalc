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

// รายการหมวดหมู่แนะนำ — ใช้กับ dropdown ที่สไตล์เอง แทน <datalist> ของ browser
// (datalist ของแต่ละ browser หน้าตาไม่เหมือนกันเลย แก้สีแก้ฟอนต์เองไม่ได้)
const CATEGORY_OPTIONS = [
  'ที่พัก/ค่าเช่า',
  'ค่าน้ำ-ไฟ-เน็ต',
  'ค่าโทรศัพท์',
  'ค่าผ่อน',
  'ประกัน',
  'เดินทาง',
  'Entertainment',
  'Productivity',
  'Music',
  'Cloud Storage',
  'Software',
  'Fitness',
  'Education',
  'Gaming',
  'อื่นๆ',
]

export default function SubscriptionModal({ isOpen, onClose, editingSubscription }: Props) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [nextBillingDate, setNextBillingDate] = useState('')
  const [category, setCategory] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

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
          {editingSubscription ? 'แก้ไขรายจ่ายประจำ' : 'เพิ่มรายจ่ายประจำ'}
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
            <label className="form-label">รอบการจ่าย</label>
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
            <label className="form-label">วันที่ครบกำหนดจ่ายถัดไป</label>
            <input
              type="date"
              className="form-input"
              value={nextBillingDate}
              onChange={(e) => setNextBillingDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field" style={{ marginBottom: 20, position: 'relative' }}>
            <label className="form-label">หมวดหมู่ (ไม่บังคับ)</label>
            <input
              type="text"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setIsCategoryOpen(true)}
              onBlur={() => setTimeout(() => setIsCategoryOpen(false), 120)}
              placeholder="เลือกจากรายการ หรือพิมพ์เอง"
              autoComplete="off"
            />
            {isCategoryOpen &&
              (() => {
                const filtered = CATEGORY_OPTIONS.filter((option) =>
                  option.toLowerCase().includes(category.toLowerCase())
                )
                if (filtered.length === 0) return null

                return (
                  <div className="select-dropdown">
                    {filtered.map((option) => (
                      <div
                        key={option}
                        className="select-dropdown-item"
                        // ใช้ onMouseDown แทน onClick เพราะ onBlur ของ input จะทำงานก่อน onClick เสมอ
                        // (mousedown เกิดก่อน blur ทำให้เลือกตัวเลือกได้ก่อนที่ dropdown จะถูกปิด)
                        onMouseDown={() => {
                          setCategory(option)
                          setIsCategoryOpen(false)
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )
              })()}
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
