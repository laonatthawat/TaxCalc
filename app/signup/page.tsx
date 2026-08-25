'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsSubmitting(false)
      return
    }

    setMessage('สมัครสำเร็จ! กรุณาเช็คอีเมลเพื่อกดยืนยันก่อน login')
    setIsSubmitting(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">สมัครสมาชิก</h1>
        <p className="auth-subtitle">สร้างบัญชีเพื่อเริ่มติดตาม subscription ของคุณ</p>

        <form onSubmit={handleSignup}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        {message && <p className="auth-alert-success">{message}</p>}
        {error && <p className="auth-alert-error">{error}</p>}

        <p className="auth-footer-link">
          มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
        </p>
      </div>
    </div>
  )
}
