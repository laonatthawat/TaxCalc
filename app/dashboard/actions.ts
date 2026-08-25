'use server'

import { createClient } from '@/lib/supabase/server'
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

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}