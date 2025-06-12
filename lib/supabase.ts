import { createBrowserClient } from '@supabase/ssr'

export type Database = {
  public: {
    Tables: {
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