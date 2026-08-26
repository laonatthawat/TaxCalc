'use client'

import Link from 'next/link'
import { Plus, Calendar, Wallet2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import CatMascot from './CatMascot'
import IncomeModal from './IncomeModal'
import HelpTooltip from './HelpTooltip'
import { deleteIncome, markIncomeAsReceived } from '@/app/income/actions'
import { signOut } from '@/app/dashboard/actions'
import {
  Income,
  calculateIncomeTotals,
  splitAndSortIncomes,
  getIncomeTypeLabel,
  formatDaysUntilIncome,
} from '@/lib/incomeUtils'
import { getDaysUntilRenewal } from '@/lib/subscriptionUtils'

type Props = {
  initialIncomes: Income[]
  userEmail: string
}

export default function IncomeClient({ initialIncomes, userEmail }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [markingReceivedId, setMarkingReceivedId] = useState<string | null>(null)
  const router = useRouter()

  const { recurring, oneTime } = splitAndSortIncomes(initialIncomes)
  const { totalMonthlyRecurring, totalOneTimeThisYear, totalAnnualEstimate } =
    calculateIncomeTotals(initialIncomes)

  const openAddModal = () => {
    setEditingIncome(null)
    setIsModalOpen(true)
  }

  const openEditModal = (income: Income) => {
    setEditingIncome(income)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('ยืนยันลบรายการนี้?')
    if (!confirmed) return

    await deleteIncome(id)
    router.refresh()
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleMarkAsReceived = async (id: string) => {
    setMarkingReceivedId(id)
    try {
      await markIncomeAsReceived(id)
      router.refresh()
    } finally {
      setMarkingReceivedId(null)
    }
  }

  return (
    <div className="dashboard-page">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Logo />
        </div>

        {/* แท็บสลับไปหน้ารายจ่าย/รายรับ — ใช้ next/link เพื่อสลับหน้าแบบ SPA ไม่ต้อง reload เต็มหน้า */}
        <div className="page-tabs">
          <Link href="/dashboard" className="page-tab">
            รายจ่าย
          </Link>
          <span className="page-tab page-tab-active">รายรับ</span>
          <Link href="/investments" className="page-tab">
            การลงทุน
          </Link>
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
              <h1 style={{ margin: 0, fontSize: 22, color: '#2b2b33' }}>รายรับของคุณ</h1>
              <HelpTooltip title="วิธีใช้หน้ารายรับ">
                <p style={{ margin: '0 0 8px' }}>
                  แบ่งเป็น <b>รายรับประจำ</b> (recurring เช่น เงินเดือน) กับ <b>ครั้งเดียว</b> (one-time
                  เช่น โบนัส งาน freelance)
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  ตอนเพิ่มรายรับต้องเลือก &quot;ประเภทเงินได้ตามมาตรา 40&quot; เพื่อให้หน้าภาษีคำนวณ
                  ค่าใช้จ่ายหักได้ถูกหมวด
                </p>
                <p style={{ margin: 0 }}>
                  ประเภท &quot;เงินให้&quot; (จากพ่อแม่/คู่สมรส) นับเป็นรายรับในหน้านี้ แต่จะไม่ถูกนำไป
                  คำนวณภาษี เพราะกฎหมายยกเว้นให้
                </p>
              </HelpTooltip>
            </div>
            <p style={{ color: '#47474f', margin: '4px 0 0' }}>{userEmail}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={openAddModal}
              className="btn-gradient-primary"
              style={{
                width: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
              }}
            >
              <Plus size={16} /> เพิ่มรายรับ
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* การ์ดสรุปรายรับ — โทนเขียวเพื่อให้ต่างจากการ์ดรายจ่าย (โทนม่วง) ให้แยกความหมายได้ทันทีที่มอง */}
        <div
          style={{
            background: 'linear-gradient(135deg, #6fd1af 0%, #4CAF80 55%, #2f9d6b 100%)',
            borderRadius: 20,
            padding: '22px 24px',
            marginBottom: 28,
            color: '#ffffff',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            รายรับประจำต่อเดือน
          </p>
          <p style={{ margin: '6px 0 20px', fontSize: 34, fontWeight: 700 }}>
            ฿{totalMonthlyRecurring.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                รายรับพิเศษปีนี้ (ครั้งเดียว)
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{totalOneTimeThisYear.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                ประมาณการรายรับทั้งปี
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{totalAnnualEstimate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {initialIncomes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '56px 24px',
              background: '#ffffff',
              borderRadius: 14,
              border: '0.5px solid #ececE5',
            }}
          >
            <div style={{ margin: '0 auto 8px', display: 'flex', justifyContent: 'center' }}>
              <CatMascot size={110} variant="cream" />
            </div>
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: '#2b2b33' }}>ยังไม่มีรายรับเลย</p>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#47474f' }}>
              เริ่มเพิ่มรายรับแรกของคุณ ไม่ว่าจะเป็นเงินเดือนหรือรายได้พิเศษ
            </p>
            <button
              onClick={openAddModal}
              className="btn-gradient-primary"
              style={{
                width: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
              }}
            >
              <Plus size={16} /> เพิ่มรายรับ
            </button>
          </div>
        ) : (
          <>
            {recurring.length > 0 && (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2b2b33', margin: '0 0 14px' }}>
                  รายรับประจำ
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                    marginBottom: 32,
                  }}
                >
                  {recurring.map((income) => {
                    const daysUntil = getDaysUntilRenewal(income.next_payment_date!)

                    return (
                      <div
                        key={income.id}
                        style={{
                          background: 'white',
                          border: '0.5px solid #e5e5e5',
                          borderRadius: 14,
                          padding: '1.25rem 1.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #9fe1cb, #4CAF80)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Wallet2 size={19} color="#ffffff" />
                          </div>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: '#2b2b33' }}>
                              {income.name}
                            </p>
                            <p style={{ fontSize: 12, color: '#47474f', margin: 0 }}>
                              {getIncomeTypeLabel(income.income_type)}
                            </p>
                          </div>
                        </div>

                        <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: '#2b2b33' }}>
                          ฿{income.amount.toLocaleString()}
                          <span style={{ fontSize: 12, fontWeight: 400, color: '#47474f' }}>
                            {' '}
                            /{income.billing_cycle === 'monthly' ? 'เดือน' : 'ปี'}
                          </span>
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            margin: '8px 0 14px',
                          }}
                        >
                          <p
                            style={{
                              fontSize: 12,
                              color: '#47474f',
                              margin: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Calendar size={13} />{' '}
                            {new Date(income.next_payment_date!).toLocaleDateString('th-TH')}
                          </p>
                          <span className="renewal-badge renewal-badge-normal">
                            {formatDaysUntilIncome(daysUntil)}
                          </span>
                        </div>

                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            color: '#47474f',
                            margin: '0 0 12px',
                            cursor: markingReceivedId === income.id ? 'wait' : 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={markingReceivedId === income.id}
                            disabled={markingReceivedId === income.id}
                            onChange={() => handleMarkAsReceived(income.id)}
                            style={{ width: 16, height: 16, accentColor: '#4CAF80', cursor: 'inherit' }}
                          />
                          {markingReceivedId === income.id ? 'กำลังบันทึก...' : 'รับแล้ว (เลื่อนรอบถัดไป)'}
                        </label>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => openEditModal(income)}
                            className="btn-secondary"
                            style={{ flex: 1, fontSize: 13, padding: 7 }}
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(income.id)}
                            className="btn-secondary-danger"
                            style={{ flex: 1, fontSize: 13 }}
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {oneTime.length > 0 && (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2b2b33', margin: '0 0 14px' }}>
                  รายรับที่ได้รับแล้ว (ครั้งเดียว)
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}
                >
                  {oneTime.map((income) => (
                    <div
                      key={income.id}
                      style={{
                        background: 'white',
                        border: '0.5px solid #e5e5e5',
                        borderRadius: 14,
                        padding: '1.25rem 1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9fe1cb, #4CAF80)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Wallet2 size={19} color="#ffffff" />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: '#2b2b33' }}>
                            {income.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#47474f', margin: 0 }}>
                            {getIncomeTypeLabel(income.income_type)}
                          </p>
                        </div>
                      </div>

                      <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: '#2b2b33' }}>
                        ฿{income.amount.toLocaleString()}
                      </p>

                      <p
                        style={{
                          fontSize: 12,
                          color: '#47474f',
                          margin: '8px 0 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Calendar size={13} /> ได้รับเมื่อ{' '}
                        {new Date(income.received_date!).toLocaleDateString('th-TH')}
                      </p>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openEditModal(income)}
                          className="btn-secondary"
                          style={{ flex: 1, fontSize: 13, padding: 7 }}
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          className="btn-secondary-danger"
                          style={{ flex: 1, fontSize: 13 }}
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <IncomeModal isOpen={isModalOpen} onClose={closeModal} editingIncome={editingIncome} />
      </div>
    </div>
  )
}
