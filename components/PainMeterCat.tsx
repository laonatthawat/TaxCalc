import { PainLevel } from '@/lib/subscriptionUtils'

type Props = {
  level: PainLevel
  size?: number
}

// หน้าแมวแสดงอารมณ์ตามเปอร์เซ็นต์งบที่ใช้ไปแล้ว ใช้กับการ์ด "มิเตอร์ความเจ็บ"
// happy: ตาโค้งยิ้มกว้าง (ใช้งบน้อย) -> okay: ตากลมยิ้มเบาๆ -> worried: คิ้วขมวดเล็กน้อย
// -> pain: คิ้วขมวดแรง ตาหยี ปากจุ๊ (เกินงบแล้ว "จ่ายจนเจ็บ" ตามชื่อแอป)
const FACES: Record<
  PainLevel,
  { eyeType: 'curve' | 'dot' | 'squint'; mouth: string; brow: string | null }
> = {
  happy: {
    eyeType: 'curve',
    mouth: 'M84 106 C 90 112, 110 112, 116 106',
    brow: null,
  },
  okay: {
    eyeType: 'dot',
    mouth: 'M88 106 C 92 110, 108 110, 112 106',
    brow: null,
  },
  worried: {
    eyeType: 'dot',
    mouth: 'M88 108 L 112 108',
    brow: 'M78 82 L 92 87 M122 82 L 108 87',
  },
  pain: {
    eyeType: 'squint',
    mouth: 'M90 110 C 95 104, 105 104, 110 110 C 105 114, 95 114, 90 110',
    brow: 'M76 80 L 94 90 M124 80 L 106 90',
  },
}

export default function PainMeterCat({ level, size = 64 }: Props) {
  const face = FACES[level]

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* หู */}
      <path d="M58 55 L42 12 L82 45 Z" fill="#d67f48" />
      <path d="M142 55 L158 12 L118 45 Z" fill="#d67f48" />
      <path d="M60 47 L50 21 L75 41 Z" fill="#ffe1d0" />
      <path d="M140 47 L150 21 L125 41 Z" fill="#ffe1d0" />
      {/* หัว */}
      <circle cx="100" cy="90" r="58" fill="#d67f48" />
      {/* แก้ม */}
      <circle cx="66" cy="104" r="10" fill="#ffe1d0" opacity="0.6" />
      <circle cx="134" cy="104" r="10" fill="#ffe1d0" opacity="0.6" />

      {face.brow && (
        <path d={face.brow} stroke="#201e1d" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* ตา */}
      {face.eyeType === 'curve' ? (
        <>
          <path d="M72 90 Q80 82 88 90" stroke="#201e1d" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M112 90 Q120 82 128 90" stroke="#201e1d" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : face.eyeType === 'squint' ? (
        <>
          <path d="M72 90 L88 90" stroke="#201e1d" strokeWidth="4" strokeLinecap="round" />
          <path d="M112 90 L128 90" stroke="#201e1d" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="80" cy="90" r="7" fill="#201e1d" />
          <circle cx="120" cy="90" r="7" fill="#201e1d" />
          <circle cx="82.5" cy="87.5" r="2.2" fill="#ffffff" />
          <circle cx="122.5" cy="87.5" r="2.2" fill="#ffffff" />
        </>
      )}

      {/* จมูก */}
      <path d="M96 100 L104 100 L100 106 Z" fill="#8c491a" />
      {/* ปาก */}
      <path d={face.mouth} stroke="#201e1d" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* หนวด */}
      <path
        d="M55 96 L28 92 M55 102 L27 104 M145 96 L172 92 M145 102 L173 104"
        stroke="#8c491a"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
