import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

// Interface para a tabela reservations
export interface Reservation {
  id: string
  reservation_number?: string // Número de reserva no formato AZ0005000NYC
  booking_reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_address: string
  destination_address: string
  pickup_date: string
  pickup_time: string
  return_date?: string
  return_time?: string
  status: string
  total_amount: number
  created_at: string
  updated_at: string
  payment_links?: any // JSON field for payment links
  payment_type?: 'single' | 'partial' // Type of payment
  payment_id?: string // Reference to payments table
  payment_status?: string // Payment status
}

export interface CreateReservationData {
  booking_reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_address: string
  destination_address: string
  pickup_date: string
  pickup_time: string
  return_date?: string
  return_time?: string
  status?: string
  total_amount: number
}

export interface UpdateReservationData {
  booking_reference?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  pickup_address?: string
  destination_address?: string
  pickup_date?: string
  pickup_time?: string
  return_date?: string
  return_time?: string
  status?: string
  total_amount?: number
}

// Hook para buscar todas as reservas
export function useReservations() {
  return useSWR('reservations', async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Reservation[]
  })
}

// Hook para buscar uma reserva específica
export function useReservation(id: string) {
  return useSWR(id ? `reservation-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Reservation
  })
}

// Hook para buscar reservas por status
export function useReservationsByStatus(status: string) {
  return useSWR(`reservations-status-${status}`, async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('status', status)
      .order('pickup_date', { ascending: true })
    
    if (error) throw error
    return data as Reservation[]
  })
}

// Hook para buscar reservas de hoje
export function useTodayReservations() {
  return useSWR('today-reservations', async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('pickup_date', today)
      .order('pickup_time', { ascending: true })
    
    if (error) throw error
    return data as Reservation[]
  })
}

// Hook para buscar próximas reservas
export function useUpcomingReservations() {
  return useSWR('upcoming-reservations', async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('pickup_date', today)
      .in('status', ['pending', 'confirmed'])
      .order('pickup_date', { ascending: true })
      .order('pickup_time', { ascending: true })
      .limit(10)
    
    if (error) throw error
    return data as Reservation[]
  })
}

// Hook para buscar reservas recentes
export function useRecentReservations() {
  return useSWR('recent-reservations', async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data as Reservation[]
  })
}

// Função para criar nova reserva
export async function createReservation(reservationData: CreateReservationData): Promise<Reservation> {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservationData)
    .select('*')
    .single()
  
  if (error) throw error
  return data as Reservation
}

// Função para atualizar reserva
export async function updateReservation(id: string, updates: UpdateReservationData): Promise<Reservation> {
  const { data, error } = await supabase
    .from('reservations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  
  if (error) throw error
  return data as Reservation
}

// Função para atualizar status da reserva
export async function updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation> {
  return updateReservation(id, { status })
}

// Função para atualizar status de pagamento


// Função para deletar reserva
export async function deleteReservation(id: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Função para buscar reservas por período
export async function getReservationsByDateRange(startDate: string, endDate: string): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .gte('pickup_date', startDate)
    .lte('pickup_date', endDate)
    .order('pickup_date', { ascending: true })
    .order('pickup_time', { ascending: true })
  
  if (error) throw error
  return data as Reservation[]
}

// Função para buscar reservas por cliente
export async function getReservationsByCustomer(customerEmail: string): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('customer_email', customerEmail)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Reservation[]
}