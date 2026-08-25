'use client'

import { Plus, Calendar } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categoryStyles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SubscriptionModal from './SubscriptionModal'
import SummaryDashboard from './SummaryDashboard'
import { deleteSubscription, signOut } from '@/app/dashboard/actions'

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
}

export default function DashboardClient({ initialSubscriptions, userEmail }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const router = useRouter()

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
    const confirmed = window.confirm('ยืนยันลบ subscription นี้?')
    if (!confirmed) return

    await deleteSubscription(id)
    router.refresh()
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>My Subscriptions</h1>
          <p style={{ color: '#666' }}>{userEmail}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
                    <button
            onClick={openAddModal}
            style={{
              background: 'linear-gradient(135deg, #AFA9EC, #7F77DD)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> เพิ่ม Subscription
          </button>
          <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
            ออกจากระบบ
          </button>
        </div>
      </div>

        <SummaryDashboard subscriptions={initialSubscriptions} />

      {initialSubscriptions.length === 0 ? (
        <p>ยังไม่มี subscription เลย ลองเพิ่มดูสิ</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
                    {initialSubscriptions.map((sub) => {
            const theme = getCategoryStyle(sub.category)
            const Icon = theme.icon

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
                      borderRadius: 12,
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
                    <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>{sub.name}</p>
                    {sub.category && (
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{sub.category}</p>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>
                  ฿{sub.price.toLocaleString()}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#888' }}>
                    {' '}
                    /{sub.billing_cycle === 'monthly' ? 'เดือน' : 'ปี'}
                  </span>
                </p>

                <p
                  style={{
                    fontSize: 12,
                    color: '#888',
                    margin: '8px 0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Calendar size={13} /> ต่ออายุ{' '}
                  {new Date(sub.next_billing_date).toLocaleDateString('th-TH')}
                </p>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => openEditModal(sub)}
                    style={{ flex: 1, fontSize: 13, padding: 7 }}
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    style={{ flex: 1, fontSize: 13, padding: 7 }}
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
  )
}