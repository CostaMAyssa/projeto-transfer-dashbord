import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente Supabase com service role para operações administrativas
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Funções administrativas para gerenciamento de dados
export const adminHelpers = {
  // Criar dados de voo (bypass RLS)
  async createFlightData(flightData: any) {
    return supabaseAdmin
      .from('flight_data')
      .insert(flightData)
      .select()
      .single()
  },

  // Atualizar dados de voo (bypass RLS)
  async updateFlightData(id: string, updates: any) {
    return supabaseAdmin
      .from('flight_data')
      .update({
        ...updates,
        api_last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
  },

  // Buscar todas as reservas (admin)
  async getAllBookings() {
    return supabaseAdmin
      .from('bookings')
      .select(`
        *,
        flight_data(*),
        vehicle(*),
        driver(*),
        booking_extras(*, extra(*))
      `)
      .order('created_at', { ascending: false })
  },

  // Atualizar status de reserva (admin)
  async updateBookingStatus(bookingId: string, status: string) {
    return supabaseAdmin
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()
  },

  // Buscar reservas por data (admin)
  async getBookingsByDate(date: string) {
    return supabaseAdmin
      .from('bookings')
      .select(`
        *,
        flight_data(*),
        vehicle(*),
        driver(*)
      `)
      .eq('pickup_date', date)
      .order('pickup_time', { ascending: true })
  },

  // Buscar voos que precisam de monitoramento
  async getFlightsToMonitor() {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    return supabaseAdmin
      .from('flight_data')
      .select(`
        *,
        bookings!flight_data_id(*)
      `)
      .gte('scheduled_departure', `${today}T00:00:00`)
      .lte('scheduled_departure', `${tomorrow}T23:59:59`)
      .in('flight_status', ['scheduled', 'active'])
      .order('scheduled_departure', { ascending: true })
  },

  // Atualizar múltiplos voos (para sincronização em lote)
  async batchUpdateFlights(updates: Array<{ id: string; data: any }>) {
    const promises = updates.map(({ id, data }) => 
      this.updateFlightData(id, data)
    )
    
    return Promise.allSettled(promises)
  },

  // Limpar dados antigos de voos (manutenção)
  async cleanupOldFlightData(daysOld: number = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
      .toISOString()
    
    return supabaseAdmin
      .from('flight_data')
      .delete()
      .lt('created_at', cutoffDate)
      .not('id', 'in', 
        supabaseAdmin
          .from('bookings')
          .select('flight_data_id')
          .not('flight_data_id', 'is', null)
      )
  },

  // Estatísticas de voos
  async getFlightStats(startDate?: string, endDate?: string) {
    let query = supabaseAdmin
      .from('flight_data')
      .select('flight_status, service_type, is_domestic')
    
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    return query
  }
}

export default supabaseAdmin