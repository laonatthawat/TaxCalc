import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WelcomeClient, { type ChecklistItem } from '@/components/WelcomeClient'

export default async function WelcomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // เช็คความคืบหน้าจากข้อมูลจริง ไม่ใช้ toggle มือกดเอง — มีรายรับแล้วหรือยัง, กรอกค่าลดหย่อนแล้วหรือยัง
  const { count: incomeCount } = await supabase
    .from('incomes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: deductions } = await supabase
    .from('tax_deductions')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const items: ChecklistItem[] = [
    {
      title: 'เพิ่มรายรับแรก',
      body: 'ใส่เงินเดือนหรือรายได้อื่น แท็บภาษีจะเริ่มคำนวณให้ทันที',
      time: '1 นาที',
      href: '/income',
      done: (incomeCount ?? 0) > 0,
    },
    {
      title: 'กรอกค่าลดหย่อนภาษี',
      body: 'ประกันสังคม ประกันชีวิต กองทุนต่าง ๆ ที่มี ช่วยลดยอดภาษีที่ต้องเสีย',
      time: '2 นาที',
      href: '/tax',
      done: !!deductions,
    },
  ]

  return <WelcomeClient items={items} />
}
