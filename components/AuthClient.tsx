'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, X, MailCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'signup' | 'login' | 'forgot'

const COPY: Record<Mode, { title: string; blurb: string; perks: string[] }> = {
  signup: {
    title: 'สมัครสองช่อง แล้วเริ่มได้เลย',
    blurb: 'ไม่ต้องใส่บัตร ไม่ต้องยืนยันตัวตน ไม่มีอีเมลขายของ เราถามแค่อีเมลกับรหัสผ่านเพื่อให้ข้อมูลของคุณอยู่กับคุณ',
    perks: ['ฟรีทั้งหมด ไม่มีทดลองใช้แล้วตัดบัตร', 'ใช้เวลาตั้งค่าครั้งแรกราวสองนาที', 'ลบบัญชีและข้อมูลได้เองทุกเมื่อ'],
  },
  login: {
    title: 'ยินดีที่กลับมา',
    blurb: 'ใส่อีเมลที่สมัครไว้ ตัวเลขทั้งหมดของคุณยังอยู่ครบ',
    perks: ['ข้อมูลเก่าอยู่ครบ ไม่ต้องกรอกใหม่', 'เข้าจากเครื่องไหนก็ได้', 'ลืมรหัสผ่านกดรีเซ็ตทางอีเมลได้'],
  },
  forgot: {
    title: 'ตั้งรหัสผ่านใหม่',
    blurb: 'กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้ ไม่ต้องตอบคำถามความปลอดภัย ไม่ต้องโทรหาใคร',
    perks: ['ลิงก์ใช้ได้ 30 นาที', 'ตั้งรหัสใหม่ได้เองไม่ต้องติดต่อเรา', 'ข้อมูลภาษีของคุณไม่หายไปไหน'],
  },
}

const SENT_COPY = {
  title: 'เช็กอีเมลของคุณ',
  blurb: 'ลิงก์อยู่ในอีเมลแล้ว กดจากลิงก์นั้นเพื่อตั้งรหัสใหม่ ข้อมูลเดิมของคุณยังอยู่ครบ',
  perks: COPY.forgot.perks,
}

function AuthClientInner() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' || searchParams.get('mode') === 'forgot'
    ? (searchParams.get('mode') as Mode)
    : 'login'

  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const router = useRouter()

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setMessage('')
  }

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบ')
      return
    }
    setIsSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setIsSubmitting(false)
      return
    }
    router.push('/income')
    router.refresh()
  }

  const handleSignup = async () => {
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

  const sendResetLink = async () => {
    setError('')
    setIsSubmitting(true)
    const supabase = createClient()
    // ลิงก์ในอีเมลจะพาไปที่ /auth/callback ก่อน (แลก code เป็น session) แล้วค่อยเด้งต่อไปหน้า /reset-password
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

  const handleForgot = async () => {
    if (!email.trim()) {
      setError('กรุณากรอกอีเมล')
      return
    }
    await sendResetLink()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (mode === 'signup') await handleSignup()
    else if (mode === 'login') await handleLogin()
    else await handleForgot()
  }

  const isSent = mode === 'forgot' && !!sentTo
  const copy = isSent ? SENT_COPY : COPY[mode]
  const authReady =
    mode === 'forgot' ? email.trim().includes('@') : email.trim().includes('@') && password.length >= (mode === 'signup' ? 6 : 1)

  return (
    <div
      style={{
        maxWidth: 1600,
        minHeight: 'calc(100vh - 260px)',
        padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,44px) clamp(48px,6vw,72px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(28px,4vw,56px)',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
        <h1 style={{ margin: 0, maxWidth: '18ch', fontSize: 'clamp(30px,4vw,48px)', lineHeight: 1.1, color: '#201e1d' }}>
          {copy.title}
        </h1>
        <p style={{ margin: 0, maxWidth: '44ch', fontSize: 'clamp(15px,1.4vw,17px)', fontWeight: 400, lineHeight: 1.7, color: '#474238' }}>
          {copy.blurb}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {copy.perks.map((p) => (
            <div key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Check size={18} color="#56633f" style={{ flexShrink: 0, marginTop: 3 }} />
              <span style={{ font: '400 15px/1.6 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: '1 1 380px',
          maxWidth: 460,
          minHeight: 420,
          padding: 'clamp(24px,3vw,32px)',
          borderRadius: 28,
          background: '#f9f4ed',
          border: '1px solid #dcd3c4',
          boxShadow: '0 3px 10px rgba(46,43,37,.16)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        {!isSent && (mode === 'signup' || mode === 'login') && (
          <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: '#ebddc5' }}>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              style={{
                flex: 1,
                padding: 11,
                borderRadius: 999,
                border: 'none',
                background: mode === 'signup' ? '#f9f4ed' : 'transparent',
                font: '600 14px/1 "IBM Plex Sans Thai",sans-serif',
                color: mode === 'signup' ? '#201e1d' : '#645c50',
                cursor: 'pointer',
              }}
            >
              สมัครใหม่
            </button>
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={{
                flex: 1,
                padding: 11,
                borderRadius: 999,
                border: 'none',
                background: mode === 'login' ? '#f9f4ed' : 'transparent',
                font: '600 14px/1 "IBM Plex Sans Thai",sans-serif',
                color: mode === 'login' ? '#201e1d' : '#645c50',
                cursor: 'pointer',
              }}
            >
              เข้าสู่ระบบ
            </button>
          </div>
        )}

        {isSent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                background: '#e1eecc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MailCheck size={22} color="#56633f" />
            </span>
            <span style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.3, color: '#201e1d' }}>ส่งลิงก์ไปแล้ว</span>
            <p style={{ margin: 0, font: '400 15px/1.7 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>
              เราส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่ {sentTo} แล้ว ลิงก์ใช้ได้ 30 นาที ถ้าไม่เจอในกล่องจดหมาย ลองดูในโฟลเดอร์สแปม
            </p>
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={{
                marginTop: 4,
                padding: 15,
                borderRadius: 999,
                border: 'none',
                background: '#c67139',
                font: '600 15px/1 "IBM Plex Sans Thai",sans-serif',
                color: '#f5ead8',
                cursor: 'pointer',
              }}
            >
              กลับไปเข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={sendResetLink}
              disabled={isSubmitting}
              style={{ background: 'none', border: 'none', padding: 0, font: '500 14px/1.5 "IBM Plex Sans Thai",sans-serif', color: '#8c491a', cursor: 'pointer' }}
            >
              ยังไม่ได้รับ ส่งใหม่อีกครั้ง
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>อีเมล</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 999,
                  border: '1px solid #c0b6a5',
                  background: '#f5ead8',
                  font: '400 15px/1 "IBM Plex Sans Thai",sans-serif',
                  color: '#201e1d',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </label>

            {(mode === 'signup' || mode === 'login') && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>รหัสผ่าน</span>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      style={{ background: 'none', border: 'none', padding: 0, font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#8c491a', cursor: 'pointer' }}
                    >
                      ลืมรหัสผ่าน
                    </button>
                  )}
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder={mode === 'signup' ? 'อย่างน้อย 6 ตัวอักษร' : 'อย่างน้อย 8 ตัว'}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 999,
                    border: '1px solid #c0b6a5',
                    background: '#f5ead8',
                    font: '400 15px/1 "IBM Plex Sans Thai",sans-serif',
                    color: '#201e1d',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </label>
            )}

            {mode === 'signup' && (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>ยืนยันรหัสผ่าน</span>
                <div style={{ position: 'relative' }}>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="พิมพ์อีกครั้ง"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '14px 40px 14px 18px',
                      borderRadius: 999,
                      border: `1px solid ${passwordsMismatch ? '#8a3a22' : passwordsMatch ? '#7a8a5e' : '#c0b6a5'}`,
                      background: '#f5ead8',
                      font: '400 15px/1 "IBM Plex Sans Thai",sans-serif',
                      color: '#201e1d',
                      outline: 'none',
                    }}
                  />
                  {(passwordsMatch || passwordsMismatch) && (
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                      {passwordsMatch ? <Check size={18} color="#7a8a5e" /> : <X size={18} color="#8a3a22" />}
                    </span>
                  )}
                </div>
                {passwordsMismatch && <p style={{ margin: 0, fontSize: 12, color: '#8a3a22' }}>รหัสผ่านไม่ตรงกัน</p>}
              </label>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !authReady || (mode === 'signup' && passwordsMismatch)}
              style={{
                padding: 16,
                borderRadius: 999,
                border: 'none',
                background: isSubmitting || !authReady ? '#dcd3c4' : '#c67139',
                font: '600 15px/1 "IBM Plex Sans Thai",sans-serif',
                color: isSubmitting || !authReady ? '#82796a' : '#f5ead8',
                cursor: 'pointer',
              }}
            >
              {isSubmitting
                ? mode === 'signup'
                  ? 'กำลังสมัครสมาชิก...'
                  : mode === 'login'
                    ? 'กำลังเข้าสู่ระบบ...'
                    : 'กำลังส่ง...'
                : mode === 'signup'
                  ? 'สร้างบัญชี'
                  : mode === 'login'
                    ? 'เข้าสู่ระบบ'
                    : 'ส่งลิงก์ตั้งรหัสใหม่'}
            </button>

            {message && <p className="auth-alert-success">{message}</p>}
            {error && <p className="auth-alert-error">{error}</p>}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{ background: 'none', border: 'none', padding: 0, font: '500 14px/1 "IBM Plex Sans Thai",sans-serif', color: '#8c491a', cursor: 'pointer' }}
              >
                ← กลับไปเข้าสู่ระบบ
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthClientInner
