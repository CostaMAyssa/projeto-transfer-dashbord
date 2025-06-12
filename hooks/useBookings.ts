import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Booking = Database['public']['Tables']['bookings']['Row']
type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export function useBookings() {
  return useSWR('bookings', async () => {
    const { data, error } = await supabase
      .from('bookings')
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

export function useBooking(id: string) {
  return useSWR(id ? `booking-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicles:vehicle_id (
          id,
          name,
          type
        ),
        booking_extras (
          quantity,
          price,
          extras:extra_id (
            id,
            name,
            description
          )
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  })
}

export async function createBooking(booking: BookingInsert) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()
  
  if (error) throw error
  return data as Booking
}

export async function updateBooking(id: string, updates: BookingUpdate) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Booking
}

export async function deleteBooking(id: string) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  return updateBooking(id, { status })
} 