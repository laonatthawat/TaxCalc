'use client'

import Link from 'next/link'
import { Plus, Calendar, Wallet2, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import CatMascot from './CatMascot'
import IncomeModal from './IncomeModal'
import HelpTooltip from './HelpTooltip'
import ConfirmDialog from './ConfirmDialog'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null)
  const router = useRouter()

  const { recurring, oneTime } = splitAndSortIncomes(initialIncomes)
  const { totalMonthlyRecurring, totalOneTimeThisYear, totalAnnualEstimate } =
    calculateIncomeTotals(initialIncomes)

  // ค้นหาด้วยชื่อรายการ หรือประเภทเงินได้ — ใช้ query เดียวกันกรองทั้ง 2 ลิสต์ (ประจำ/ครั้งเดียว)
  // ยอดสรุปการ์ดสีเขียวด้านบนยังคงคำนวณจาก initialIncomes ทั้งหมดเสมอ ไม่ผูกกับคำค้นหา
  const query = searchQuery.trim().toLowerCase()
  const matchesQuery = (income: Income) =>
    income.name.toLowerCase().includes(query) || getIncomeTypeLabel(income.income_type).toLowerCase().includes(query)
  const visibleRecurring = query ? recurring.filter(matchesQuery) : recurring
  const visibleOneTime = query ? oneTime.filter(matchesQuery) : oneTime

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

  // เปิดกล่องยืนยันแบบมีธีมของแอปเองแทน window.confirm() ของ browser — ใส่ชื่อรายการในข้อความได้ด้วย
  const requestDelete = (income: Income) => setDeleteTarget(income)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await deleteIncome(deleteTarget.id)
    setDeleteTarget(null)
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
              <h1 style={{ margin: 0, fontSize: 22, color: '#201e1d' }}>รายรับของคุณ</h1>
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
            <p style={{ color: '#474238', margin: '4px 0 0' }}>{userEmail}</p>
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
            background: 'linear-gradient(135deg, #8fa073 0%, #7a8a5e 55%, #56633f 100%)',
            borderRadius: 28,
            padding: '22px 24px',
            marginBottom: 28,
            color: '#f9f4ed',
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
              background: '#f9f4ed',
              borderRadius: 28,
              border: '0.5px solid #dcd3c4',
            }}
          >
            <div style={{ margin: '0 auto 8px', display: 'flex', justifyContent: 'center' }}>
              <CatMascot size={110} variant="cream" />
            </div>
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: '#201e1d' }}>ยังไม่มีรายรับเลย</p>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#474238' }}>
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
            {/* ค้นหาด้วยชื่อรายการหรือประเภทเงินได้ — กรองทั้งลิสต์ประจำและครั้งเดียวพร้อมกัน */}
            <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
              <Search
                size={15}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a19786' }}
              />
              <input
                type="text"
                placeholder="ค้นหาชื่อหรือประเภทเงินได้..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: 999,
                  border: '1px solid #dcd3c4',
                  fontSize: 13,
                  background: '#f9f4ed',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {visibleRecurring.length === 0 && visibleOneTime.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 24px',
                  background: '#f9f4ed',
                  borderRadius: 28,
                  border: '0.5px solid #dcd3c4',
                  color: '#474238',
                  fontSize: 13,
                }}
              >
                ไม่พบรายการที่ตรงกับ &quot;{searchQuery}&quot;
              </div>
            ) : (
              <>
            {visibleRecurring.length > 0 && (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#201e1d', margin: '0 0 14px' }}>
                  รายรับประจำ{' '}
                  <span style={{ fontWeight: 400, color: '#82796a', fontSize: 13 }}>
                    ({visibleRecurring.length} รายการ)
                  </span>
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                    marginBottom: 32,
                  }}
                >
                  {visibleRecurring.map((income) => {
                    const daysUntil = getDaysUntilRenewal(income.next_payment_date!)

                    return (
                      <div
                        key={income.id}
                        style={{
                          background: '#f9f4ed',
                          border: '0.5px solid #dcd3c4',
                          borderRadius: 28,
                          padding: '1.25rem 1.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #e1eecc, #7a8a5e)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Wallet2 size={19} color="#f9f4ed" />
                          </div>
                          <div>
                            <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: '#201e1d' }}>
                              {income.name}
                            </p>
                            <p style={{ fontSize: 12, color: '#474238', margin: 0 }}>
                              {getIncomeTypeLabel(income.income_type)}
                            </p>
                          </div>
                        </div>

                        <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: '#201e1d' }}>
                          ฿{income.amount.toLocaleString()}
                          <span style={{ fontSize: 12, fontWeight: 400, color: '#474238' }}>
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
                              color: '#474238',
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
                            color: '#474238',
                            margin: '0 0 12px',
                            cursor: markingReceivedId === income.id ? 'wait' : 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={markingReceivedId === income.id}
                            disabled={markingReceivedId === income.id}
                            onChange={() => handleMarkAsReceived(income.id)}
                            style={{ width: 16, height: 16, accentColor: '#7a8a5e', cursor: 'inherit' }}
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
                            onClick={() => requestDelete(income)}
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

            {visibleOneTime.length > 0 && (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#201e1d', margin: '0 0 14px' }}>
                  รายรับที่ได้รับแล้ว (ครั้งเดียว){' '}
                  <span style={{ fontWeight: 400, color: '#82796a', fontSize: 13 }}>
                    ({visibleOneTime.length} รายการ)
                  </span>
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}
                >
                  {visibleOneTime.map((income) => (
                    <div
                      key={income.id}
                      style={{
                        background: '#f9f4ed',
                        border: '0.5px solid #dcd3c4',
                        borderRadius: 28,
                        padding: '1.25rem 1.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e1eecc, #7a8a5e)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Wallet2 size={19} color="#f9f4ed" />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: '#201e1d' }}>
                            {income.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#474238', margin: 0 }}>
                            {getIncomeTypeLabel(income.income_type)}
                          </p>
                        </div>
                      </div>

                      <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: '#201e1d' }}>
                        ฿{income.amount.toLocaleString()}
                      </p>

                      <p
                        style={{
                          fontSize: 12,
                          color: '#474238',
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
                          onClick={() => requestDelete(income)}
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
          </>
        )}

        <IncomeModal isOpen={isModalOpen} onClose={closeModal} editingIncome={editingIncome} />

        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="ยืนยันลบรายการ"
          message={`ต้องการลบ "${deleteTarget?.name}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </div>
  )
}
