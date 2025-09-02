import { createBrowserClient } from '@supabase/ssr'

// Tipos para as tabelas do banco de dados - API de Voos
export interface FlightData {
  id: string
  flight_number: string
  airline_code: string
  airline_name?: string
  origin_airport: string
  destination_airport: string
  scheduled_departure?: string
  actual_departure?: string
  scheduled_arrival?: string
  actual_arrival?: string
  estimated_arrival?: string
  flight_status?: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'delayed'
  gate?: string
  terminal?: string
  aircraft_type?: string
  is_domestic?: boolean
  suggested_pickup_time?: string
  service_type?: 'arrival' | 'departure'
  api_last_updated?: string
  created_at?: string
  updated_at?: string
}

export interface Booking {
  id: string
  user_id?: string
  pickup_location: string
  dropoff_location: string
  pickup_date: string
  pickup_time: string
  distance_km?: number
  duration_min?: number
  vehicle_id?: string
  driver_id?: string
  passengers: number
  luggage?: number
  flight_data_id?: string
  flight_number?: string
  is_flight_monitored?: boolean
  original_pickup_time?: string
  pickup_time_source?: 'manual' | 'flight_suggested' | 'flight_auto'
  notes?: string
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  total_amount?: number
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
  created_at?: string
  updated_at?: string
  // Relacionamentos
  flight_data?: FlightData
  vehicle?: Vehicle
  driver?: Driver
  booking_extras?: BookingExtra[]
}

export interface Vehicle {
  id: string
  name: string
  type: string
  passengers: number
  luggage: number
  year?: number
  license_plate?: string
  status: 'active' | 'maintenance' | 'inactive'
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface Driver {
  id: string
  full_name: string
  phone?: string
  email?: string
  license_number?: string
  status?: string
  avatar_url?: string
  vehicle_id?: string
  created_at?: string
  updated_at?: string
}

export interface Extra {
  id: string
  name: string
  description?: string
  price: number
  created_at?: string
}

export interface BookingExtra {
  id: string
  booking_id: string
  extra_id: string
  quantity: number
  price: number
  created_at?: string
  extra?: Extra
}

export type Database = {
  public: {
    Tables: {
      flight_data: {
        Row: FlightData
        Insert: Omit<FlightData, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FlightData, 'id'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id'>>
      }
      vehicles: {
        Row: Vehicle
        Insert: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Vehicle, 'id'>>
      }
      drivers: {
        Row: Driver
        Insert: Omit<Driver, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Driver, 'id'>>
      }
      extras: {
        Row: Extra
        Insert: Omit<Extra, 'id' | 'created_at'>
        Update: Partial<Omit<Extra, 'id'>>
      }
      booking_extras: {
        Row: BookingExtra
        Insert: Omit<BookingExtra, 'created_at'>
        Update: Partial<BookingExtra>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helpers para trabalhar com dados de voo
export const dbHelpers = {
  // Buscar dados de voo por número e data
  async getFlightData(flightNumber: string, date?: string) {
    let query = supabase
      .from('flight_data')
      .select('*')
      .eq('flight_number', flightNumber)
      .order('created_at', { ascending: false })
    
    if (date) {
      query = query.gte('scheduled_departure', `${date}T00:00:00`)
                  .lt('scheduled_departure', `${date}T23:59:59`)
    }
    
    return query.limit(1).single()
  },

  // Inserir ou atualizar dados de voo
  async upsertFlightData(flightData: Partial<FlightData>) {
    return supabase
      .from('flight_data')
      .upsert(flightData, {
        onConflict: 'flight_number,scheduled_departure',
        ignoreDuplicates: false
      })
      .select()
      .single()
  },

  // Buscar reservas com dados de voo
  async getBookingsWithFlights(userId?: string) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        flight_data(*),
        vehicle(*),
        driver(*),
        booking_extras(*, extra(*))
      `)
      .order('pickup_date', { ascending: true })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    return query
  },

  // Buscar reservas monitoradas
  async getMonitoredBookings() {
    return supabase
      .from('bookings')
      .select(`
        *,
        flight_data(*)
      `)
      .eq('is_flight_monitored', true)
      .in('status', ['pending', 'confirmed'])
      .order('pickup_date', { ascending: true })
  },

  // Atualizar status do voo
  async updateFlightStatus(flightDataId: string, updates: Partial<FlightData>) {
    return supabase
      .from('flight_data')
      .update({
        ...updates,
        api_last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', flightDataId)
      .select()
      .single()
  },

  // Buscar veículos disponíveis
  async getAvailableVehicles() {
    return supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'active')
      .order('passengers', { ascending: true })
  },

  // Buscar extras disponíveis
  async getAvailableExtras() {
    return supabase
      .from('extras')
      .select('*')
      .order('name', { ascending: true })
  }
}

export default supabase