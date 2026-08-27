import { Check, Sprout } from 'lucide-react'

// เลย์เอาต์แบบแยกจอ (aside ซ้ายเป็นข้อความ, การ์ดฟอร์มขวา) ใช้ร่วมกันทั้ง 4 หน้า auth
// เพื่อให้หน้าตาตรงกันทุกหน้าโดยไม่ต้องก็อปสไตล์ซ้ำ
const AUTH_POINTS = [
  'ใช้ฟรี ไม่มีแพ็กเกจซ่อน',
  'คิดภาษีขั้นบันไดให้พร้อมคำอธิบายทุกขั้น',
  'ลบบัญชีได้เองทุกเมื่อ ข้อมูลหายไปพร้อมกัน',
]

type Props = {
  asideTitle: string
  asideBody: string
  children: React.ReactNode
}

export default function AuthShell({ asideTitle, asideBody, children }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 26px',
        background: '#f5ead8',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -140,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: 999,
          background: '#f0dfbf',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -180,
          left: -100,
          width: 340,
          height: 340,
          borderRadius: 999,
          background: '#e6ecd6',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          display: 'grid',
          gridTemplateColumns: '1.05fr .95fr',
          gap: 52,
          alignItems: 'center',
        }}
        className="auth-shell-grid"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: '#c67139',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sprout size={19} color="#f5ead8" />
            </span>
            <span style={{ font: '600 18px/1 "IBM Plex Sans Thai",sans-serif' }}>จ่ายจนเจ็บ</span>
          </div>
          <h1
            style={{
              margin: 0,
              maxWidth: '16ch',
              fontSize: 46,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {asideTitle}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: '38ch',
              font: '400 16px/1.7 "IBM Plex Sans Thai",sans-serif',
              color: '#474238',
            }}
          >
            {asideBody}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
            {AUTH_POINTS.map((p) => (
              <div key={p} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: '#e1eecc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  <Check size={13} color="#56633f" />
                </span>
                <span style={{ font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: '#fdf7ec',
            border: '1px solid #e4d8c1',
            borderRadius: 26,
            padding: 34,
            boxShadow: '0 18px 44px rgba(46,43,37,.10)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .auth-shell-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
