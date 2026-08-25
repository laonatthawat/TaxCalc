import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_billing_date', { ascending: true })

  if (error) {
    return <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error.message}</p>
  }

  return (
    <DashboardClient
      initialSubscriptions={subscriptions ?? []}
      userEmail={user.email ?? ''}
    />
  )
}