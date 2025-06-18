import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']
type AdminProfileInsert = Database['public']['Tables']['admin_profiles']['Insert']
type AdminProfileUpdate = Database['public']['Tables']['admin_profiles']['Update']

export function useAdminProfiles() {
  return useSWR('admin_profiles', async () => {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('full_name', { ascending: true })
    
    if (error) throw error
    return data as AdminProfile[]
  })
}

export function useAdminProfile(id: string) {
  return useSWR(id ? `admin_profile-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as AdminProfile
  })
}

export async function createAdminProfile(profile: AdminProfileInsert) {
  const { data, error } = await supabase
    .from('admin_profiles')
    .insert(profile)
    .select()
    .single()
  
  if (error) throw error
  return data as AdminProfile
}

export async function updateAdminProfile(id: string, updates: AdminProfileUpdate) {
  const { data, error } = await supabase
    .from('admin_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as AdminProfile
}

export async function deleteAdminProfile(id: string) {
  const { error } = await supabase
    .from('admin_profiles')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 