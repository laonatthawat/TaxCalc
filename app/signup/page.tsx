'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

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
      return
    }

    setMessage('สมัครสำเร็จ! กรุณาเช็คอีเมลเพื่อกดยืนยันก่อน login')
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h1>สมัครสมาชิก</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>
          สมัครสมาชิก
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a>
      </p>
    </div>
  )
}