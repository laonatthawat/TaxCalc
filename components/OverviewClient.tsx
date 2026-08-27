'use client'

import Link from 'next/link'
import { Receipt, Wallet2, TrendingUp, Landmark, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import { signOut } from '@/app/dashboard/actions'

type Props = {
  userEmail: string
  hasExpenseData: boolean
  monthlyExpense: number
  hasIncomeData: boolean
  monthlyIncome: number
  annualIncomeEstimate: number
  hasInvestmentPlan: boolean
  investmentFinalValue: number | null
  investmentYears: number | null
  estimatedTax: number
  effectiveTaxRate: number
}

// การ์ดสรุปของแต่ละโมดูล — โครงเดียวกันหมด ต่างกันแค่เนื้อหา/สี ให้ดูเป็นชุดเดียวกัน
function ModuleCard({
  icon: Icon,
  gradient,
  title,
  headline,
  subtext,
  href,
}: {
  icon: React.ElementType
  gradient: string
  title: string
  headline: string
  subtext: string
  href: string
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        background: '#f9f4ed',
        border: '0.5px solid #dcd3c4',
        borderRadius: 28,
        padding: '20px 20px 18px',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Icon size={19} color="#f9f4ed" />
      </div>
      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#645c50' }}>{title}</p>
      <p style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#201e1d' }}>{headline}</p>
      <p style={{ margin: '0 0 14px', fontSize: 12.5, color: '#82796a', lineHeight: 1.6 }}>{subtext}</p>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12.5,
          fontWeight: 600,
          color: '#8c491a',
        }}
      >
        ดูรายละเอียด <ArrowRight size={13} />
      </span>
    </Link>
  )
}

export default function OverviewClient({
  userEmail,
  hasExpenseData,
  monthlyExpense,
  hasIncomeData,
  monthlyIncome,
  annualIncomeEstimate,
  hasInvestmentPlan,
  investmentFinalValue,
  investmentYears,
  estimatedTax,
  effectiveTaxRate,
}: Props) {
  const handleLogout = async () => {
    await signOut()
  }

  const netCashflow = monthlyIncome - monthlyExpense
  const isPositiveCashflow = netCashflow >= 0

  const baht = (n: number) => `฿${Math.round(n).toLocaleString()}`

  return (
    <div className="dashboard-page">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Logo />
        </div>

        {/* แท็บที่ 5 ต่อจากเดิม — ไม่เปลี่ยนหน้า default หลัง login (ยังเป็น /dashboard เหมือนเดิม) */}
        <div className="page-tabs">
          <Link href="/dashboard" className="page-tab">
            รายจ่าย
          </Link>
          <Link href="/income" className="page-tab">
            รายรับ
          </Link>
          <Link href="/investments" className="page-tab">
            การลงทุน
          </Link>
          <Link href="/tax" className="page-tab">
            ภาษี
          </Link>
          <span className="page-tab page-tab-active">ภาพรวม</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: 20,
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 22, color: '#201e1d' }}>ภาพรวมการเงินของคุณ</h1>
            <p style={{ color: '#474238', margin: '4px 0 0' }}>{userEmail}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            ออกจากระบบ
          </button>
        </div>

        {/* การ์ดกระแสเงินสดสุทธิ — สรุปเบื้องต้นว่ารายรับประจำหักรายจ่ายประจำต่อเดือนแล้วเหลือ/ขาดเท่าไหร่ */}
        <div
          style={{
            background: isPositiveCashflow
              ? 'linear-gradient(135deg, #e1eecc, #7a8a5e)'
              : 'linear-gradient(135deg, #e0a58f, #8a3a22)',
            borderRadius: 28,
            padding: '22px 24px',
            marginBottom: 20,
            color: '#f9f4ed',
          }}
        >
          <p style={{ margin: '0 0 6px', fontSize: 13, opacity: 0.9 }}>
            กระแสเงินสดสุทธิต่อเดือน (รายรับประจำ − รายจ่ายประจำ)
          </p>
          <p style={{ margin: '0 0 10px', fontSize: 30, fontWeight: 700 }}>
            {isPositiveCashflow ? '+' : ''}
            {baht(netCashflow)} / เดือน
          </p>
          <p style={{ margin: 0, fontSize: 12.5, opacity: 0.9 }}>
            รายรับประจำ {baht(monthlyIncome)} − รายจ่ายประจำ {baht(monthlyExpense)}
          </p>
        </div>

        {/* การ์ดสรุปแต่ละโมดูล — ตัวเลขหลัก + ลิงก์ไปหน้านั้นๆ เพื่อดูรายละเอียดเต็มๆ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 24,
          }}
        >
          <ModuleCard
            icon={Receipt}
            gradient="linear-gradient(135deg, #d67f48, #c67139)"
            title="รายจ่ายประจำ"
            href="/dashboard"
            headline={hasExpenseData ? `${baht(monthlyExpense)}/เดือน` : 'ยังไม่มีข้อมูล'}
            subtext={
              hasExpenseData
                ? `ประมาณ ${baht(monthlyExpense * 12)} ต่อปี`
                : 'เริ่มเพิ่มรายจ่ายประจำได้ที่หน้านี้'
            }
          />

          <ModuleCard
            icon={Wallet2}
            gradient="linear-gradient(135deg, #e1eecc, #7a8a5e)"
            title="รายรับ"
            href="/income"
            headline={hasIncomeData ? `${baht(monthlyIncome)}/เดือน` : 'ยังไม่มีข้อมูล'}
            subtext={
              hasIncomeData
                ? `ประมาณการรวมทั้งปี ${baht(annualIncomeEstimate)}`
                : 'เริ่มเพิ่มรายรับได้ที่หน้านี้'
            }
          />

          <ModuleCard
            icon={TrendingUp}
            gradient="linear-gradient(135deg, #f6a06b, #8c491a)"
            title="การลงทุน"
            href="/investments"
            headline={
              hasInvestmentPlan && investmentFinalValue !== null
                ? baht(investmentFinalValue)
                : 'ยังไม่ได้ตั้งแผน'
            }
            subtext={
              hasInvestmentPlan
                ? `มูลค่าพอร์ตโดยประมาณเมื่อครบ ${investmentYears} ปี`
                : 'ลองตั้งแผนดูว่าเงินจะโตไปเท่าไหร่'
            }
          />

          <ModuleCard
            icon={Landmark}
            gradient="linear-gradient(135deg, #645c50, #2e2b25)"
            title="ภาษี"
            href="/tax"
            headline={hasIncomeData ? `${baht(estimatedTax)}/ปี` : 'ยังไม่มีข้อมูล'}
            subtext={
              hasIncomeData
                ? `อัตราภาษีเฉลี่ยประมาณ ${effectiveTaxRate.toFixed(1)}%`
                : 'ต้องมีข้อมูลรายรับก่อนถึงประมาณการได้'
            }
          />
        </div>

        <p style={{ fontSize: 11, color: '#a19786', lineHeight: 1.6, marginBottom: 40 }}>
          ตัวเลขในหน้านี้เป็นการประมาณการจากข้อมูลที่คุณกรอกไว้ในแต่ละหน้าเท่านั้น ไม่ใช่คำแนะนำทาง
          การเงิน/ภาษีอย่างเป็นทางการ กดที่การ์ดแต่ละอันเพื่อดูรายละเอียดและแก้ไขข้อมูลได้
        </p>
      </div>
    </div>
  )
}
