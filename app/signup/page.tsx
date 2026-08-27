'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AuthShell from '@/components/AuthShell'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // เช็คว่ารหัสผ่าน 2 ช่องตรงกันไหม แสดงไอคอนถูก/ผิดแบบ real-time ตอนพิมพ์
  // ไม่โชว์ไอคอนเลยถ้ายังไม่พิมพ์อะไรในช่องยืนยันรหัสผ่าน (กันกวนตาตอนหน้ายังว่างๆ)
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      return
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

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
    <AuthShell
      asideTitle="เริ่มจากเงินเดือนก้อนเดียว"
      asideBody="กรอกรายรับตามประเภทเงินได้ แล้วเราหักค่าใช้จ่าย คิดลดหย่อน และไล่ขั้นบันไดภาษีให้ทันที"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.15 }}>สมัครสมาชิก</h2>
        <p style={{ margin: 0, font: '400 14px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#6b6355' }}>
          ใช้เวลาไม่ถึงนาที และไม่มีค่าใช้จ่าย
        </p>
      </div>

      {/* noValidate: ปิด popup แจ้งเตือนของ browser เอง (หน้าตาไม่เข้าธีม, เป็นภาษาอังกฤษ)
          แล้วโชว์ error ของเราเองแทนผ่าน .auth-alert-error ด้านล่างฟอร์ม */}
      <form onSubmit={handleSignup} noValidate>
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
          <label className="form-label">รหัสผ่าน</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        </div>
        <div className="form-field">
          <label className="form-label">ยืนยันรหัสผ่าน</label>
          {/* wrapper position: relative เพื่อวางไอคอนถูก/ผิดซ้อนในช่องกรอก */}
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="form-input"
              style={{
                paddingRight: 40,
                borderColor: passwordsMismatch ? '#8a3a22' : passwordsMatch ? '#7a8a5e' : undefined,
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="พิมพ์อีกครั้ง"
            />
            {(passwordsMatch || passwordsMismatch) && (
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  pointerEvents: 'none',
                }}
              >
                {passwordsMatch ? <Check size={18} color="#7a8a5e" /> : <X size={18} color="#8a3a22" />}
              </span>
            )}
          </div>
          {passwordsMismatch && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#8a3a22' }}>รหัสผ่านไม่ตรงกัน</p>}
        </div>
        <button type="submit" className="btn-gradient-primary" disabled={isSubmitting || passwordsMismatch}>
          {isSubmitting ? 'กำลังสมัครสมาชิก...' : 'สร้างบัญชี'}
        </button>
      </form>

      {message && <p className="auth-alert-success">{message}</p>}
      {error && <p className="auth-alert-error">{error}</p>}

      <p className="auth-footer-link">
        มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
      </p>
    </AuthShell>
  )
}
