import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  completedBookings: number
  inProgressBookings: number
  cancelledBookings: number
  totalVehicles: number
  activeVehicles: number
  maintenanceVehicles: number
  activeDrivers: number
  totalRevenue: number
  monthlyRevenue: number
}

interface RecentBooking {
  id: string
  pickup_location: string
  dropoff_location: string
  pickup_date: string
  pickup_time: string
  total_amount: number
  status: string
  payment_status: string
  vehicle_name: string | null
  user_id: string | null
  created_at: string
}

interface UpcomingBooking {
  id: string
  pickup_location: string
  dropoff_location: string
  pickup_date: string
  pickup_time: string
  vehicle_name: string | null
  vehicle_type: string | null
  user_id: string | null
  passengers: number
  luggage: number
}

export function useDashboardStats() {
  return useSWR('dashboard_stats', async () => {
    // Buscar estatísticas de reservas
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('status, total_amount, created_at, payment_status')

    if (bookingsError) throw bookingsError

    // Buscar estatísticas de veículos
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('status')

    if (vehiclesError) throw vehiclesError

    // Buscar estatísticas de motoristas
    const { data: driversData, error: driversError } = await supabase
      .from('drivers')
      .select('status')

    if (driversError) throw driversError

    // Calcular estatísticas
    const totalBookings = bookingsData?.length || 0
    const pendingBookings = bookingsData?.filter(b => b.status === 'pending').length || 0
    const completedBookings = bookingsData?.filter(b => b.status === 'completed').length || 0
    const inProgressBookings = bookingsData?.filter(b => b.status === 'in_progress').length || 0
    const cancelledBookings = bookingsData?.filter(b => b.status === 'cancelled').length || 0

    const totalVehicles = vehiclesData?.length || 0
    const activeVehicles = vehiclesData?.filter(v => v.status === 'active').length || 0
    const maintenanceVehicles = vehiclesData?.filter(v => v.status === 'maintenance').length || 0

    const activeDrivers = driversData?.filter(d => d.status === 'active').length || 0

    const totalRevenue = bookingsData
      ?.filter(b => b.payment_status === 'paid')
      ?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

    // Receita do mês atual
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const monthlyRevenue = bookingsData
      ?.filter(b => 
        b.payment_status === 'paid' && 
        b.created_at?.startsWith(currentMonth)
      )
      ?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

    return {
      totalBookings,
      pendingBookings,
      completedBookings,
      inProgressBookings,
      cancelledBookings,
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      activeDrivers,
      totalRevenue,
      monthlyRevenue
    } as DashboardStats
  })
}

export function useRecentBookings() {
  return useSWR('recent_bookings', async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        pickup_location,
        dropoff_location,
        pickup_date,
        pickup_time,
        total_amount,
        status,
        payment_status,
        user_id,
        created_at,
        vehicles:vehicle_id (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    return data?.map(booking => ({
      ...booking,
      vehicle_name: booking.vehicles?.name || null
    })) as RecentBooking[]
  })
}

export function useUpcomingBookings() {
  return useSWR('upcoming_bookings', async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        pickup_location,
        dropoff_location,
        pickup_date,
        pickup_time,
        user_id,
        passengers,
        luggage,
        vehicles:vehicle_id (
          name,
          type
        )
      `)
      .gte('pickup_date', today)
      .in('status', ['pending', 'scheduled'])
      .order('pickup_date', { ascending: true })
      .order('pickup_time', { ascending: true })
      .limit(10)

    if (error) throw error

    return data?.map(booking => ({
      ...booking,
      vehicle_name: booking.vehicles?.name || null,
      vehicle_type: booking.vehicles?.type || null
    })) as UpcomingBooking[]
  })
}

export function useTodayBookings() {
  return useSWR('today_bookings', async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        pickup_location,
        dropoff_location,
        pickup_date,
        pickup_time,
        status,
        user_id,
        vehicles:vehicle_id (
          name,
          type
        )
      `)
      .eq('pickup_date', today)
      .order('pickup_time', { ascending: true })

    if (error) throw error

    return data?.map(booking => ({
      ...booking,
      vehicle_name: booking.vehicles?.name || null,
      vehicle_type: booking.vehicles?.type || null
    }))
  })
}

export function useAllBookings() {
  return useSWR('all_bookings', async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        pickup_location,
        dropoff_location,
        pickup_date,
        pickup_time,
        total_amount,
        status,
        payment_status,
        user_id,
        created_at,
        vehicle_id,
        vehicles:vehicle_id (
          id,
          name,
          type
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data?.map(booking => ({
      ...booking,
      vehicle_name: booking.vehicles?.name || null,
      vehicle_type: booking.vehicles?.type || null
    }))
  })
} 