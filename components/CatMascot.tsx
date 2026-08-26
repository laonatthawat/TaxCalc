export type CatVariant = 'lavender' | 'tabby' | 'charcoal' | 'cream' | 'graytabby'

type Props = {
  size?: number
  className?: string
  variant?: CatVariant
}

// ชุดสี/ลวดลายของแมวแต่ละแบบ — ใช้โครงร่าง (pose) เดียวกันทั้งหมด แค่เปลี่ยนสีขน/ลาย
// เพื่อให้แต่ละจุดในแอปที่มีแมวโผล่มา ไม่ซ้ำหน้ากันไปหมด (login/signup/dashboard/income/landing)
// fur = สีขนหลัก, belly = ท้อง/สีอ่อน, earInner = สีในหูและแก้ม, nose = สีจมูก, whisker = สีหนวด
// points = สีหู+หาง "แต้มสี" แบบแมวสยาม (ถ้าไม่กำหนด จะใช้สี fur เหมือนเดิม)
// stripe = สีลายทางบนหน้าผาก แบบแมวลายเสือ (ถ้าไม่กำหนด จะไม่มีลาย เป็นสีพื้นล้วน)
const PALETTES: Record<
  CatVariant,
  { fur: string; belly: string; earInner: string; nose: string; whisker: string; points?: string; stripe?: string }
> = {
  // ค่า default เดิมของแอป — สีม่วงพาสเทลซิกเนเจอร์ ใช้เป็นหน้าตาหลักของแบรนด์
  lavender: { fur: '#AFA9EC', belly: '#F1EFFE', earInner: '#F5C4B3', nose: '#6a5fd0', whisker: '#6a5fd0' },
  // แมวส้ม-ขาว ลายเสือจางๆ บนหน้าผาก
  tabby: {
    fur: '#e3a765',
    belly: '#fbeee0',
    earInner: '#f2c9a0',
    nose: '#8a5a34',
    whisker: '#8a5a34',
    stripe: '#c98544',
  },
  // แมวดำ-เทาเข้ม
  charcoal: { fur: '#54545f', belly: '#dcdce2', earInner: '#8f8f9c', nose: '#2b2b33', whisker: '#8f8f9c' },
  // แมวครีม แต้มสีน้ำตาลที่หู/หาง แบบแมวสยาม
  cream: {
    fur: '#f3e6cf',
    belly: '#fdf8ef',
    earInner: '#a9765a',
    nose: '#7a5138',
    whisker: '#a9765a',
    points: '#9c7154',
  },
  // แมวเทาลายเสือ
  graytabby: {
    fur: '#aab0bd',
    belly: '#eef0f4',
    earInner: '#c7ccd6',
    nose: '#5c6270',
    whisker: '#5c6270',
    stripe: '#8b93a3',
  },
}

// มาสคอตแมวน่ารักๆ วาดเป็น SVG ล้วน (ไม่ใช้ไฟล์ภาพ) — โครงเดียวกับตอนแรกของแอป (โทนม่วงพาสเทล
// เป็นค่า default) แค่เพิ่ม prop `variant` ให้เลือกสี/ลายอื่นได้ เพื่อใช้ตกแต่งหลายจุดโดยไม่ซ้ำหน้ากัน
export default function CatMascot({ size = 140, className, variant = 'lavender' }: Props) {
  const p = PALETTES[variant]
  const earColor = p.points ?? p.fur
  const tailColor = p.points ?? p.fur

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* หาง */}
      <path d="M148 150 C 176 146, 183 110, 165 89 C 179 108, 173 139, 148 148 Z" fill={tailColor} />
      {/* ตัว */}
      <ellipse cx="100" cy="142" rx="52" ry="42" fill={p.fur} />
      {/* ท้องขาว/อ่อน */}
      <ellipse cx="100" cy="156" rx="27" ry="21" fill={p.belly} />
      {/* อุ้งเท้า */}
      <ellipse cx="73" cy="178" rx="13" ry="9" fill={p.fur} />
      <ellipse cx="127" cy="178" rx="13" ry="9" fill={p.fur} />
      {/* หู */}
      <path d="M58 55 L42 12 L82 45 Z" fill={earColor} />
      <path d="M142 55 L158 12 L118 45 Z" fill={earColor} />
      <path d="M60 47 L50 21 L75 41 Z" fill={p.earInner} />
      <path d="M140 47 L150 21 L125 41 Z" fill={p.earInner} />
      {/* หัว */}
      <circle cx="100" cy="82" r="50" fill={p.fur} />
      {/* ลายทางบนหน้าผาก (มีเฉพาะลายเสือ) */}
      {p.stripe && (
        <path
          d="M82 45 Q100 38 118 45 M78 56 Q100 48 122 56 M76 67 Q100 60 124 67"
          stroke={p.stripe}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      )}
      {/* แก้ม */}
      <circle cx="69" cy="95" r="9" fill={p.earInner} opacity="0.6" />
      <circle cx="131" cy="95" r="9" fill={p.earInner} opacity="0.6" />
      {/* ตา */}
      <circle cx="80" cy="80" r="7" fill="#2b2b33" />
      <circle cx="120" cy="80" r="7" fill="#2b2b33" />
      <circle cx="82.5" cy="77.5" r="2.2" fill="#ffffff" />
      <circle cx="122.5" cy="77.5" r="2.2" fill="#ffffff" />
      {/* จมูก */}
      <path d="M96 94 L104 94 L100 100 Z" fill={p.nose} />
      {/* ปาก */}
      <path
        d="M100 100 C 96 106, 88 106, 85 101 M100 100 C 104 106, 112 106, 115 101"
        stroke="#2b2b33"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* หนวด */}
      <path
        d="M55 88 L28 84 M55 94 L27 96 M145 88 L172 84 M145 94 L173 96"
        stroke={p.whisker}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
