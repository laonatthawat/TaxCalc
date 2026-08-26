import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import IncomeClient from '@/components/IncomeClient'

export default async function IncomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: incomes, error } = await supabase
    .from('incomes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error.message}</p>
  }

  return <IncomeClient initialIncomes={incomes ?? []} userEmail={user.email ?? ''} />
}
