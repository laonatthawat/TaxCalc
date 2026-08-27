'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import CatMascot from '@/components/CatMascot'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบ')
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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
      <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
        <Logo />
      </div>
      <div className="auth-card">
        <div className="auth-card-cat">
          <CatMascot size={72} variant="tabby" />
        </div>
        <h1 className="auth-title">เข้าสู่ระบบ</h1>
        <p className="auth-subtitle">เข้าสู่ระบบเพื่อดูรายจ่ายประจำของคุณ</p>

        {/* noValidate: ปิด popup แจ้งเตือนของ browser เอง (หน้าตาไม่เข้าธีม, เป็นภาษาอังกฤษ)
            แล้วโชว์ error ของเราเองแทนผ่าน .auth-alert-error ด้านล่างฟอร์ม */}
        <form onSubmit={handleLogin} noValidate>
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
          <div className="form-field">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <label className="form-label" style={{ marginBottom: 0 }}>
                Password
              </label>
              <a
                href="/forgot-password"
                style={{ fontSize: 12, fontWeight: 600, color: '#8c491a', textDecoration: 'none' }}
              >
                ลืมรหัสผ่าน?
              </a>
            </div>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {error && <p className="auth-alert-error">{error}</p>}

        <p className="auth-footer-link">
          ยังไม่มีบัญชี? <a href="/signup">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  )
}
