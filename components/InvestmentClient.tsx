'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import Logo from './Logo'
import HelpTooltip from './HelpTooltip'
import { signOut } from '@/app/dashboard/actions'
import { saveInvestmentPlan } from '@/app/investments/actions'
import { calculateProjection, calculateMonthlyProjection, findCrossoverPoints } from '@/lib/investmentUtils'

type Props = {
  initialPlan: {
    initial_amount: number
    monthly_contribution: number
    annual_return_rate: number
    years: number
  } | null
  userEmail: string
}

// ย่อตัวเลขบนแกนกราฟให้อ่านง่าย เช่น 1,500,000 -> 1.5M, 25,000 -> 25K
function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}K`
  return String(value)
}

// แปลงปีทศนิยม (จากข้อมูลรายเดือน) เป็นข้อความ "ปีที่ X เดือนที่ Y" ให้อ่านง่ายกว่าเลขทศนิยมโดดๆ
function formatYearLabel(year: number): string {
  const totalMonths = Math.round(year * 12)
  const y = Math.floor(totalMonths / 12)
  const m = totalMonths % 12
  return m === 0 ? `ปีที่ ${y}` : `ปีที่ ${y} เดือนที่ ${m}`
}

export default function InvestmentClient({ initialPlan, userEmail }: Props) {
  const [initialAmount, setInitialAmount] = useState(String(initialPlan?.initial_amount ?? 0))
  const [monthlyContribution, setMonthlyContribution] = useState(
    String(initialPlan?.monthly_contribution ?? 2000)
  )
  const [annualReturnRate, setAnnualReturnRate] = useState(
    String(initialPlan?.annual_return_rate ?? 7)
  )
  const [years, setYears] = useState(String(initialPlan?.years ?? 15))
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const router = useRouter()

  const yearsRawNum = Number(years) || 0
  const yearsNum = Math.max(1, Math.min(50, yearsRawNum || 1))
  const isYearsClamped = yearsRawNum > 50
  const planInput = {
    initial_amount: Number(initialAmount) || 0,
    monthly_contribution: Number(monthlyContribution) || 0,
    annual_return_rate: Number(annualReturnRate) || 0,
    years: yearsNum,
  }

  // คำนวณใหม่ทุกครั้งที่พิมพ์ (client-side ล้วนๆ ไม่ต้องรอ server) เพื่อให้เห็นกราฟขยับแบบ real-time
  // ใช้ข้อมูลรายปี (yearlyProjections) แค่สำหรับการ์ดสรุปตัวเลขปีสุดท้าย
  // ส่วนกราฟใช้ข้อมูลรายเดือน (chartData) เพื่อให้เส้นโค้งเนียนขึ้นและหาจุดตัดได้แม่นยำกว่า
  const yearlyProjections = useMemo(() => calculateProjection(planInput), [
    planInput.initial_amount,
    planInput.monthly_contribution,
    planInput.annual_return_rate,
    planInput.years,
  ])

  const chartData = useMemo(() => calculateMonthlyProjection(planInput), [
    planInput.initial_amount,
    planInput.monthly_contribution,
    planInput.annual_return_rate,
    planInput.years,
  ])

  // หาจุดตัดทั้งหมด ไม่ใช่แค่จุดแรก เผื่อเงื่อนไขที่เส้นสลับตำแหน่งกันมากกว่า 1 ครั้ง
  const crossoverPoints = useMemo(() => findCrossoverPoints(chartData), [chartData])
  const finalYear = yearlyProjections[yearlyProjections.length - 1]

  // ระยะเวลายิ่งยาว ยิ่งต้อง "group" ป้ายกำกับบนแกน X ให้ห่างขึ้น ไม่งั้นตัวเลขทับกันจนอ่านไม่ออก
  // (ระยะเวลา <=15 ปี โชว์ทุกปี, <=30 ปี โชว์ทีละ 2 ปี, มากกว่านั้นโชว์ทีละ 5 ปี — ข้อมูลกราฟยังละเอียดรายเดือนเหมือนเดิม
  // แค่ป้ายบนแกนที่ห่างขึ้น เส้นโค้งจึงยังคมชัดเหมือนเดิม ไม่ได้ทำให้กราฟหยาบลง)
  const yearTickStep = yearsNum > 30 ? 5 : yearsNum > 15 ? 2 : 1
  const yearTicks = useMemo(() => {
    const ticks: number[] = []
    for (let y = 0; y <= yearsNum; y += yearTickStep) ticks.push(y)
    if (ticks[ticks.length - 1] !== yearsNum) ticks.push(yearsNum)
    return ticks
  }, [yearsNum, yearTickStep])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      await saveInvestmentPlan(planInput)
      setSaveMessage('บันทึกแผนแล้ว')
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
          <span className="page-tab page-tab-active">การลงทุน</span>
          <Link href="/tax" className="page-tab">
            ภาษี
          </Link>
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
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 22, color: '#2b2b33' }}>เครื่องคำนวณการลงทุน</h1>
              <HelpTooltip title="วิธีใช้หน้าการลงทุน">
                <p style={{ margin: '0 0 8px' }}>
                  กรอกเงินต้นเริ่มต้น เงินลงทุนเพิ่มต่อเดือน อัตราผลตอบแทนต่อปีที่คาดหวัง และระยะเวลา
                  (ปี) ระบบจะคำนวณดอกเบี้ยทบต้นให้
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  กราฟมี 2 เส้น: เงินที่คุณลงทุนไปเอง (เงินต้นสะสม) กับดอกเบี้ย/ผลตอบแทนที่ทบต้นให้
                  (ดอกเบี้ยสะสม)
                </p>
                <p style={{ margin: 0 }}>
                  จุดสีแดงบนกราฟคือ <b>จุดตัด</b> — ปีที่ดอกเบี้ยสะสมเริ่มมากกว่าเงินที่คุณลงเอง อาจมี
                  มากกว่า 1 จุดได้ ตัวเลขทั้งหมดเป็นการประมาณการทางคณิตศาสตร์ ไม่ได้การันตีผลตอบแทนจริง
                </p>
              </HelpTooltip>
            </div>
            <p style={{ color: '#47474f', margin: '4px 0 0' }}>{userEmail}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            ออกจากระบบ
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#8a8a94', margin: '0 0 20px', lineHeight: 1.6 }}>
          ⚠️ นี่คือ<strong>การประมาณการ</strong>จากผลตอบแทนคงที่ที่คุณกำหนดเอง ไม่ใช่การพยากรณ์ผลตอบแทนจริง
          ตลาดจริงมีความผันผวนขึ้นลง ใช้เพื่อดูภาพรวมและวางแผนคร่าวๆ เท่านั้น
        </p>

        {/* ฟอร์มกรอกสมมติฐาน */}
        <form
          onSubmit={handleSave}
          style={{
            background: '#ffffff',
            border: '0.5px solid #ececE5',
            borderRadius: 14,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="form-field" style={{ flex: '1 1 200px', marginBottom: 12 }}>
              <label className="form-label">เงินต้นเริ่มต้น (บาท)</label>
              <input
                type="number"
                min="0"
                step="1000"
                className="form-input"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>
            <div className="form-field" style={{ flex: '1 1 200px', marginBottom: 12 }}>
              <label className="form-label">ลงทุนเพิ่มต่อเดือน (บาท)</label>
              <input
                type="number"
                min="0"
                step="100"
                className="form-input"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>
            <div className="form-field" style={{ flex: '1 1 160px', marginBottom: 12 }}>
              <label className="form-label">ผลตอบแทนคาดหวัง (% ต่อปี)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(e.target.value)}
              />
            </div>
            <div className="form-field" style={{ flex: '1 1 140px', marginBottom: 12 }}>
              <label className="form-label">ระยะเวลา (ปี)</label>
              <input
                type="number"
                min="1"
                max="50"
                className="form-input"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
              {/* เพดาน 50 ปีถูก clamp ไว้ในโค้ดอยู่แล้ว (yearsNum) แต่ถ้าไม่บอกผู้ใช้ พอพิมพ์เกินแล้วกราฟ
                  เงียบๆ ไม่ขยับตามที่พิมพ์ จะดูเหมือนแอปค้าง — ข้อความนี้เลยอธิบายไว้ตรงๆ */}
              <p style={{ margin: '6px 0 0', fontSize: 11, color: isYearsClamped ? '#e05555' : '#8a8a94', lineHeight: 1.5 }}>
                {isYearsClamped
                  ? `กรอกได้สูงสุด 50 ปี — ระบบปรับให้เป็น 50 ปีให้อัตโนมัติ`
                  : 'คำนวณให้ได้สูงสุด 50 ปี'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-gradient-primary"
              style={{ width: 'auto', padding: '9px 20px' }}
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึกแผน'}
            </button>
            {saveMessage && <span style={{ fontSize: 12, color: '#47474f' }}>{saveMessage}</span>}
          </div>
        </form>

        {/* การ์ดสรุปผลลัพธ์ปีสุดท้าย — โทนน้ำเงินให้ต่างจากรายจ่าย(ม่วง)/รายรับ(เขียว) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7cc4fa 0%, #4a90d9 55%, #3a75c4 100%)',
            borderRadius: 20,
            padding: '22px 24px',
            marginBottom: 16,
            color: '#ffffff',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            มูลค่าพอร์ตโดยประมาณ เมื่อครบปีที่ {finalYear.year}
          </p>
          <p style={{ margin: '6px 0 20px', fontSize: 34, fontWeight: 700 }}>
            ฿{finalYear.totalValue.toLocaleString()}
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                เงินที่ลงทุนไปเองทั้งหมด
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{finalYear.totalContributed.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                ดอกเบี้ย/ผลตอบแทนสะสม
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{finalYear.totalInterestEarned.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* จุดตัดที่น่าสนใจ: จุดที่เส้นดอกเบี้ยสะสมสลับตำแหน่งกับเส้นเงินลงทุนสะสม
            อาจมีได้มากกว่า 1 จุด (เช่น ผลตอบแทนติดลบช่วงหนึ่งแล้วกลับมาเป็นบวก) จึงลิสต์ทุกจุดที่เจอ
            เอาข้อความอธิบายไว้นอกกราฟ (ไม่ใช่ label ในตัว SVG) เพื่อไม่ให้ตัวอักษรถูกครอบตัดที่ขอบกราฟ */}
        {crossoverPoints.length > 0 ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #9fe1cb, #e1f5ee)',
              borderRadius: 14,
              padding: '14px 20px',
              marginBottom: 16,
              color: '#0f6e56',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {crossoverPoints.length === 1 ? (
              <>
                🎉 <strong>{formatYearLabel(crossoverPoints[0].year)}</strong> คือจุดตัดที่น่าสนใจ (จุดวงกลมสีแดงบนกราฟ)
                — ดอกเบี้ย/ผลตอบแทนที่งอกเงยขึ้นเอง เริ่มมากกว่าเงินที่คุณลงทุนไปเองแล้ว (เงินเริ่ม &quot;ทำงาน&quot; หนักกว่าคุณ)
              </>
            ) : (
              <>
                🎉 พบจุดตัดที่น่าสนใจ {crossoverPoints.length} จุด (จุดวงกลมสีแดงบนกราฟ): {' '}
                {crossoverPoints.map((p) => formatYearLabel(p.year)).join(', ')} — คือช่วงที่เส้นดอกเบี้ยสะสม
                สลับตำแหน่งขึ้นๆ ลงๆ กับเส้นเงินลงทุนสะสม
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              background: '#f5f4f0',
              borderRadius: 14,
              padding: '14px 20px',
              marginBottom: 16,
              color: '#47474f',
              fontSize: 13,
            }}
          >
            ภายใน {years} ปีนี้ ดอกเบี้ยยังไม่ทันเงินต้นที่ลงทุนเอง ลองเพิ่มผลตอบแทนคาดหวังหรือระยะเวลาดูได้
          </div>
        )}

        {/* กราฟเปรียบเทียบเงินลงทุนสะสม vs ดอกเบี้ยสะสม แบบ exponential */}
        <div
          style={{
            background: '#ffffff',
            border: '0.5px solid #ececE5',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#2b2b33' }}>
            เงินที่ลงทุนไปเอง เทียบกับ ดอกเบี้ย/ผลตอบแทนที่งอกเงย
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            {/* margin.top เผื่อพื้นที่ไว้เยอะหน่อย กันจุดวงกลมจุดตัด (ReferenceDot) ที่อยู่ใกล้ขอบบนโดนตัด
                XAxis type="number" (ไม่ใช่ category ที่เป็นค่า default) เพื่อให้ตำแหน่งจุดตัดที่เป็นเลขทศนิยม
                (เช่น ปีที่ 5.3) วางอยู่ตรงตำแหน่งจริงบนแกน ไม่ใช่แค่ปัดไปที่ช่องปีที่ใกล้ที่สุด */}
            <LineChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f0f5" />
              <XAxis
                dataKey="year"
                type="number"
                domain={[0, yearsNum]}
                ticks={yearTicks}
                tick={{ fontSize: 11 }}
                tickFormatter={(y: number) => `ปี ${y}`}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip
                formatter={(value: any) => `฿${Number(value).toLocaleString()}`}
                labelFormatter={(y: any) => formatYearLabel(Number(y))}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {crossoverPoints.map((cp, i) => (
                <ReferenceLine key={`line-${i}`} x={cp.year} stroke="#e05555" strokeDasharray="4 4" strokeOpacity={0.5} />
              ))}
              <Line
                type="monotone"
                dataKey="totalContributed"
                name="เงินที่ลงทุนไปเอง (สะสม)"
                stroke="#7f77dd"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="totalInterestEarned"
                name="ดอกเบี้ย/ผลตอบแทนสะสม"
                stroke="#4CAF80"
                strokeWidth={2.5}
                dot={false}
              />
              {/* จุดวงกลมสีแดง = ตำแหน่งจุดตัดจริง (แม่นยำกว่าเส้นแนวตั้งเฉยๆ เพราะระบุพิกัด x,y ตรงจุดตัดพอดี) */}
              {crossoverPoints.map((cp, i) => (
                <ReferenceDot
                  key={`dot-${i}`}
                  x={cp.year}
                  y={cp.value}
                  r={6}
                  fill="#e05555"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
