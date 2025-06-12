import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Vehicle = Database['public']['Tables']['vehicles']['Row']
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert']
type VehicleUpdate = Database['public']['Tables']['vehicles']['Update']

export function useVehicles() {
  return useSWR('vehicles', async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Vehicle[]
  })
}

export function useVehicle(id: string) {
  return useSWR(id ? `vehicle-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Vehicle
  })
}

export async function createVehicle(vehicle: VehicleInsert) {
  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicle)
    .select()
    .single()
  
  if (error) throw error
  return data as Vehicle
}

export async function updateVehicle(id: string, updates: VehicleUpdate) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Vehicle
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 