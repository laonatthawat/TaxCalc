'use client'

import { CalendarDays, Layers, Wallet2 } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import {
  Subscription,
  calculateTotals,
  groupByCategory,
  getMonthlyComparisonData,
  groupByDayOfMonth,
  getUpcomingRenewals,
  getDaysUntilRenewal,
  formatDaysUntilRenewal,
  sortByNextBilling,
} from '@/lib/subscriptionUtils'
import PainMeter from './PainMeter'

type Props = {
  subscriptions: Subscription[]
  monthlyBudget: number | null
  monthlyIncome: number
}

const COLORS = ['#c67139', '#7a8a5e', '#b2622d', '#8fa073', '#8c491a', '#56633f', '#a19786']
const RENEWAL_ALERT_DAYS = 3

// จุดกลมประดับมุมการ์ด hero — ตกแต่งเฉยๆ ไม่ใช่ข้อความ จึงใช้ opacity ต่ำได้โดยไม่กระทบการอ่าน
function HeroDots() {
  const dots = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      dots.push(<circle key={`${row}-${col}`} cx={col * 22 + 11} cy={row * 22 + 11} r={2.5} fill="#ffffff" />)
    }
  }
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      style={{ position: 'absolute', top: -16, right: -16, opacity: 0.18, pointerEvents: 'none' }}
    >
      {dots}
    </svg>
  )
}

export default function SummaryDashboard({ subscriptions, monthlyBudget, monthlyIncome }: Props) {
  const { totalMonthly, totalYearly } = calculateTotals(subscriptions)
  const categoryData = groupByCategory(subscriptions)
  const barData = getMonthlyComparisonData(subscriptions)
  const dayOfMonthData = groupByDayOfMonth(subscriptions)
  // เรียงเอาตัวที่เลยกำหนดมานานสุด/ใกล้ครบกำหนดสุดขึ้นก่อน จะได้เห็นตัวที่เร่งด่วนที่สุดบนสุด
  const upcomingRenewals = sortByNextBilling(getUpcomingRenewals(subscriptions, RENEWAL_ALERT_DAYS))
  // กระแสเงินสดสุทธิต่อเดือน = รายรับประจำ − รายจ่ายประจำ (ยังไม่รวมรายรับ/รายจ่ายแบบครั้งเดียว)
  const netCashFlow = monthlyIncome - totalMonthly

  return (
    <div style={{ marginBottom: 32 }}>
      {/* แจ้งเตือนใกล้ต่ออายุ — ใช้โทนสีเดียวกับ renewal-badge-urgent เพื่อให้ "สัญญาณเตือน" สื่อความหมายเดียวกันทั้งแอป */}
      {upcomingRenewals.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f4c9bd, #fbe4dc)',
            borderRadius: 28,
            padding: '16px 20px',
            marginBottom: 28,
            color: '#8a3a22',
          }}
        >
          <strong>⚠️ ใกล้ถึง/เลยกำหนดจ่าย (ภายใน {RENEWAL_ALERT_DAYS} วัน หรือค้างจ่ายอยู่)</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            {upcomingRenewals.map((sub) => {
              const daysUntil = getDaysUntilRenewal(sub.next_billing_date)
              return (
                <li key={sub.id}>
                  <strong>{formatDaysUntilRenewal(daysUntil)}</strong> — {sub.name} (฿
                  {sub.price.toLocaleString()}) ครบกำหนดวันที่{' '}
                  {new Date(sub.next_billing_date).toLocaleDateString('th-TH')}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* มิเตอร์ความเจ็บ: เทียบยอดรวมต่อเดือนกับงบที่ตั้งไว้ หน้าแมวเปลี่ยนอารมณ์ตาม % ที่ใช้ไป */}
      <PainMeter monthlyBudget={monthlyBudget} totalMonthly={totalMonthly} />

      {/* การ์ด hero: ยอดรวมต่อเดือนเด่นเป็นจุดสนใจหลัก + สถิติย่อย (ต่อปี, จำนวน) แปะไว้ด้านล่างในการ์ดเดียวกัน */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #d67f48 0%, #c67139 55%, #8c491a 100%)',
          borderRadius: 28,
          padding: '22px 24px',
          marginBottom: 16,
          color: '#ffffff',
        }}
      >
        <HeroDots />
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
          ยอดรวมต่อเดือน
        </p>
        <p style={{ margin: '6px 0 20px', fontSize: 34, fontWeight: 700 }}>
          ฿{totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarDays size={15} color="#ffffff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>ต่อปี (ประมาณการ)</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                ฿{totalYearly.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Layers size={15} color="#ffffff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>รายการทั้งหมด</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{subscriptions.length} รายการ</p>
            </div>
          </div>

          {/* กระแสเงินสดสุทธิ: โชว์เฉพาะเมื่อมีข้อมูลรายรับแล้ว (ไม่งั้นจะติดลบเท่ากับรายจ่ายเสมอ ทำให้เข้าใจผิดว่าติดลบจริง) */}
          {monthlyIncome > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Wallet2 size={15} color="#ffffff" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                  กระแสเงินสดสุทธิ/เดือน
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                  {netCashFlow >= 0 ? '+' : '-'}฿
                  {Math.abs(netCashFlow).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* กราฟ: แสดงเฉพาะเมื่อมีข้อมูล */}
      {subscriptions.length > 0 && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* กราฟวงกลม: สัดส่วนตามหมวดหมู่ */}
          <div
            style={{
              flex: 1,
              minWidth: 300,
              background: '#f9f4ed',
              border: '0.5px solid #dcd3c4',
              borderRadius: 28,
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>
              สัดส่วนค่าใช้จ่ายตามหมวดหมู่
            </h3>
            {/* ตัดป้ายชื่อรอบวงกลมออก (เดิมทับกัน/ล้นขอบเวลามีหมวดหมู่เล็กหลายอัน)
                ใช้ legend ด้านล่าง + tooltip ตอน hover แทน อ่านง่ายกว่าไม่ว่าสัดส่วนจะเบี้ยวแค่ไหน */}
            <ResponsiveContainer width="100%" height={280}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="46%" outerRadius={75}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `฿${value.toLocaleString()}`} />
                <Legend
                  verticalAlign="bottom"
                  height={48}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, color: '#474238' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* กราฟแท่ง: เทียบค่าใช้จ่ายรายเดือนของแต่ละ subscription */}
          <div
            style={{
              flex: 1,
              minWidth: 300,
              background: '#f9f4ed',
              border: '0.5px solid #dcd3c4',
              borderRadius: 28,
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>
              เทียบค่าใช้จ่ายรายเดือน
            </h3>
            {/* เพิ่มตัวเลขบนหัวแท่งไว้เลย เพราะถ้ามีตัวที่ยอดสูงกว่าตัวอื่นมากๆ
                แท่งเล็กๆ จะเตี้ยจนมองด้วยตาเปล่าเทียบกันยาก ตัวเลขช่วยให้ยังอ่านค่าจริงได้ */}
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  tickFormatter={(name: string) => (name.length > 10 ? `${name.slice(0, 9)}…` : name)}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => `฿${value.toLocaleString()}`} />
                <Bar dataKey="monthlyPrice" fill="#c67139" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="monthlyPrice"
                    position="top"
                    style={{ fontSize: 11, fill: '#201e1d' }}
                    formatter={(value: any) => `฿${Number(value).toLocaleString()}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* กราฟแท่ง: รายจ่ายตามวันที่ในเดือน (1-31) ดูว่าเงินไปกองวันไหนของเดือนเยอะสุด
              แสดงทุกวัน 1-31 แม้ไม่มีรายจ่าย เพื่อให้เห็น "รูปทรง" การกระจายตัวทั้งเดือนชัดเจน */}
          <div
            style={{
              flex: '1 1 100%',
              minWidth: 300,
              background: '#f9f4ed',
              border: '0.5px solid #dcd3c4',
              borderRadius: 28,
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, color: '#201e1d' }}>
              รายจ่ายตามวันที่ในเดือน
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: '#474238' }}>
              ดูว่าแต่ละเดือนเงินไหลออกกองวันไหนเยอะสุด (ตามวันที่ต่ออายุของแต่ละ subscription)
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dayOfMonthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={1} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`฿${value.toLocaleString()}`, 'รวม']}
                  labelFormatter={(day) => `วันที่ ${day}`}
                />
                <Bar dataKey="total" fill="#d67f48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
