import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Driver = Database['public']['Tables']['drivers']['Row']
type DriverInsert = Database['public']['Tables']['drivers']['Insert']
type DriverUpdate = Database['public']['Tables']['drivers']['Update']

export function useDrivers() {
  return useSWR('drivers', async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        vehicles:vehicle_id (
          id,
          name,
          type
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  })
}

export function useDriver(id: string) {
  return useSWR(id ? `driver-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        vehicles:vehicle_id (
          id,
          name,
          type
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  })
}

export async function createDriver(driver: DriverInsert) {
  const { data, error } = await supabase
    .from('drivers')
    .insert(driver)
    .select()
    .single()
  
  if (error) throw error
  return data as Driver
}

export async function updateDriver(id: string, updates: DriverUpdate) {
  const { data, error } = await supabase
    .from('drivers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Driver
}

export async function deleteDriver(id: string) {
  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 