'use server'

import { createClient } from '@/lib/supabase/server'
import { TaxDeductions } from '@/lib/taxUtils'
import { revalidatePath } from 'next/cache'

// upsert ค่าลดหย่อนภาษี — 1 คนมีได้แค่ 1 ชุด (user_id เป็น primary key เหมือน user_settings/investment_plans)
export async function saveTaxDeductions(input: TaxDeductions) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ไม่ได้ login')
  }

  const { error } = await supabase
    .from('tax_deductions')
    .upsert({ user_id: user.id, ...input }, { onConflict: 'user_id' })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/tax')
}
