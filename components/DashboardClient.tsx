'use client'

import Link from 'next/link'
import { Plus, Calendar } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categoryStyles'
import { sortByNextBilling, getDaysUntilRenewal, formatDaysUntilRenewal } from '@/lib/subscriptionUtils'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import CatMascot from './CatMascot'
import SubscriptionModal from './SubscriptionModal'
import SummaryDashboard from './SummaryDashboard'
import { deleteSubscription, markSubscriptionAsPaid, signOut } from '@/app/dashboard/actions'

type Subscription = {
  id: string
  name: string
  price: number
  billing_cycle: string
  next_billing_date: string
  category: string | null
}

type Props = {
  initialSubscriptions: Subscription[]
  userEmail: string
  monthlyBudget: number | null
  monthlyIncome: number
}

// จำนวนวันที่ถือว่า "ใกล้ต่ออายุ" แล้วให้ badge เปลี่ยนเป็นสีเตือน
const URGENT_RENEWAL_DAYS = 3

export default function DashboardClient({
  initialSubscriptions,
  userEmail,
  monthlyBudget,
  monthlyIncome,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null)
  const router = useRouter()

  // เรียงตามวันต่ออายุที่ใกล้ที่สุดก่อน จะได้เห็นอันที่ต้องจ่ายเร็วๆ นี้ก่อน
  const subscriptions = sortByNextBilling(initialSubscriptions)

  const openAddModal = () => {
    setEditingSubscription(null)
    setIsModalOpen(true)
  }

  const openEditModal = (sub: Subscription) => {
    setEditingSubscription(sub)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    router.refresh() // ดึงข้อมูลใหม่จาก server หลังบันทึกเสร็จ
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('ยืนยันลบรายการนี้?')
    if (!confirmed) return

    await deleteSubscription(id)
    router.refresh()
  }

  const handleLogout = async () => {
    await signOut()
  }

  // checkbox "จ่ายแล้ว": เลื่อนวันครบกำหนดของรายการนี้ไปรอบถัดไปเลย (ดูฟังก์ชัน markSubscriptionAsPaid)
  // ไม่ได้เก็บสถานะ "จ่ายแล้ว/ยัง" ค้างไว้ เพราะพอเลื่อนรอบใหม่แล้วก็ถือว่ายังไม่จ่ายของรอบใหม่อยู่ดี
  const handleMarkAsPaid = async (id: string) => {
    setMarkingPaidId(id)
    try {
      await markSubscriptionAsPaid(id)
      router.refresh()
    } finally {
      setMarkingPaidId(null)
    }
  }

  return (
    // ใช้ gradient พื้นหลังเดียวกับหน้า login/signup (.dashboard-page) ให้ธีมเข้ากันทั้งแอป
    <div className="dashboard-page">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Logo />
        </div>

        {/* แท็บสลับไปหน้ารายรับ/รายจ่าย — ใช้ next/link เพื่อสลับหน้าแบบ SPA ไม่ต้อง reload เต็มหน้า */}
        <div className="page-tabs">
          <span className="page-tab page-tab-active">รายจ่าย</span>
          <Link href="/income" className="page-tab">
            รายรับ
          </Link>
          <Link href="/investments" className="page-tab">
            การลงทุน
          </Link>
          <Link href="/tax" className="page-tab">
            ภาษี
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
            <h1 style={{ margin: 0, fontSize: 22, color: '#2b2b33' }}>สวัสดี 👋</h1>
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
              <Plus size={16} /> เพิ่มรายจ่าย
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              ออกจากระบบ
            </button>
          </div>
        </div>

        <SummaryDashboard
          subscriptions={subscriptions}
          monthlyBudget={monthlyBudget}
          monthlyIncome={monthlyIncome}
        />

        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2b2b33', margin: '0 0 14px' }}>
          รายการรายจ่ายประจำ
        </h2>

        {subscriptions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '56px 24px',
              background: '#ffffff',
              borderRadius: 14,
              border: '0.5px solid #ececE5',
            }}
          >
            {/* แมวมาสคอตนั่งเฉาๆ แทนไอคอนวงกลมเดิม — สื่อว่า "ยังไม่มีอะไรให้ดูเลย" น่ารักกว่าเดิม */}
            <div style={{ margin: '0 auto 8px', display: 'flex', justifyContent: 'center' }}>
              <CatMascot size={110} />
            </div>
            <p style={{ margin: '0 0 4px', fontWeight: 500, color: '#2b2b33' }}>
              ยังไม่มีรายจ่ายประจำเลย
            </p>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#47474f' }}>
              เริ่มเพิ่มรายจ่ายประจำแรกของคุณเพื่อเริ่มติดตามค่าใช้จ่าย
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
              <Plus size={16} /> เพิ่มรายจ่าย
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {subscriptions.map((sub) => {
              const theme = getCategoryStyle(sub.category)
              const Icon = theme.icon
              const daysUntil = getDaysUntilRenewal(sub.next_billing_date)
              const isUrgent = daysUntil <= URGENT_RENEWAL_DAYS

              return (
                <div
                  key={sub.id}
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
                        background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={19} color={theme.iconColor} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: '#2b2b33' }}>{sub.name}</p>
                      {sub.category && (
                        <p style={{ fontSize: 12, color: '#47474f', margin: 0 }}>{sub.category}</p>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: '#2b2b33' }}>
                    ฿{sub.price.toLocaleString()}
                    <span style={{ fontSize: 12, fontWeight: 400, color: '#47474f' }}>
                      {' '}
                      /{sub.billing_cycle === 'monthly' ? 'เดือน' : 'ปี'}
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
                      {new Date(sub.next_billing_date).toLocaleDateString('th-TH')}
                    </p>
                    <span
                      className={`renewal-badge ${isUrgent ? 'renewal-badge-urgent' : 'renewal-badge-normal'}`}
                    >
                      {formatDaysUntilRenewal(daysUntil)}
                    </span>
                  </div>

                  {/* checkbox จ่ายแล้ว: กดแล้วเลื่อนวันครบกำหนดไปรอบถัดไปให้อัตโนมัติ
                      (ไม่ค้างสถานะติ๊กไว้ เพราะรอบใหม่ก็ถือว่ายังไม่จ่ายอยู่ดี) */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      color: '#47474f',
                      margin: '0 0 12px',
                      cursor: markingPaidId === sub.id ? 'wait' : 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={markingPaidId === sub.id}
                      disabled={markingPaidId === sub.id}
                      onChange={() => handleMarkAsPaid(sub.id)}
                      style={{ width: 16, height: 16, accentColor: '#7F77DD', cursor: 'inherit' }}
                    />
                    {markingPaidId === sub.id ? 'กำลังบันทึก...' : 'จ่ายแล้ว (เลื่อนรอบถัดไป)'}
                  </label>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => openEditModal(sub)}
                      className="btn-secondary"
                      style={{ flex: 1, fontSize: 13, padding: 7 }}
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
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
        )}

        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          editingSubscription={editingSubscription}
        />
      </div>
    </div>
  )
}
