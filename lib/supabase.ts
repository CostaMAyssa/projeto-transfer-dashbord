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
      admin_profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
        }
      }
      vehicles: {
        Row: {
          id: string
          name: string
          type: string
          passengers: number
          luggage: number
          year: number | null
          license_plate: string | null
          status: 'active' | 'maintenance' | 'inactive'
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          passengers: number
          luggage: number
          year?: number | null
          license_plate?: string | null
          status: 'active' | 'maintenance' | 'inactive'
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          passengers?: number
          luggage?: number
          year?: number | null
          license_plate?: string | null
          status?: 'active' | 'maintenance' | 'inactive'
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          base_price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          email: string | null
          license_number: string | null
          status: string
          avatar_url: string | null
          vehicle_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone?: string | null
          email?: string | null
          license_number?: string | null
          status?: string
          avatar_url?: string | null
          vehicle_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          email?: string | null
          license_number?: string | null
          status?: string
          avatar_url?: string | null
          vehicle_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      extras: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          created_at?: string
        }
      }
      zones: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'circular' | 'polygonal'
          center_lat: number | null
          center_lng: number | null
          radius_meters: number | null
          geojson: any | null
          coverage_area: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'circular' | 'polygonal'
          center_lat?: number | null
          center_lng?: number | null
          radius_meters?: number | null
          geojson?: any | null
          coverage_area: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'circular' | 'polygonal'
          center_lat?: number | null
          center_lng?: number | null
          radius_meters?: number | null
          geojson?: any | null
          coverage_area?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      zone_pricing: {
        Row: {
          id: string
          origin_zone_id: string
          destination_zone_id: string
          vehicle_category_id: string
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          origin_zone_id: string
          destination_zone_id: string
          vehicle_category_id: string
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          origin_zone_id?: string
          destination_zone_id?: string
          vehicle_category_id?: string
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pricing_rules: {
        Row: {
          id: string
          origin_city: string | null
          destination_city: string | null
          vehicle_type: string | null
          base_price: number
          price_per_km: number | null
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          origin_city?: string | null
          destination_city?: string | null
          vehicle_type?: string | null
          base_price: number
          price_per_km?: number | null
          currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          origin_city?: string | null
          destination_city?: string | null
          vehicle_type?: string | null
          base_price?: number
          price_per_km?: number | null
          currency?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          pickup_location: string
          dropoff_location: string
          pickup_date: string
          pickup_time: string
          distance_km: number | null
          duration_min: number | null
          vehicle_id: string | null
          flight_number: string | null
          passengers: number
          luggage: number
          notes: string | null
          total_amount: number
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          payment_status: 'unpaid' | 'paid' | 'refunded'
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          pickup_location: string
          dropoff_location: string
          pickup_date: string
          pickup_time: string
          distance_km?: number | null
          duration_min?: number | null
          vehicle_id?: string | null
          flight_number?: string | null
          passengers?: number
          luggage?: number
          notes?: string | null
          total_amount: number
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          payment_status?: 'unpaid' | 'paid' | 'refunded'
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          pickup_location?: string
          dropoff_location?: string
          pickup_date?: string
          pickup_time?: string
          distance_km?: number | null
          duration_min?: number | null
          vehicle_id?: string | null
          flight_number?: string | null
          passengers?: number
          luggage?: number
          notes?: string | null
          total_amount?: number
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          payment_status?: 'unpaid' | 'paid' | 'refunded'
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      booking_extras: {
        Row: {
          booking_id: string
          extra_id: string
          quantity: number
          price: number
        }
        Insert: {
          booking_id: string
          extra_id: string
          quantity?: number
          price: number
        }
        Update: {
          booking_id?: string
          extra_id?: string
          quantity?: number
          price?: number
        }
      }
      quotes: {
        Row: {
          id: string
          booking_reference: string
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_cpf: string | null
          quote_type: 'one-way' | 'round-trip' | 'hourly'
          pickup_address: string
          pickup_coordinates: any | null
          pickup_zone_id: string | null
          pickup_date: string
          pickup_time: string
          destination_address: string
          destination_coordinates: any | null
          destination_zone_id: string | null
          return_date: string | null
          return_time: string | null
          return_pickup_address: string | null
          return_pickup_coordinates: any | null
          return_pickup_zone_id: string | null
          return_destination_address: string | null
          return_destination_coordinates: any | null
          return_destination_zone_id: string | null
          service_hours: number | null
          service_type: 'airport-dropoff' | 'airport-pickup' | null
          flight_number: string | null
          airline: string | null
          vehicle_category_id: string
          passengers: number
          luggage_large: number
          luggage_small: number
          base_price: number
          extras_price: number | null
          total_amount: number
          extras: any | null
          expires_days: number
          expires_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          booking_reference: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_cpf?: string | null
          quote_type: 'one-way' | 'round-trip' | 'hourly'
          pickup_address: string
          pickup_coordinates?: any | null
          pickup_zone_id?: string | null
          pickup_date: string
          pickup_time: string
          destination_address: string
          destination_coordinates?: any | null
          destination_zone_id?: string | null
          return_date?: string | null
          return_time?: string | null
          return_pickup_address?: string | null
          return_pickup_coordinates?: any | null
          return_pickup_zone_id?: string | null
          return_destination_address?: string | null
          return_destination_coordinates?: any | null
          return_destination_zone_id?: string | null
          service_hours?: number | null
          service_type?: 'airport-dropoff' | 'airport-pickup' | null
          flight_number?: string | null
          airline?: string | null
          vehicle_category_id: string
          passengers?: number
          luggage_large?: number
          luggage_small?: number
          base_price?: number
          extras_price?: number | null
          total_amount?: number
          extras?: any | null
          expires_days?: number
          expires_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          booking_reference?: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_cpf?: string | null
          quote_type?: 'one-way' | 'round-trip' | 'hourly'
          pickup_address?: string
          pickup_coordinates?: any | null
          pickup_zone_id?: string | null
          pickup_date?: string
          pickup_time?: string
          destination_address?: string
          destination_coordinates?: any | null
          destination_zone_id?: string | null
          return_date?: string | null
          return_time?: string | null
          return_pickup_address?: string | null
          return_pickup_coordinates?: any | null
          return_pickup_zone_id?: string | null
          return_destination_address?: string | null
          return_destination_coordinates?: any | null
          return_destination_zone_id?: string | null
          service_hours?: number | null
          service_type?: 'airport-dropoff' | 'airport-pickup' | null
          flight_number?: string | null
          airline?: string | null
          vehicle_category_id?: string
          passengers?: number
          luggage_large?: number
          luggage_small?: number
          base_price?: number
          extras_price?: number | null
          total_amount?: number
          extras?: any | null
          expires_days?: number
          expires_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          whatsapp: string | null
          address: string | null
          company: string | null
          role: string | null
          position: string | null
          tags: string | null
          stripe_customer_id: string | null
          preferred_currency: string | null
          payment_method_id: string | null
          billing_address: string | null
          last_interaction: string | null
          customer_cpf: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          whatsapp?: string | null
          address?: string | null
          company?: string | null
          role?: string | null
          position?: string | null
          tags?: string | null
          stripe_customer_id?: string | null
          preferred_currency?: string | null
          payment_method_id?: string | null
          billing_address?: string | null
          last_interaction?: string | null
          customer_cpf?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          whatsapp?: string | null
          address?: string | null
          company?: string | null
          role?: string | null
          position?: string | null
          tags?: string | null
          stripe_customer_id?: string | null
          preferred_currency?: string | null
          payment_method_id?: string | null
          billing_address?: string | null
          last_interaction?: string | null
          customer_cpf?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      vw_bookings_full: {
        Row: {
          id: string
          user_id: string | null
          pickup_location: string
          dropoff_location: string
          pickup_date: string
          pickup_time: string
          distance_km: number | null
          duration_min: number | null
          vehicle_id: string | null
          flight_number: string | null
          passengers: number
          luggage: number
          notes: string | null
          total_amount: number
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          payment_status: 'unpaid' | 'paid' | 'refunded'
          payment_method: string | null
          created_at: string
          updated_at: string
          vehicle_name: string | null
          driver_name: string | null
        }
      }
    }
    Functions: {
      create_booking: {
        Args: {
          p_pickup_location: string
          p_dropoff_location: string
          p_pickup_date: string
          p_pickup_time: string
          p_vehicle_id: string
          p_passengers: number
          p_luggage: number
          p_flight_number: string | null
          p_notes: string | null
          p_extras: any
        }
        Returns: string
      }
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