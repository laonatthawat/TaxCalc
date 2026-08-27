'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PainMeterCat from './PainMeterCat'
import { getPainLevel, PainLevel } from '@/lib/subscriptionUtils'
import { updateMonthlyBudget } from '@/app/dashboard/actions'

type Props = {
  monthlyBudget: number | null
  totalMonthly: number
}

// ข้อความ/สีของแต่ละระดับความเจ็บ เรียงจากใช้งบน้อยสุดไปเยอะสุด
const LEVEL_COPY: Record<PainLevel, { label: string; barColor: string; bg: string; text: string }> = {
  happy: {
    label: 'สบายๆ ยังไม่เจ็บ',
    barColor: 'linear-gradient(90deg, #ccdbb2, #8fa073)',
    bg: '#f0fae1',
    text: '#3d472b',
  },
  okay: {
    label: 'เริ่มใช้ไปพอสมควรแล้ว',
    barColor: 'linear-gradient(90deg, #ffc6a5, #f6a06b)',
    bg: '#fff2eb',
    text: '#8c491a',
  },
  worried: {
    label: 'ใกล้เต็มงบแล้วนะ',
    barColor: 'linear-gradient(90deg, #f6a06b, #d67f48)',
    bg: '#ffe1d0',
    text: '#643312',
  },
  pain: {
    label: 'จ่ายจนเจ็บแล้ว! เกินงบที่ตั้งไว้',
    barColor: 'linear-gradient(90deg, #e0a58f, #8a3a22)',
    bg: '#f4c9bd',
    text: '#8a3a22',
  },
}

export default function PainMeter({ monthlyBudget, totalMonthly }: Props) {
  const [isEditing, setIsEditing] = useState(monthlyBudget === null)
  const [budgetInput, setBudgetInput] = useState(monthlyBudget ? String(monthlyBudget) : '')
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const pain = getPainLevel(totalMonthly, monthlyBudget)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(budgetInput)
    if (!value || value <= 0) return

    setIsSaving(true)
    try {
      await updateMonthlyBudget(value)
      setIsEditing(false)
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  // โชว์ฟอร์มกรอกงบแทนมิเตอร์ เมื่อ: กำลังกดแก้ไขอยู่, หรือ pain เป็น null (ยังไม่มีงบจริงๆ)
  // เช็ค pain === null ด้วย (ไม่ใช่เช็คแค่ isEditing) เพื่อกัน race condition ตอนบันทึกงบครั้งแรก:
  // handleSave สั่ง setIsEditing(false) ทันที แต่ prop monthlyBudget จากฝั่ง server ยังไม่ทันอัปเดตตาม
  // router.refresh() ที่เป็น async ทำให้ render รอบนั้น isEditing=false แต่ monthlyBudget ยังเป็น null อยู่
  // (ถ้าใช้แค่ isEditing เป็นเงื่อนไข จะไปพยายาม destructure pain! ที่เป็น null แล้ว crash)
  if (isEditing || pain === null) {
    return (
      <div
        style={{
          background: '#f9f4ed',
          border: '0.5px solid #dcd3c4',
          borderRadius: 28,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <PainMeterCat level="okay" size={44} />
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>มิเตอร์ความเจ็บ</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#474238' }}>
              ตั้งงบรายจ่ายต่อเดือน เพื่อดูว่าตอนนี้ใช้ไปเท่าไหร่แล้ว
            </p>
          </div>
        </div>
        <form onSubmit={handleSave} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="number"
            step="0.01"
            min="1"
            className="form-input"
            style={{ flex: 1, minWidth: 160 }}
            placeholder="เช่น 5000"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isSaving}
            className="btn-gradient-primary"
            style={{ width: 'auto', padding: '0 20px' }}
          >
            {isSaving ? '...' : 'บันทึก'}
          </button>
          {monthlyBudget !== null && (
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              ยกเลิก
            </button>
          )}
        </form>
      </div>
    )
  }

  // ผ่านเงื่อนไขข้างบนมาได้ แปลว่า pain ไม่ใช่ null แน่นอน (TypeScript ยังไม่รู้ ต้อง narrow เอง)
  const { percent, level } = pain
  const copy = LEVEL_COPY[level]
  const barWidth = Math.min(percent, 100)

  return (
    <div
      style={{
        background: copy.bg,
        borderRadius: 28,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <PainMeterCat level={level} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>มิเตอร์ความเจ็บ</h3>
            <button
              onClick={() => {
                setBudgetInput(String(monthlyBudget))
                setIsEditing(true)
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 12,
                color: '#8c491a',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              แก้ไขงบ
            </button>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: copy.text }}>{copy.label}</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 999, height: 10, overflow: 'hidden' }}>
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            background: copy.barColor,
            borderRadius: 999,
            transition: 'width 0.3s',
          }}
        />
      </div>

      <p style={{ margin: '8px 0 0', fontSize: 12, color: '#474238' }}>
        ใช้ไป ฿{totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })} จากงบ ฿
        {monthlyBudget!.toLocaleString()} ({percent}%)
      </p>
    </div>
  )
}
