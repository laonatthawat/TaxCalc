'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
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
    <div
      style={{
        minHeight: 'calc(100vh - 260px)',
        padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,44px) clamp(48px,6vw,72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.15, color: '#201e1d' }}>ตั้งรหัสผ่านใหม่</h1>
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
            <a href="/login?mode=forgot" style={{ font: '600 14px/1 "IBM Plex Sans Thai",sans-serif', color: '#8c491a', textDecoration: 'none' }}>
              ขอลิงก์ใหม่
            </a>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>รหัสผ่านใหม่</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                disabled={!isSessionReady}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '14px 18px',
                  borderRadius: 999,
                  border: '1px solid #c0b6a5',
                  background: '#f5ead8',
                  font: '400 15px/1 "IBM Plex Sans Thai",sans-serif',
                  color: '#201e1d',
                  outline: 'none',
                }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ font: '500 13px/1 "IBM Plex Sans Thai",sans-serif', color: '#474238' }}>ยืนยันรหัสผ่านใหม่</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="พิมพ์อีกครั้ง"
                disabled={!isSessionReady}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '14px 18px',
                  borderRadius: 999,
                  border: '1px solid #c0b6a5',
                  background: '#f5ead8',
                  font: '400 15px/1 "IBM Plex Sans Thai",sans-serif',
                  color: '#201e1d',
                  outline: 'none',
                }}
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting || !isSessionReady}
              style={{
                padding: 16,
                borderRadius: 999,
                border: 'none',
                background: isSubmitting || !isSessionReady ? '#dcd3c4' : '#c67139',
                font: '600 15px/1 "IBM Plex Sans Thai",sans-serif',
                color: isSubmitting || !isSessionReady ? '#82796a' : '#f5ead8',
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'กำลังบันทึก...' : isSessionReady ? 'บันทึกรหัสผ่านใหม่' : 'กำลังตรวจสอบลิงก์...'}
            </button>
            {error && <p className="auth-alert-error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
