'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import {
  Subscription,
  calculateTotals,
  groupByCategory,
  getMonthlyComparisonData,
  getUpcomingRenewals,
} from '@/lib/subscriptionUtils'

type Props = {
  subscriptions: Subscription[]
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6']
const RENEWAL_ALERT_DAYS = 3

export default function SummaryDashboard({ subscriptions }: Props) {
  const { totalMonthly, totalYearly } = calculateTotals(subscriptions)
  const categoryData = groupByCategory(subscriptions)
  const barData = getMonthlyComparisonData(subscriptions)
  const upcomingRenewals = getUpcomingRenewals(subscriptions, RENEWAL_ALERT_DAYS)

  return (
    <div style={{ marginBottom: 32 }}>
      {/* แจ้งเตือนใกล้ต่ออายุ */}
      {upcomingRenewals.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FBEAF0, #FAECE7)',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 28,
            color: '#72243E',
          }}
        >
          <strong>⚠️ ใกล้ถึงวันต่ออายุ (ภายใน {RENEWAL_ALERT_DAYS} วัน)</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            {upcomingRenewals.map((sub) => (
              <li key={sub.id}>
                {sub.name} — ต่ออายุวันที่{' '}
                {new Date(sub.next_billing_date).toLocaleDateString('th-TH')} (฿
                {sub.price.toLocaleString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* การ์ดสรุปยอดรวม */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: 'linear-gradient(160deg, #EEEDFE, #F1EFE8)',
            borderRadius: 14,
            padding: '1.1rem',
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: 13 }}>ยอดรวมต่อเดือน</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 500 }}>
            ฿{totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: 'linear-gradient(160deg, #E1F5EE, #F1EFE8)',
            borderRadius: 14,
            padding: '1.1rem',
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: 13 }}>ยอดรวมต่อปี (ประมาณการ)</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 500 }}>
            ฿{totalYearly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: 'linear-gradient(160deg, #FAEEDA, #F1EFE8)',
            borderRadius: 14,
            padding: '1.1rem',
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: 13 }}>จำนวน Subscription</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 500 }}>{subscriptions.length}</p>
        </div>
      </div>

      {/* กราฟ: แสดงเฉพาะเมื่อมีข้อมูล */}
      {subscriptions.length > 0 && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* กราฟวงกลม: สัดส่วนตามหมวดหมู่ */}
          <div style={{ flex: 1, minWidth: 300, border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>สัดส่วนค่าใช้จ่ายตามหมวดหมู่</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ฿${entry.value}`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `฿${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* กราฟแท่ง: เทียบค่าใช้จ่ายรายเดือนของแต่ละ subscription */}
          <div style={{ flex: 1, minWidth: 300, border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>เทียบค่าใช้จ่ายรายเดือน</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value: any) => `฿${value.toLocaleString()}`} />
                <Bar dataKey="monthlyPrice" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}