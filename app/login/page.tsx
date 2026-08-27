'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'

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

    router.push('/income')
    router.refresh()
  }

  return (
    <AuthShell
      asideTitle="ยินดีที่กลับมา"
      asideBody="รายรับทุกรายการและการประมาณภาษีปีนี้ยังอยู่ครบตามที่คุณบันทึกไว้"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>เข้าสู่ระบบ</h2>
        <p style={{ margin: 0, font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>
          กลับมาดูว่าปีนี้ภาษีขึ้นเท่าไรแล้ว
        </p>
      </div>

      {/* noValidate: ปิด popup แจ้งเตือนของ browser เอง (หน้าตาไม่เข้าธีม, เป็นภาษาอังกฤษ)
          แล้วโชว์ error ของเราเองแทนผ่าน .auth-alert-error ด้านล่างฟอร์ม */}
      <form onSubmit={handleLogin} noValidate>
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
        <div className="form-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              รหัสผ่าน
            </label>
            <a href="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: '#8c491a', textDecoration: 'none' }}>
              ลืมรหัสผ่าน?
            </a>
          </div>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัวอักษร"
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
    </AuthShell>
  )
}
