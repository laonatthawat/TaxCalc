import { redirect } from 'next/navigation'

// สมัคร/เข้าสู่ระบบ/ลืมรหัสผ่าน รวมเป็นหน้าเดียวที่ /login แล้ว (สลับโหมดด้วยแท็บ)
export default function ForgotPasswordRedirect() {
  redirect('/login?mode=forgot')
}
