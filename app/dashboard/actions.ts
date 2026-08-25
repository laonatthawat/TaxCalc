'use server'

import { createClient } from '@/lib/supabase/server'
import { getNextCycleDate } from '@/lib/subscriptionUtils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type SubscriptionInput = {
  name: string
  price: number
  billing_cycle: 'monthly' | 'yearly'
  next_billing_date: string
  category: string
}

export async function addSubscription(input: SubscriptionInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ไม่ได้ login')
  }

  const { error } = await supabase.from('subscriptions').insert({
    ...input,
    user_id: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function updateSubscription(id: string, input: SubscriptionInput) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('subscriptions')
    .update(input)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('subscriptions').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

// ปุ่ม/checkbox "จ่ายแล้ว": เลื่อนวันครบกำหนดของรายการนี้ไปรอบถัดไปเลย (ไม่ต้องเก็บ flag จ่ายแล้ว/ยัง
// แยกต่างหาก เพราะรอบใหม่ก็ถือว่า "ยังไม่จ่าย" อยู่แล้วโดยธรรมชาติ ไม่ต้องมี job มารีเซ็ตทุกเดือน)
export async function markSubscriptionAsPaid(id: string) {
  const supabase = await createClient()

  const { data: sub, error: fetchError } = await supabase
    .from('subscriptions')
    .select('billing_cycle, next_billing_date')
    .eq('id', id)
    .single()

  if (fetchError || !sub) {
    throw new Error(fetchError?.message ?? 'ไม่พบรายการนี้')
  }

  const nextDate = getNextCycleDate(sub.next_billing_date, sub.billing_cycle)

  const { error } = await supabase
    .from('subscriptions')
    .update({ next_billing_date: nextDate })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

// บันทึกงบรายจ่ายต่อเดือน ใช้ในการ์ด "มิเตอร์ความเจ็บ" — upsert ลงตาราง user_settings
// (1 คนมีได้แค่ 1 แถว เพราะ user_id เป็น primary key)
export async function updateMonthlyBudget(monthlyBudget: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ไม่ได้ login')
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, monthly_budget: monthlyBudget }, { onConflict: 'user_id' })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}