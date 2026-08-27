'use client'

import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sendResetLink = async () => {
    setError('')
    setIsSubmitting(true)

    const supabase = createClient()

    // ลิงก์ในอีเมลจะพาไปที่ /auth/callback ก่อน (แลก code เป็น session)
    // แล้วค่อยเด้งต่อไปหน้า /reset-password ให้ตั้งรหัสผ่านใหม่
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setIsSubmitting(false)
      return
    }

    setSentTo(email)
    setIsSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('กรุณากรอกอีเมล')
      return
    }

    await sendResetLink()
  }

  if (sentTo) {
    return (
      <AuthShell
        asideTitle="ส่งไปแล้วเรียบร้อย"
        asideBody="เปิดลิงก์จากเครื่องเดียวกันได้เลย ถ้าไม่ได้ขอลิงก์นี้เอง ปล่อยไว้เฉยๆ ก็ปลอดภัย"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>เช็กอีเมลของคุณ</h2>
          <p style={{ margin: 0, font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>
            เราส่งลิงก์ตั้งรหัสใหม่ไปแล้ว
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#e6ecd6', borderRadius: 18, padding: 18 }}>
          <MailCheck size={19} color="#56633f" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ font: '600 14px/1.4 "IBM Plex Sans Thai",sans-serif', color: '#3f4632' }}>
              ส่งลิงก์ไปที่ {sentTo} แล้ว
            </span>
            <span style={{ font: '400 13px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#4e5640' }}>
              ลิงก์ใช้ได้ 30 นาที ถ้าไม่เจอในอินบ็อกซ์ลองดูในถังขยะหรือเมลขยะ
            </span>
          </div>
        </div>

        <a href="/login" className="btn-gradient-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
          กลับไปเข้าสู่ระบบ
        </a>
        <button type="button" onClick={sendResetLink} disabled={isSubmitting} className="btn-secondary" style={{ width: '100%' }}>
          {isSubmitting ? 'กำลังส่งอีกครั้ง...' : 'ส่งอีกครั้ง'}
        </button>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      asideTitle="ตั้งรหัสใหม่ได้เลย"
      asideBody="ลิงก์ที่ส่งไปใช้ได้ครั้งเดียวและหมดอายุใน 30 นาที เพื่อความปลอดภัยของข้อมูลการเงินคุณ"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>ลืมรหัสผ่าน</h2>
        <p style={{ margin: 0, font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>
          กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสใหม่ไปให้
        </p>
      </div>

      {/* noValidate: ปิด popup แจ้งเตือนของ browser เอง (หน้าตาไม่เข้าธีม, เป็นภาษาอังกฤษ)
          แล้วโชว์ error ของเราเองแทนผ่าน .auth-alert-error ด้านล่างฟอร์ม */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label">อีเมล</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <button type="submit" className="btn-gradient-primary" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังส่ง...' : 'ส่งลิงก์ตั้งรหัสใหม่'}
        </button>
      </form>

      {error && <p className="auth-alert-error">{error}</p>}

      <p className="auth-footer-link">
        นึกรหัสผ่านออกแล้ว? <a href="/login">เข้าสู่ระบบ</a>
      </p>
    </AuthShell>
  )
}
