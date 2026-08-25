'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
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

    setMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว กรุณาเช็คกล่องจดหมาย (รวมถึง Spam ด้วย)')
    setIsSubmitting(false)
  }

  return (
    <div className="auth-page">
      <div style={{ marginBottom: 20 }}>
        <Logo />
      </div>
      <div className="auth-card">
        <h1 className="auth-title">ลืมรหัสผ่าน</h1>
        <p className="auth-subtitle">กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
          </button>
        </form>

        {message && <p className="auth-alert-success">{message}</p>}
        {error && <p className="auth-alert-error">{error}</p>}

        <p className="auth-footer-link">
          นึกรหัสผ่านออกแล้ว? <a href="/login">เข้าสู่ระบบ</a>
        </p>
      </div>
    </div>
  )
}
