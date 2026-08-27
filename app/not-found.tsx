import Link from 'next/link'
import { MapPinOff } from 'lucide-react'

// Nav/Footer มาจาก ChromeGate ที่ห่อทุกหน้าไว้ใน root layout อยู่แล้ว ไม่ต้องใส่ซ้ำในนี้
export default function NotFound() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 26px',
        background: '#f5ead8',
      }}
    >
      <div style={{ width: '100%', maxWidth: 760 }}>
        <div
          style={{
            background: '#fdf7ec',
            border: '1px solid #e4d8c1',
            borderRadius: 26,
            padding: 44,
            display: 'flex',
            gap: 32,
            alignItems: 'flex-start',
            boxShadow: '0 14px 36px rgba(46,43,37,.08)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              width: 78,
              height: 78,
              flexShrink: 0,
              borderRadius: 999,
              background: '#f2e0cb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPinOff size={34} color="#9c5527" />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            <span
              style={{
                font: '600 12px/1 "Figtree",sans-serif',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: '#82796a',
              }}
            >
              error 404
            </span>
            <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.12, letterSpacing: '-0.015em' }}>ไม่มีหน้านี้แล้ว</h1>
            <p style={{ margin: 0, maxWidth: '48ch', font: '400 16px/1.7 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>
              ลิงก์ที่เปิดมาอาจพิมพ์ผิด หรือหน้านั้นถูกย้ายไปแล้ว ข้อมูลรายรับและการคำนวณภาษีของคุณยังอยู่ครบ
              ไม่ได้หายไปไหน
            </p>
            <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap', paddingTop: 6 }}>
              <Link href="/income" className="btn-gradient-primary" style={{ width: 'auto', padding: '14px 26px', textDecoration: 'none', display: 'inline-block' }}>
                ไปหน้ารายรับ
              </Link>
              <Link href="/" className="btn-secondary" style={{ padding: '14px 24px', textDecoration: 'none' }}>
                กลับหน้าแรก
              </Link>
            </div>
            <p style={{ margin: '6px 0 0', font: '400 13px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#82796a' }}>
              ถ้ากดมาจากลิงก์ในอีเมลของเรา บอกเราได้ที่ help@paijonjeb.app
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
