import { supabase, dbHelpers } from './supabase'
import { supabaseAdmin, adminHelpers } from './supabaseAdmin'

// Tipos para a API FlightAware
export interface FlightAwareConfig {
  apiKey: string
  baseUrl: string
}

export interface FlightData {
  flightNumber: string
  airline: string
  airlineCode: string
  origin: string
  destination: string
  scheduledDeparture: Date
  actualDeparture?: Date
  scheduledArrival: Date
  actualArrival?: Date
  estimatedArrival?: Date
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'delayed'
  gate?: string
  terminal?: string
  aircraftType?: string
}

export interface PickupTimeOptions {
  domesticFlight?: boolean
  hasCheckedBaggage?: boolean
  airportCode?: string
  customBufferMinutes?: number
}

// Configuração da API FlightAware
const FLIGHTAWARE_CONFIG: FlightAwareConfig = {
  apiKey: process.env.FLIGHTAWARE_API_KEY || '',
  baseUrl: 'https://aeroapi.flightaware.com/aeroapi'
}

// Mapeamento de códigos de aeroportos brasileiros
const AIRPORT_CODES = {
  'GRU': 'SBGR', // Guarulhos
  'CGH': 'SBSP', // Congonhas
  'SDU': 'SBRJ', // Santos Dumont
  'GIG': 'SBGL', // Galeão
  'BSB': 'SBBR', // Brasília
  'CNF': 'SBCF', // Confins
  'SSA': 'SBSV', // Salvador
  'REC': 'SBRF', // Recife
  'FOR': 'SBFZ', // Fortaleza
  'POA': 'SBPA', // Porto Alegre
  'CWB': 'SBCT', // Curitiba
  'MAO': 'SBEG', // Manaus
  'BEL': 'SBBE', // Belém
}

/**
 * Serviço para integração com a API FlightAware
 */
export class FlightAwareService {
  private config: FlightAwareConfig

  constructor(config?: Partial<FlightAwareConfig>) {
    this.config = { ...FLIGHTAWARE_CONFIG, ...config }
  }

  /**
   * Busca informações de um voo específico
   */
  async getFlightInfo(flightNumber: string, date: string): Promise<FlightData | null> {
    try {
      // Primeiro, verificar se já temos dados no banco
      const { data: existingFlight } = await dbHelpers.getFlightData(flightNumber, date)
      
      if (existingFlight && this.isDataFresh(existingFlight.api_last_updated)) {
        return this.mapDatabaseToFlightData(existingFlight)
      }

      // Se não temos dados ou estão desatualizados, buscar na API
      const apiData = await this.fetchFromFlightAware(flightNumber, date)
      
      if (apiData) {
        // Salvar/atualizar no banco
        await this.saveFlightData(apiData)
        return apiData
      }

      return null
    } catch (error) {
      console.error('Erro ao buscar dados do voo:', error)
      return null
    }
  }

  /**
   * Busca voos chegando em um aeroporto específico
   */
  async getAirportArrivals(airport: string, date: string): Promise<FlightData[]> {
    try {
      const icaoCode = this.getIcaoCode(airport)
      const startTime = `${date}T00:00:00Z`
      const endTime = `${date}T23:59:59Z`
      const url = `${this.config.baseUrl}/airports/${icaoCode}/flights/arrivals?start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}`
      
      const response = await fetch(url, {
        headers: {
          'x-apikey': this.config.apiKey,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return data.arrivals?.map((flight: any) => this.mapApiToFlightData(flight)) || []
    } catch (error) {
      console.error('Erro ao buscar chegadas do aeroporto:', error)
      return []
    }
  }

  /**
   * Monitora um voo específico para atualizações
   */
  async monitorFlight(flightNumber: string): Promise<void> {
    try {
      // Implementar lógica de monitoramento
      // Pode ser um webhook ou polling periódico
      console.log(`Iniciando monitoramento do voo ${flightNumber}`)
      
      // Por enquanto, apenas marcar como monitorado no banco
      const { data: flightData } = await dbHelpers.getFlightData(flightNumber)
      
      if (flightData) {
        await supabase
          .from('bookings')
          .update({ is_flight_monitored: true })
          .eq('flight_data_id', flightData.id)
      }
    } catch (error) {
      console.error('Erro ao iniciar monitoramento:', error)
    }
  }

  /**
   * Calcula horário sugerido de pickup baseado nos dados do voo
   */
  async getSuggestedPickupTime(
    flightData: FlightData, 
    serviceType: 'arrival' | 'departure',
    options: PickupTimeOptions = {}
  ): Promise<Date> {
    const {
      domesticFlight = true,
      hasCheckedBaggage = true,
      customBufferMinutes
    } = options

    if (serviceType === 'arrival') {
      const arrivalTime = flightData.estimatedArrival || flightData.scheduledArrival
      const disembarkTime = domesticFlight ? 15 : 30 // minutos
      const baggageTime = hasCheckedBaggage ? (domesticFlight ? 20 : 40) : 0
      const walkingTime = 10 // tempo para sair do aeroporto
      const bufferTime = customBufferMinutes || 15
      
      const totalMinutes = disembarkTime + baggageTime + walkingTime + bufferTime
      return new Date(arrivalTime.getTime() + totalMinutes * 60000)
    } else {
      const departureTime = flightData.scheduledDeparture
      const checkinTime = domesticFlight ? 60 : 120 // minutos antes
      const securityTime = domesticFlight ? 30 : 45 // tempo de segurança
      const bufferTime = customBufferMinutes || 30
      
      const totalMinutes = checkinTime + securityTime + bufferTime
      return new Date(departureTime.getTime() - totalMinutes * 60000)
    }
  }

  /**
   * Atualiza dados de voos monitorados
   */
  async updateMonitoredFlights(): Promise<void> {
    try {
      const { data: monitoredBookings } = await dbHelpers.getMonitoredBookings()
      
      if (!monitoredBookings?.length) return

      const updates = []
      
      for (const booking of monitoredBookings) {
        if (booking.flight_data?.flight_number) {
          const updatedFlight = await this.getFlightInfo(
            booking.flight_data.flight_number,
            booking.pickup_date
          )
          
          if (updatedFlight && booking.flight_data_id) {
            updates.push({
              id: booking.flight_data_id,
              data: this.mapFlightDataToDatabase(updatedFlight)
            })
          }
        }
      }

      if (updates.length > 0) {
        await adminHelpers.batchUpdateFlights(updates)
      }
    } catch (error) {
      console.error('Erro ao atualizar voos monitorados:', error)
    }
  }

  // Métodos privados

  private async fetchFromFlightAware(flightNumber: string, date: string): Promise<FlightData | null> {
    try {
      const url = `${this.config.baseUrl}/flights/${flightNumber}`
      
      const response = await fetch(url, {
        headers: {
          'x-apikey': this.config.apiKey,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Voo ${flightNumber} não encontrado`)
          return null
        }
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      return this.mapApiToFlightData(data.flights?.[0])
    } catch (error) {
      console.error('Erro na API FlightAware:', error)
      return null
    }
  }

  private mapApiToFlightData(apiData: any): FlightData {
    return {
      flightNumber: apiData.ident || apiData.flight_number,
      airline: apiData.operator || '',
      airlineCode: apiData.operator_iata || '',
      origin: apiData.origin?.code || '',
      destination: apiData.destination?.code || '',
      scheduledDeparture: new Date(apiData.scheduled_out),
      actualDeparture: apiData.actual_out ? new Date(apiData.actual_out) : undefined,
      scheduledArrival: new Date(apiData.scheduled_in),
      actualArrival: apiData.actual_in ? new Date(apiData.actual_in) : undefined,
      estimatedArrival: apiData.estimated_in ? new Date(apiData.estimated_in) : undefined,
      status: this.mapFlightStatus(apiData.status),
      gate: apiData.gate_destination,
      terminal: apiData.terminal_destination,
      aircraftType: apiData.aircraft_type
    }
  }

  private mapDatabaseToFlightData(dbData: any): FlightData {
    return {
      flightNumber: dbData.flight_number,
      airline: dbData.airline_name || '',
      airlineCode: dbData.airline_code,
      origin: dbData.origin_airport,
      destination: dbData.destination_airport,
      scheduledDeparture: new Date(dbData.scheduled_departure),
      actualDeparture: dbData.actual_departure ? new Date(dbData.actual_departure) : undefined,
      scheduledArrival: new Date(dbData.scheduled_arrival),
      actualArrival: dbData.actual_arrival ? new Date(dbData.actual_arrival) : undefined,
      estimatedArrival: dbData.estimated_arrival ? new Date(dbData.estimated_arrival) : undefined,
      status: dbData.flight_status,
      gate: dbData.gate,
      terminal: dbData.terminal,
      aircraftType: dbData.aircraft_type
    }
  }

  private mapFlightDataToDatabase(flightData: FlightData) {
    return {
      flight_number: flightData.flightNumber,
      airline_code: flightData.airlineCode,
      airline_name: flightData.airline,
      origin_airport: flightData.origin,
      destination_airport: flightData.destination,
      scheduled_departure: flightData.scheduledDeparture.toISOString(),
      actual_departure: flightData.actualDeparture?.toISOString(),
      scheduled_arrival: flightData.scheduledArrival.toISOString(),
      actual_arrival: flightData.actualArrival?.toISOString(),
      estimated_arrival: flightData.estimatedArrival?.toISOString(),
      flight_status: flightData.status,
      gate: flightData.gate,
      terminal: flightData.terminal,
      aircraft_type: flightData.aircraftType
    }
  }

  private async saveFlightData(flightData: FlightData): Promise<void> {
    try {
      await dbHelpers.upsertFlightData(this.mapFlightDataToDatabase(flightData))
    } catch (error) {
      console.error('Erro ao salvar dados do voo:', error)
    }
  }

  private mapFlightStatus(apiStatus: string): FlightData['status'] {
    const statusMap: Record<string, FlightData['status']> = {
      'Scheduled': 'scheduled',
      'Active': 'active',
      'Completed': 'landed',
      'Cancelled': 'cancelled',
      'Delayed': 'delayed'
    }
    
    return statusMap[apiStatus] || 'scheduled'
  }

  private getIcaoCode(airport: string): string {
    // Converter código IATA para ICAO se necessário
    return AIRPORT_CODES[airport.toUpperCase() as keyof typeof AIRPORT_CODES] || airport
  }

  private isDataFresh(lastUpdated: string, maxAgeMinutes: number = 15): boolean {
    const lastUpdate = new Date(lastUpdated)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)
    
    return diffMinutes < maxAgeMinutes
  }
}

// Instância singleton do serviço
export const flightAwareService = new FlightAwareService()

// Funções utilitárias
export const flightUtils = {
  /**
   * Formatar número de voo
   */
  formatFlightNumber(flightNumber: string): string {
    return flightNumber.toUpperCase().replace(/\s+/g, '')
  },

  /**
   * Verificar se é voo doméstico
   */
  isDomesticFlight(origin: string, destination: string): boolean {
    const brazilianAirports = Object.values(AIRPORT_CODES)
    return brazilianAirports.includes(origin) && brazilianAirports.includes(destination)
  },

  /**
   * Calcular diferença de tempo em minutos
   */
  getTimeDifferenceMinutes(date1: Date, date2: Date): number {
    return Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60)
  },

  /**
   * Formatar horário para exibição
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  /**
   * Obter status em português
   */
  getStatusInPortuguese(status: FlightData['status']): string {
    const statusMap = {
      'scheduled': 'Programado',
      'active': 'Em Voo',
      'landed': 'Pousou',
      'cancelled': 'Cancelado',
      'delayed': 'Atrasado'
    }
    
    return statusMap[status] || 'Desconhecido'
  }
}

export default FlightAwareService