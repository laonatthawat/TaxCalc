'use client'

import {
  Plus,
  Calendar,
  Search,
  Briefcase,
  Laptop,
  FileText,
  PiggyBank,
  KeyRound,
  Stethoscope,
  Hammer,
  Store,
  Gift,
  Wallet2,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CatMascot from './CatMascot'
import IncomeModal from './IncomeModal'
import HelpTooltip from './HelpTooltip'
import ConfirmDialog from './ConfirmDialog'
import { deleteIncome, markIncomeAsReceived } from '@/app/income/actions'
import {
  Income,
  INCOME_TYPES,
  calculateIncomeTotals,
  splitAndSortIncomes,
  getIncomeTypeMeta,
  getIncomeTypeLabel,
  subLabelOf,
  toAnnualAmount,
  formatDaysUntilIncome,
} from '@/lib/incomeUtils'

type Props = {
  initialIncomes: Income[]
  userEmail: string
}

const ICONS: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  laptop: Laptop,
  'file-text': FileText,
  'piggy-bank': PiggyBank,
  'key-round': KeyRound,
  stethoscope: Stethoscope,
  hammer: Hammer,
  store: Store,
  gift: Gift,
}

// วันนี้เทียบกับวันที่จะได้รับเงินครั้งถัดไป — ใช้ตรงสถานะ badge ของการ์ดรายรับประจำ
function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export default function IncomeClient({ initialIncomes }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [markingReceivedId, setMarkingReceivedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null)
  const router = useRouter()

  const { recurring, oneTime } = splitAndSortIncomes(initialIncomes)
  const { totalMonthlyRecurring, totalOneTimeThisYear, totalAnnualEstimate } =
    calculateIncomeTotals(initialIncomes)

  // เงินได้ที่ต้องเสียภาษี = รายรับทั้งปี ลบ "เงินให้" ที่ได้รับยกเว้นตามมาตรา 42 — โชว์ให้เห็นตั้งแต่หน้ารายรับ
  const exemptGiftTotal = initialIncomes
    .filter((i) => i.income_type === 'gift')
    .reduce((sum, i) => sum + toAnnualAmount(i), 0)
  const taxableTotal = totalAnnualEstimate - exemptGiftTotal

  // แจกแจงรายรับทั้งปีตามประเภทเงินได้ (มาตรา 40) เพื่อโชว์เป็นแท่ง breakdown บนหน้ารายรับ
  const typeRows = INCOME_TYPES.map((t) => {
    const total = initialIncomes
      .filter((i) => i.income_type === t.value)
      .reduce((sum, i) => sum + toAnnualAmount(i), 0)
    return { type: t, total }
  }).filter((r) => r.total > 0)
  const maxTypeTotal = Math.max(1, ...typeRows.map((r) => r.total))

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

  const requestDelete = (income: Income) => setDeleteTarget(income)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await deleteIncome(deleteTarget.id)
    setDeleteTarget(null)
    router.refresh()
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

  const renderCard = (income: Income, kind: 'recurring' | 'oneTime') => {
    const typeMeta = getIncomeTypeMeta(income.income_type)
    const Icon = ICONS[typeMeta.icon] ?? Wallet2
    const subLabel = typeMeta.subs ? subLabelOf(income.income_type, income.income_sub) : null

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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
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
            <Icon size={19} color="#f9f4ed" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: '#201e1d' }}>{income.name}</p>
            <p style={{ fontSize: 12, color: '#474238', margin: 0 }}>
              {typeMeta.shortLabel}
              {subLabel ? ` · ${subLabel}` : ''}
            </p>
          </div>
          <span
            style={{
              padding: '5px 10px',
              borderRadius: 999,
              background: kind === 'recurring' ? '#e6ecd6' : '#f2e0cb',
              font: '600 11px/1.3 "IBM Plex Sans Thai",sans-serif',
              color: kind === 'recurring' ? '#4e5640' : '#8c491a',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {kind === 'recurring' ? 'ประจำ' : 'ครั้งเดียว'}
          </span>
        </div>

        <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: '#201e1d' }}>
          <span style={{ fontFamily: 'var(--font-number)' }}>฿{fmt(income.amount)}</span>
          {kind === 'recurring' && (
            <span style={{ fontSize: 12, fontWeight: 400, color: '#474238' }}>
              {' '}
              /
              {income.billing_cycle === 'monthly'
                ? 'เดือน'
                : income.billing_cycle === 'quarterly'
                  ? '3 เดือน'
                  : income.billing_cycle === 'biannual'
                    ? '6 เดือน'
                    : 'ปี'}
            </span>
          )}
        </p>

        {kind === 'recurring' ? (
          <>
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
                <Calendar size={13} /> {new Date(income.next_payment_date!).toLocaleDateString('th-TH')}
              </p>
              <span className="renewal-badge renewal-badge-normal">
                {formatDaysUntilIncome(daysUntil(income.next_payment_date!))}
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
          </>
        ) : (
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
            <Calendar size={13} /> ได้รับเมื่อ {new Date(income.received_date!).toLocaleDateString('th-TH')}
          </p>
        )}

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
  }

  return (
    <div className="dashboard-page">
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 0' }}>
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
                  ค่าใช้จ่ายหักได้ถูกหมวด (บางประเภทมีลักษณะย่อยที่อัตราต่างกันด้วย)
                </p>
                <p style={{ margin: 0 }}>
                  ประเภท &quot;เงินให้&quot; (จากพ่อแม่/คู่สมรส) นับเป็นรายรับในหน้านี้ แต่จะไม่ถูกนำไป
                  คำนวณภาษี เพราะกฎหมายยกเว้นให้
                </p>
              </HelpTooltip>
            </div>
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
          </div>
        </div>

        {/* hero การ์ดสรุป — 4 สถิติหลัก ให้เห็นภาพรวมทั้งปีตั้งแต่มองครั้งแรก */}
        <div
          style={{
            background: 'linear-gradient(135deg, #8fa073 0%, #7a8a5e 55%, #4f5b3c 100%)',
            borderRadius: 28,
            padding: '22px 24px',
            marginBottom: 28,
            color: '#f9f4ed',
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            ประมาณการรายรับทั้งปี
          </p>
          <p style={{ margin: '6px 0 20px', fontSize: 34, fontWeight: 700, fontFamily: 'var(--font-number)' }}>
            ฿{fmt(totalAnnualEstimate)}
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>ประจำ/เดือน</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-number)' }}>
                ฿{fmt(totalMonthlyRecurring)}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>ครั้งเดียวปีนี้</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-number)' }}>
                ฿{fmt(totalOneTimeThisYear)}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>ต้องเสียภาษี</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-number)' }}>
                ฿{fmt(taxableTotal)}
              </p>
            </div>
          </div>
        </div>

        {typeRows.length > 0 && (
          <div
            style={{
              background: '#f9f4ed',
              border: '0.5px solid #dcd3c4',
              borderRadius: 28,
              padding: '18px 22px',
              marginBottom: 28,
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 14, fontWeight: 600, color: '#201e1d' }}>
              แจกแจงตามประเภทเงินได้ (มาตรา <span style={{ fontFamily: 'var(--font-number)' }}>40</span>)
            </h3>
            {typeRows.map(({ type, total }) => {
              const Icon = ICONS[type.icon] ?? Wallet2
              return (
                <div key={type.value} style={{ margin: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#474238' }}>
                      <Icon size={13} /> {type.shortLabel}
                    </span>
                    <span style={{ color: '#201e1d', fontWeight: 600, fontFamily: 'var(--font-number)' }}>
                      ฿{fmt(total)}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: '#ebddc5' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(4, (total / maxTypeTotal) * 100)}%`,
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #7a8a5e, #56633f)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
                      {visibleRecurring.map((income) => renderCard(income, 'recurring'))}
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
                      {visibleOneTime.map((income) => renderCard(income, 'oneTime'))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        <IncomeModal
          key={isModalOpen ? (editingIncome?.id ?? 'new') : 'closed'}
          isOpen={isModalOpen}
          onClose={closeModal}
          editingIncome={editingIncome}
        />

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
