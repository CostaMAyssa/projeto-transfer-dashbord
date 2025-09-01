import useSWR, { mutate } from 'swr'
import { supabase } from '@/lib/supabase'

export interface Client {
  id: number
  full_name: string
  email: string
  phone?: string
  company?: string
  role?: string
  address?: string
  tags?: string
  stripe_customer_id?: string
  preferred_currency?: string
  payment_method_id?: string
  billing_address?: string
  last_interaction?: string
  notes?: string
  status?: string
  created_at: string
  updated_at: string
}

export interface CreateClientData {
  full_name: string
  email: string
  phone?: string
  company?: string
  role?: string
  address?: string
  tags?: string
  billing_address?: string
  notes?: string
  status?: string
}

// Hook para buscar todos os clientes
export function useClients() {
  const { data, error, isLoading } = useSWR('clients', async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Client[]
  })

  return {
    clients: data || [],
    isLoading,
    isError: error,
    refresh: () => mutate('clients')
  }
}

// Hook para buscar um cliente específico
export function useClient(id: string | number) {
  const { data, error, isLoading } = useSWR(
    id ? `client-${id}` : null,
    async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Client
    }
  )

  return {
    client: data,
    isLoading,
    isError: error,
    refresh: () => mutate(`client-${id}`)
  }
}

// Função para criar um novo cliente
export async function createClient(clientData: CreateClientData) {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single()
  
  if (error) throw error
  
  // Invalidar cache
  mutate('clients')
  
  return data as Client
}

// Função para atualizar um cliente
export async function updateClient(id: string | number, clientData: Partial<CreateClientData>) {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  // Invalidar cache
  mutate('clients')
  mutate(`client-${id}`)
  
  return data as Client
}

// Função para deletar um cliente
export async function deleteClient(id: string | number) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  
  // Invalidar cache
  mutate('clients')
  mutate(`client-${id}`)
}

// Função para buscar clientes com filtros
export async function searchClients(searchTerm: string, statusFilter?: string) {
  let query = supabase
    .from('clients')
    .select('*')
  
  if (searchTerm) {
    query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
  }
  
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }
  
  query = query.order('created_at', { ascending: false })
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Client[]
}