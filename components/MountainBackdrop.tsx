// พื้นหลังภูเขา silhouette ซ้อนชั้นแบบ gradient — แรงบันดาลใจจากภาพ mountain banner ที่ user ส่งมาดู
// วาดใหม่เป็น inline SVG ทั้งหมด (ไม่ใช้ไฟล์ภาพภายนอก ตาม pattern เดิมของแอปที่ใช้ inline SVG ล้วน
// เช่น CatMascot/Logo) แล้วปรับจากสีต้นฉบับ (ชมพู/ส้ม/ฟ้า) ให้เป็นโทนม่วงพาสเทลของแบรนด์แทน
//
// ใช้เฉพาะหน้า landing (`/`) กับหน้า auth (login/signup/forgot-password/reset-password) เท่านั้น —
// ไม่ใส่ในหน้า dashboard/income/investments/tax/overview เพราะหน้าพวกนั้นมีตาราง/ฟอร์มเยอะ พื้นหลัง
// ที่มีรายละเอียดมากจะทำให้ดูรกและอ่านข้อมูลยากขึ้น
//
// วางเป็น absolute เต็มพื้นที่ของ container ที่เป็น position:relative (เช่น .landing-page / .auth-page)
// ใช้ z-index: 0 (ไม่ใช่ค่าติดลบ) เพราะ container ไม่ได้สร้าง stacking context ใหม่ (แค่ position:relative
// เฉยๆ ไม่มี z-index) ถ้าใส่ z-index ติดลบ ตัวนี้จะ "หลุด" ไปเทียบชั้นกับ root ของทั้งหน้าแทน แล้วจะโดน
// พื้นหลังทึบของ .auth-page/.landing-page เองบังจนหายไปเลย (เจอบั๊กนี้มาแล้ว) — เนื้อหาด้านบน (การ์ด/ฟอร์ม)
// จึงต้องตั้ง position: relative; z-index: 1 กำกับไว้คู่กันเสมอ เพื่อให้แน่ใจว่าซ้อนอยู่เหนือพื้นหลังนี้
export default function MountainBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id="mb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dcd6fb" />
            <stop offset="45%" stopColor="#eeddf3" />
            <stop offset="78%" stopColor="#fbe6df" />
            <stop offset="100%" stopColor="#fdf3ee" />
          </linearGradient>
          <radialGradient id="mb-glow" cx="50%" cy="34%" r="32%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mb-layer1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cabdf0" />
            <stop offset="100%" stopColor="#b3a5ea" />
          </linearGradient>
          <linearGradient id="mb-layer2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a898e6" />
            <stop offset="100%" stopColor="#8f7cdd" />
          </linearGradient>
          <linearGradient id="mb-layer3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8676d6" />
            <stop offset="100%" stopColor="#6a5fd0" />
          </linearGradient>
        </defs>

        {/* ท้องฟ้า gradient ม่วง-ชมพูพาสเทล + แสงจางกลางภาพ (คล้ายพระอาทิตย์/แสงลอด) */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#mb-sky)" />
        <circle cx="720" cy="330" r="260" fill="url(#mb-glow)" />

        {/* ชั้นภูเขาไกลสุด (สีอ่อนสุด โปร่งสุด) */}
        <path
          d="M0,520 Q120,460 240,495 T480,470 Q600,430 720,480 T960,460 Q1100,415 1220,465 T1440,445 L1440,900 L0,900 Z"
          fill="url(#mb-layer1)"
          opacity="0.55"
        />
        {/* ชั้นกลาง */}
        <path
          d="M0,630 Q160,555 320,595 T640,575 Q800,525 960,585 T1280,565 L1440,590 L1440,900 L0,900 Z"
          fill="url(#mb-layer2)"
          opacity="0.78"
        />
        {/* ชั้นหน้าสุด (เข้มสุด) */}
        <path
          d="M0,745 Q200,665 380,705 T760,685 Q940,635 1120,695 T1440,665 L1440,900 L0,900 Z"
          fill="url(#mb-layer3)"
        />

        {/* แนวต้นสน silhouette เรียงตามเชิงเขาหน้าสุด — สร้างเป็นสามเหลี่ยมซ้ำๆ ความสูงสลับกันเล็กน้อย
            ไม่ใช้ Math.random เพื่อให้ผลลัพธ์เหมือนเดิมทุกครั้งที่ render (deterministic) */}
        <g fill="#584fc9">
          {Array.from({ length: 26 }).map((_, i) => {
            const x = i * 58 + (i % 2 === 0 ? 0 : 24)
            const h = 30 + ((i * 37) % 26)
            const baseY = 822
            return <polygon key={i} points={`${x},${baseY - h} ${x - 15},${baseY} ${x + 15},${baseY}`} />
          })}
        </g>
      </svg>
    </div>
  )
}
