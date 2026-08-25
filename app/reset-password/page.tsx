'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

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

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="auth-page">
      <div style={{ marginBottom: 20 }}>
        <Logo />
      </div>
      <div className="auth-card">
        <h1 className="auth-title">ตั้งรหัสผ่านใหม่</h1>

        {isLinkInvalid ? (
          <>
            <p className="auth-subtitle">
              ลิงก์นี้หมดอายุหรือถูกใช้ไปแล้ว กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง
            </p>
            <p className="auth-footer-link">
              <a href="/forgot-password">ขอลิงก์ใหม่</a>
            </p>
          </>
        ) : (
          <>
            <p className="auth-subtitle">กรอกรหัสผ่านใหม่ที่ต้องการใช้</p>

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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
                  required
                  minLength={6}
                  disabled={!isSessionReady}
                />
              </div>
              <button
                type="submit"
                className="btn-gradient-primary"
                disabled={isSubmitting || !isSessionReady}
              >
                {isSubmitting
                  ? 'กำลังบันทึก...'
                  : isSessionReady
                    ? 'บันทึกรหัสผ่านใหม่'
                    : 'กำลังตรวจสอบลิงก์...'}
              </button>
            </form>

            {error && <p className="auth-alert-error">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
