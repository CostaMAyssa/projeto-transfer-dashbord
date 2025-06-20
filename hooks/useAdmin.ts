import { supabase } from '@/lib/supabase'
import useSWR, { mutate } from 'swr'
import type { Database } from '@/lib/supabase'

type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']
type AdminProfileInsert = Database['public']['Tables']['admin_profiles']['Insert']
type AdminProfileUpdate = Database['public']['Tables']['admin_profiles']['Update']

// Hook para buscar dados do administrador
export function useAdmin() {
  const { data, error, isLoading } = useSWR('admin_user', async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  })

  return {
    user: data,
    isLoading,
    isError: error,
  }
}

// Função de Login
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(error.message)
  mutate('admin_user', data.user, false)
  return data
}

// Função de Logout
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
  mutate('admin_user', null, false) // Limpa o cache local do usuário
}

// Função para Alterar Senha
export async function changePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
  return data
}

// Função para buscar todos os admins (exemplo, se necessário)
export function useAllAdmins() {
  const { data, error, isLoading } = useSWR('admins', async () => {
    const { data } = await supabase.from('admins').select('*')
    return data
  })

  return {
    admins: data,
    isLoading,
    isError: error,
  }
}

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