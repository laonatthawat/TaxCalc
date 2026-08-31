import Link from 'next/link'
import { Check, Circle } from 'lucide-react'

export type ChecklistItem = {
  title: string
  body: string
  time: string
  href: string
  done: boolean
}

type Props = {
  items: ChecklistItem[]
}

const SAGE = '#7a8a5e'

export default function WelcomeClient({ items }: Props) {
  const doneCount = items.filter((c) => c.done).length
  const total = items.length
  const progressPct = Math.round((doneCount / total) * 100)
  const progressTitle = doneCount === total ? 'ครบแล้ว แอปพร้อมใช้งาน' : 'ตั้งค่าเริ่มต้น'
  const progressNote =
    doneCount === total
      ? 'ตอนนี้แท็บภาษีมีตัวเลขของคุณอยู่แล้ว เปิดเข้าไปจะเห็นยอดภาษีทั้งปี ขั้นภาษีที่คุณอยู่ และเงินที่เหลือเก็บต่อเดือน ไม่ใช่หน้าว่างเปล่า'
      : 'ยังไม่ต้องทำครบวันนี้ก็ได้ แต่ข้อแรกทำให้แท็บภาษีเริ่มคำนวณได้ทันที'

  return (
    <div
      style={{
        maxWidth: 1600,
        padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,44px) clamp(56px,7vw,88px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(24px,3vw,32px)',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: '1 1 520px', minWidth: 0 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 15px',
            borderRadius: 999,
            background: '#e1eecc',
            font: '600 12px/1.4 "IBM Plex Sans Thai",sans-serif',
            color: '#56633f',
          }}
        >
          บัญชีพร้อมแล้ว
        </span>
        <h1 style={{ margin: '18px 0 16px', maxWidth: '20ch', fontSize: 'clamp(30px,4.4vw,52px)', lineHeight: 1.1, color: '#201e1d' }}>
          ยินดีต้อนรับ เริ่มจากสองข้อนี้
        </h1>
        <p style={{ margin: '0 0 clamp(24px,3vw,34px)', maxWidth: '54ch', fontSize: 'clamp(16px,1.4vw,18px)', fontWeight: 400, lineHeight: 1.7, color: '#474238' }}>
          ทำครบสองข้อใช้เวลาไม่ถึงนาที แล้วแท็บภาษีจะเริ่มมีตัวเลขของคุณให้ดูทันที กดข้ามไปก่อนแล้วทำทีหลังก็ได้
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              style={{
                padding: 'clamp(20px,2.6vw,26px) clamp(20px,3vw,30px)',
                borderRadius: 28,
                background: c.done ? '#f0fae1' : '#f9f4ed',
                border: `1px solid ${c.done ? '#ccdbb2' : '#dcd3c4'}`,
                display: 'flex',
                gap: 18,
                alignItems: 'center',
                flexWrap: 'wrap',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  borderRadius: 999,
                  border: `2px solid ${c.done ? SAGE : '#c0b6a5'}`,
                  background: c.done ? SAGE : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {c.done ? <Check size={16} color="#f0fae1" /> : <Circle size={16} color="transparent" />}
              </span>
              <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 'clamp(17px,1.7vw,19px)',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: '#201e1d',
                    textDecoration: c.done ? 'line-through' : 'none',
                  }}
                >
                  {c.title}
                </span>
                <span style={{ font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#645c50' }}>{c.body}</span>
              </div>
              <span style={{ flexShrink: 0, font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>
                {c.time}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'sticky',
          top: 86,
          padding: 'clamp(22px,3vw,30px)',
          borderRadius: 28,
          background: '#ebddc5',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flex: '1 1 320px',
          minWidth: 0,
          maxWidth: 380,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
          <span style={{ font: '600 18px/1.35 "IBM Plex Sans Thai",sans-serif', color: '#201e1d' }}>{progressTitle}</span>
          <span style={{ font: '600 15px/1 var(--font-number)', color: '#8c491a' }}>
            {doneCount}/{total}
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: '#dcd3c4', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 999, background: SAGE, transition: 'width .3s ease', width: `${progressPct}%` }} />
        </div>
        <p style={{ margin: 0, font: '400 15px/1.7 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>{progressNote}</p>
      </div>
    </div>
  )
}
