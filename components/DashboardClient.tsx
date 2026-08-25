'use client'

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
          <button onClick={openAddModal} style={{ padding: '8px 16px' }}>
            + เพิ่ม Subscription
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {initialSubscriptions.map((sub) => (
            <div
              key={sub.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>{sub.name}</h3>
              {sub.category && (
                <p style={{ color: '#888', fontSize: 12, margin: '4px 0' }}>{sub.category}</p>
              )}
              <p style={{ fontSize: 20, fontWeight: 'bold', margin: '8px 0' }}>
                ฿{sub.price.toLocaleString()}
                <span style={{ fontSize: 12, fontWeight: 'normal', color: '#888' }}>
                  {' '}
                  / {sub.billing_cycle === 'monthly' ? 'เดือน' : 'ปี'}
                </span>
              </p>
              <p style={{ fontSize: 13, color: '#666' }}>
                ต่ออายุถัดไป: {new Date(sub.next_billing_date).toLocaleDateString('th-TH')}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => openEditModal(sub)} style={{ padding: '4px 12px' }}>
                  แก้ไข
                </button>
                <button onClick={() => handleDelete(sub.id)} style={{ padding: '4px 12px' }}>
                  ลบ
                </button>
              </div>
            </div>
          ))}
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