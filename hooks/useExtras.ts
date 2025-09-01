import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Extra = Database['public']['Tables']['extras']['Row']
type ExtraInsert = Database['public']['Tables']['extras']['Insert']
type ExtraUpdate = Database['public']['Tables']['extras']['Update']

export function useExtras() {
  return useSWR('extras', async () => {
    const { data, error } = await supabase
      .from('extras')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Extra[]
  })
}

export function useExtra(id: string) {
  return useSWR(id ? `extra-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('extras')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Extra
  })
}

export async function createExtra(extra: ExtraInsert) {
  const { data, error } = await supabase
    .from('extras')
    .insert(extra)
    .select()
    .single()
  
  if (error) throw error
  return data as Extra
}

export async function updateExtra(id: string, updates: ExtraUpdate) {
  const { data, error } = await supabase
    .from('extras')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Extra
}

export async function deleteExtra(id: string) {
  const { error } = await supabase
    .from('extras')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 