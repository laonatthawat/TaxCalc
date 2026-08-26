'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type InvestmentPlanInput = {
  initial_amount: number
  monthly_contribution: number
  annual_return_rate: number
  years: number
}

// upsert แผนการลงทุน — 1 คนมีได้แค่ 1 แผน (user_id เป็น primary key เหมือน user_settings)
export async function saveInvestmentPlan(input: InvestmentPlanInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ไม่ได้ login')
  }

  const { error } = await supabase
    .from('investment_plans')
    .upsert({ user_id: user.id, ...input }, { onConflict: 'user_id' })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/investments')
}
