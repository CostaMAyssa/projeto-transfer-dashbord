import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Zone = Database['public']['Tables']['zones']['Row']
type ZoneInsert = Database['public']['Tables']['zones']['Insert']
type ZoneUpdate = Database['public']['Tables']['zones']['Update']

type ZonePricing = Database['public']['Tables']['zone_pricing']['Row']
type ZonePricingInsert = Database['public']['Tables']['zone_pricing']['Insert']
type ZonePricingUpdate = Database['public']['Tables']['zone_pricing']['Update']

export function useZones() {
  return useSWR('zones', async () => {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Zone[]
  })
}

export function useZone(id: string) {
  return useSWR(id ? `zone-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('zones')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Zone
  })
}

export function useZonePricing() {
  return useSWR('zone_pricing', async () => {
    const { data, error } = await supabase
      .from('zone_pricing')
      .select(`
        *,
        origin_zone:origin_zone_id (
          id,
          name,
          coverage_area
        ),
        destination_zone:destination_zone_id (
          id,
          name,
          coverage_area
        ),
        vehicle_category:vehicle_category_id (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('price', { ascending: true })
    
    if (error) throw error
    return data
  })
}

export function useZonePricingByRoute(originZoneId: string, destinationZoneId: string, vehicleCategoryId: string) {
  return useSWR(
    originZoneId && destinationZoneId && vehicleCategoryId 
      ? `zone_pricing-${originZoneId}-${destinationZoneId}-${vehicleCategoryId}` 
      : null, 
    async () => {
      const { data, error } = await supabase
        .from('zone_pricing')
        .select('*')
        .eq('origin_zone_id', originZoneId)
        .eq('destination_zone_id', destinationZoneId)
        .eq('vehicle_category_id', vehicleCategoryId)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return data as ZonePricing
    }
  )
}

export async function createZone(zone: ZoneInsert) {
  const { data, error } = await supabase
    .from('zones')
    .insert(zone)
    .select()
    .single()
  
  if (error) throw error
  return data as Zone
}

export async function updateZone(id: string, updates: ZoneUpdate) {
  const { data, error } = await supabase
    .from('zones')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Zone
}

export async function deleteZone(id: string) {
  const { error } = await supabase
    .from('zones')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function createZonePricing(pricing: ZonePricingInsert) {
  const { data, error } = await supabase
    .from('zone_pricing')
    .insert(pricing)
    .select()
    .single()
  
  if (error) throw error
  return data as ZonePricing
}

export async function updateZonePricing(id: string, updates: ZonePricingUpdate) {
  const { data, error } = await supabase
    .from('zone_pricing')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as ZonePricing
}

export async function deleteZonePricing(id: string) {
  const { error } = await supabase
    .from('zone_pricing')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 