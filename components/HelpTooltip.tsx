'use client'

import { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

type Props = {
  title: string
  children: React.ReactNode
  // ทิศทางที่กล่องคำอธิบายจะกางออกจากไอคอน — 'left' กางไปทางขวา (ใช้เมื่อไอคอนอยู่ชิดซ้ายของจอ),
  // 'right' กางไปทางซ้าย (กันล้นขอบจอฝั่งขวา)
  align?: 'left' | 'right'
}

// ปุ่มไอคอน (?) เล็กๆ ข้างหัวข้อแต่ละหน้า กดแล้วเด้ง popover อธิบายวิธีอ่าน/ใช้หน้านั้นๆ
// ใช้ซ้ำได้ทุกหน้า แค่เปลี่ยน title/children ตามเนื้อหาของแต่ละหน้า
export default function HelpTooltip({ title, children, align = 'left' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // ปิด popover เมื่อคลิกข้างนอก หรือกด Escape
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`วิธีใช้หน้านี้: ${title}`}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '1px solid #dcd3c4',
          background: isOpen ? '#c67139' : '#f9f4ed',
          color: isOpen ? '#f5ead8' : '#c67139',
          cursor: 'pointer',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <HelpCircle size={14} strokeWidth={2.4} />
      </button>

      {isOpen && (
        <div
          role="dialog"
          style={{
            position: 'absolute',
            top: 30,
            [align]: 0,
            zIndex: 50,
            width: 300,
            maxWidth: '82vw',
            background: '#f9f4ed',
            border: '1px solid #dcd3c4',
            borderRadius: 16,
            boxShadow: '0 8px 28px rgba(46, 43, 37, 0.2)',
            padding: '14px 16px',
          }}
        >
          <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#201e1d' }}>
            {title}
          </p>
          <div style={{ fontSize: 12.5, color: '#474238', lineHeight: 1.7 }}>{children}</div>
        </div>
      )}
    </div>
  )
}
