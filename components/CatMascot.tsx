type Props = {
  size?: number
  className?: string
}

// มาสคอตแมวน่ารักๆ วาดเป็น SVG ล้วน (ไม่ใช้ไฟล์ภาพ) โทนสีม่วงพาสเทลเดียวกับธีมแอป
// ใช้ตกแต่ง empty state และมุมการ์ด login/signup ให้ดูมีชีวิตชีวาขึ้น
export default function CatMascot({ size = 140, className }: Props) {
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
      <path d="M148 150 C 176 146, 183 110, 165 89 C 179 108, 173 139, 148 148 Z" fill="#AFA9EC" />
      {/* ตัว */}
      <ellipse cx="100" cy="142" rx="52" ry="42" fill="#AFA9EC" />
      {/* ท้องขาว */}
      <ellipse cx="100" cy="156" rx="27" ry="21" fill="#F1EFFE" />
      {/* อุ้งเท้า */}
      <ellipse cx="73" cy="178" rx="13" ry="9" fill="#AFA9EC" />
      <ellipse cx="127" cy="178" rx="13" ry="9" fill="#AFA9EC" />
      {/* หู */}
      <path d="M58 55 L42 12 L82 45 Z" fill="#AFA9EC" />
      <path d="M142 55 L158 12 L118 45 Z" fill="#AFA9EC" />
      <path d="M60 47 L50 21 L75 41 Z" fill="#F5C4B3" />
      <path d="M140 47 L150 21 L125 41 Z" fill="#F5C4B3" />
      {/* หัว */}
      <circle cx="100" cy="82" r="50" fill="#AFA9EC" />
      {/* แก้ม */}
      <circle cx="69" cy="95" r="9" fill="#F5C4B3" opacity="0.6" />
      <circle cx="131" cy="95" r="9" fill="#F5C4B3" opacity="0.6" />
      {/* ตา */}
      <circle cx="80" cy="80" r="7" fill="#2b2b33" />
      <circle cx="120" cy="80" r="7" fill="#2b2b33" />
      <circle cx="82.5" cy="77.5" r="2.2" fill="#ffffff" />
      <circle cx="122.5" cy="77.5" r="2.2" fill="#ffffff" />
      {/* จมูก */}
      <path d="M96 94 L104 94 L100 100 Z" fill="#6a5fd0" />
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
        stroke="#6a5fd0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
