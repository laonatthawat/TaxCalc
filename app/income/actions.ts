'use server'

import { createClient } from '@/lib/supabase/server'
import { getNextCycleDate, IncomeType, IncomeSub, BillingCycle } from '@/lib/incomeUtils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type IncomeInput = {
  name: string
  amount: number
  income_type: IncomeType
  income_sub: IncomeSub
  is_recurring: boolean
  billing_cycle: BillingCycle | null
  next_payment_date: string | null
  received_date: string | null
}

export async function addIncome(input: IncomeInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ไม่ได้ login')
  }

  const { error } = await supabase.from('incomes').insert({
    ...input,
    user_id: user.id,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/income')
}

export async function updateIncome(id: string, input: IncomeInput) {
  const supabase = await createClient()

  const { error } = await supabase.from('incomes').update(input).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/income')
}

export async function deleteIncome(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('incomes').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/income')
}

// ปุ่ม/checkbox "รับแล้ว" สำหรับรายรับประจำ: เลื่อนวันจ่ายถัดไปไปรอบถัดไป
export async function markIncomeAsReceived(id: string) {
  const supabase = await createClient()

  const { data: income, error: fetchError } = await supabase
    .from('incomes')
    .select('billing_cycle, next_payment_date')
    .eq('id', id)
    .single()

  if (fetchError || !income) {
    throw new Error(fetchError?.message ?? 'ไม่พบรายการนี้')
  }

  const nextDate = getNextCycleDate(income.next_payment_date, income.billing_cycle)

  const { error } = await supabase
    .from('incomes')
    .update({ next_payment_date: nextDate })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/income')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
