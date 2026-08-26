import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Logo, { APP_NAME } from '@/components/Logo'
import CatMascot from '@/components/CatMascot'
import { Wallet2, TrendingUp, Receipt, Landmark } from 'lucide-react'

// การ์ดแนะนำ 4 โมดูลหลักของแอป — เรียงตามลำดับที่ผู้ใช้ควรเริ่มใช้งาน
const FEATURES = [
  {
    icon: Receipt,
    title: 'รายจ่ายประจำ',
    description: 'ติดตามค่าเช่า ค่าน้ำค่าไฟ ค่าผ่อน subscription พร้อมแจ้งเตือนก่อนถึงกำหนดจ่าย',
    gradient: 'linear-gradient(135deg, #AFA9EC, #7F77DD)',
  },
  {
    icon: Wallet2,
    title: 'รายรับ',
    description: 'บันทึกเงินเดือน โบนัส งานฟรีแลนซ์ ทั้งแบบประจำและครั้งเดียว ดูกระแสเงินสดสุทธิได้ทันที',
    gradient: 'linear-gradient(135deg, #9fe1cb, #4CAF80)',
  },
  {
    icon: TrendingUp,
    title: 'การลงทุน',
    description: 'เครื่องคำนวณดอกเบี้ยทบต้น เห็นภาพการเติบโตแบบ exponential และจุดที่ดอกเบี้ยเริ่มทำงานหนักกว่าคุณ',
    gradient: 'linear-gradient(135deg, #7cc4fa, #4a90d9)',
  },
  {
    icon: Landmark,
    title: 'ภาษี',
    description: 'ประมาณการภาษีเงินได้บุคคลธรรมดาจากรายรับจริง พร้อมค่าลดหย่อนครบทุกรายการหลัก',
    gradient: 'linear-gradient(135deg, #64748b, #334155)',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ถ้า login อยู่แล้วเด้งเข้า dashboard ตรงๆ เหมือนเดิม — หน้านี้ (landing page) สำหรับคนที่ยังไม่ login เท่านั้น
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="dashboard-page">
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Logo size="lg" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <CatMascot size={100} />
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#2b2b33', margin: '0 0 12px' }}>
          {APP_NAME}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#47474f',
            maxWidth: 520,
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          แอปจัดการการเงินส่วนตัวครบวงจร — ติดตามรายจ่ายประจำ รายรับ วางแผนการลงทุน
          และประมาณการภาษี ไว้ในที่เดียว จะได้เห็นภาพการเงินตัวเองชัดๆ ก่อนจะจ่ายจนเจ็บ
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
          <Link
            href="/signup"
            className="btn-gradient-primary"
            style={{ width: 'auto', padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}
          >
            สมัครสมาชิกฟรี
          </Link>
          <Link
            href="/login"
            className="btn-secondary"
            style={{ padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }}
          >
            เข้าสู่ระบบ
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            textAlign: 'left',
          }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                style={{
                  background: '#ffffff',
                  border: '0.5px solid #ececE5',
                  borderRadius: 14,
                  padding: '20px 18px',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Icon size={19} color="#ffffff" />
                </div>
                <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: '#2b2b33' }}>
                  {feature.title}
                </p>
                <p style={{ margin: 0, fontSize: 12.5, color: '#47474f', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <p style={{ marginTop: 56, fontSize: 11, color: '#a9a9b2', lineHeight: 1.6 }}>
          โปรเจกต์ส่วนตัวสำหรับฝึกฝนและเก็บพอร์ต ตัวเลขภาษี/ผลตอบแทนการลงทุนในแอปเป็นการประมาณการเท่านั้น
          ไม่ใช่คำแนะนำทางการเงิน/ภาษีอย่างเป็นทางการ
        </p>
      </div>
    </div>
  )
}
