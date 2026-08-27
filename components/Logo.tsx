import { Sprout } from 'lucide-react'

type Props = {
  size?: 'sm' | 'md' | 'lg'
}

export const APP_NAME = 'จ่ายจนเจ็บ'

// โลโก้แอป: วงกลมสีส้มไล่เฉด + ไอคอนต้นอ่อน + ชื่อแอป ใช้ร่วมกันทั้งหน้า auth, dashboard และหน้า landing (lg)
export default function Logo({ size = 'md' }: Props) {
  const boxSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 40
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 26 : 20
  const fontSize = size === 'sm' ? 15 : size === 'lg' ? 24 : 18

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: 999,
          background: 'linear-gradient(135deg, #d67f48, #b2622d)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Sprout size={iconSize} color="#f5ead8" strokeWidth={2} />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize,
          fontWeight: 400,
          color: '#201e1d',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {APP_NAME}
      </span>
    </div>
  )
}
