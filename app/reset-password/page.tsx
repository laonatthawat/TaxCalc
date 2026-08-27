'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [isLinkInvalid, setIsLinkInvalid] = useState(false)
  const router = useRouter()

  // หน้านี้ต้องมาจากลิงก์รีเซ็ตในอีเมลเท่านั้น (มันจะฝัง session ชั่วคราวไว้ให้ผ่าน /auth/callback)
  // ถ้าเข้าตรงๆ หรือลิงก์หมดอายุ/ถูกใช้ไปแล้ว จะไม่มี session ให้ตั้งรหัสผ่านใหม่ไม่ได้
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsSessionReady(true)
      } else {
        setIsLinkInvalid(true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password.trim() || !confirmPassword.trim()) {
      setError('กรุณากรอกรหัสผ่านให้ครบทุกช่อง')
      return
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setIsSubmitting(false)
      return
    }

    router.push('/income')
    router.refresh()
  }

  return (
    <AuthShell
      asideTitle="ตั้งรหัสใหม่ได้เลย"
      asideBody="ลิงก์ที่ส่งไปใช้ได้ครั้งเดียวและหมดอายุใน 30 นาที เพื่อความปลอดภัยของข้อมูลการเงินคุณ"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>ตั้งรหัสผ่านใหม่</h2>
        {!isLinkInvalid && (
          <p style={{ margin: 0, font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>
            กรอกรหัสผ่านใหม่ที่ต้องการใช้
          </p>
        )}
      </div>

      {isLinkInvalid ? (
        <>
          <p style={{ margin: 0, font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>
            ลิงก์นี้หมดอายุหรือถูกใช้ไปแล้ว กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง
          </p>
          <p className="auth-footer-link">
            <a href="/forgot-password">ขอลิงก์ใหม่</a>
          </p>
        </>
      ) : (
        <>
          {/* noValidate: ปิด popup แจ้งเตือนของ browser เอง (หน้าตาไม่เข้าธีม, เป็นภาษาอังกฤษ)
              แล้วโชว์ error ของเราเองแทนผ่าน .auth-alert-error ด้านล่างฟอร์ม */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-label">รหัสผ่านใหม่</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                disabled={!isSessionReady}
              />
            </div>
            <div className="form-field">
              <label className="form-label">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="พิมพ์อีกครั้ง"
                disabled={!isSessionReady}
              />
            </div>
            <button type="submit" className="btn-gradient-primary" disabled={isSubmitting || !isSessionReady}>
              {isSubmitting ? 'กำลังบันทึก...' : isSessionReady ? 'บันทึกรหัสผ่านใหม่' : 'กำลังตรวจสอบลิงก์...'}
            </button>
          </form>

          {error && <p className="auth-alert-error">{error}</p>}
        </>
      )}
    </AuthShell>
  )
}
