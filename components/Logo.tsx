import { CreditCard } from 'lucide-react'

type Props = {
  size?: 'sm' | 'md'
}

export const APP_NAME = 'จ่ายจนเจ็บ'

// โลโก้แอป: ไอคอนกรอบมนไล่สีม่วง + ชื่อแอป ใช้ร่วมกันทั้งหน้า auth และ dashboard
export default function Logo({ size = 'md' }: Props) {
  const boxSize = size === 'sm' ? 32 : 40
  const iconSize = size === 'sm' ? 16 : 20
  const fontSize = size === 'sm' ? 15 : 18

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #AFA9EC, #7F77DD)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CreditCard size={iconSize} color="#ffffff" strokeWidth={2} />
      </div>
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color: '#2b2b33',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {APP_NAME}
      </span>
    </div>
  )
}
