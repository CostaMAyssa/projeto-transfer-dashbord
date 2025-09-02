import { supabase, dbHelpers } from './supabase'
import { supabaseAdmin, adminHelpers } from './supabaseAdmin'

// Tipos para a API FlightAware
export interface FlightAwareConfig {
  apiKey: string
  baseUrl: string
}

export interface FlightData {
  flightNumber: string
  faFlightId?: string // Identificador único da FlightAware
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
  // Campos para alertas e monitoramento
  delayMinutes?: number
  lastUpdated?: Date
  divergenceAlert?: boolean
}

export interface FlightAlert {
  flightNumber: string
  alertType: 'delay' | 'cancellation' | 'gate_change' | 'time_divergence'
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
}

export interface SmartSchedulingResult {
  suggestedPickupTime: Date
  suggestedDropoffTime: Date
  bufferMinutes: number
  reasoning: string
  confidence: 'low' | 'medium' | 'high'
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
      
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      
      const params = new URLSearchParams({
        query: `{destination ${icaoCode}}`,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        max_pages: '3'
      })
      
      const url = `${this.config.baseUrl}/flights/search?${params}`
      
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
      const flights = data.flights || []
      
      return flights.map((flight: any) => this.mapApiToFlightData(flight))
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
   * Monitoramento em tempo real de voo específico
   */
  async getRealTimeFlightStatus(flightNumber: string, date: string): Promise<FlightData | null> {
    try {
      // Sempre buscar dados atualizados da API para tempo real
      const apiData = await this.fetchFromFlightAware(flightNumber, date)
      
      if (apiData) {
        // Salvar dados atualizados no banco
        await this.saveFlightData(apiData)
        
        // Verificar se há alertas de divergência
        const alerts = await this.checkFlightDivergence(apiData)
        if (alerts.length > 0) {
          console.log(`Alertas detectados para voo ${flightNumber}:`, alerts)
        }
        
        return apiData
      }
      
      return null
    } catch (error) {
      console.error('Erro no monitoramento em tempo real:', error)
      return null
    }
  }

  /**
   * Verificar divergências e gerar alertas
   */
  async checkFlightDivergence(flightData: FlightData): Promise<FlightAlert[]> {
    const alerts: FlightAlert[] = []
    
    try {
      // Buscar dados anteriores do banco para comparação
      const { data: previousData } = await dbHelpers.getFlightData(
        flightData.flightNumber, 
        flightData.scheduledDeparture.toISOString().split('T')[0]
      )
      
      if (previousData) {
        const prevScheduledArrival = new Date(previousData.scheduled_arrival)
        const currentScheduledArrival = flightData.scheduledArrival
        
        // Alerta de mudança de horário programado
        const timeDiff = Math.abs(currentScheduledArrival.getTime() - prevScheduledArrival.getTime()) / (1000 * 60)
        if (timeDiff > 30) { // Mudança > 30 minutos
          alerts.push({
            flightNumber: flightData.flightNumber,
            alertType: 'time_divergence',
            message: `Horário programado alterado em ${Math.round(timeDiff)} minutos`,
            severity: timeDiff > 60 ? 'high' : 'medium',
            timestamp: new Date()
          })
        }
        
        // Alerta de mudança de portão
        if (previousData.gate && flightData.gate && previousData.gate !== flightData.gate) {
          alerts.push({
            flightNumber: flightData.flightNumber,
            alertType: 'gate_change',
            message: `Portão alterado de ${previousData.gate} para ${flightData.gate}`,
            severity: 'medium',
            timestamp: new Date()
          })
        }
      }
      
      // Alerta de atraso significativo
      if (flightData.delayMinutes && flightData.delayMinutes > 30) {
        alerts.push({
          flightNumber: flightData.flightNumber,
          alertType: 'delay',
          message: `Voo atrasado em ${flightData.delayMinutes} minutos`,
          severity: flightData.delayMinutes > 120 ? 'high' : 'medium',
          timestamp: new Date()
        })
      }
      
      // Alerta de cancelamento
      if (flightData.status === 'cancelled') {
        alerts.push({
          flightNumber: flightData.flightNumber,
          alertType: 'cancellation',
          message: 'Voo cancelado',
          severity: 'high',
          timestamp: new Date()
        })
      }
      
      return alerts
    } catch (error) {
      console.error('Erro ao verificar divergências:', error)
      return []
    }
  }

  /**
   * Cálculo inteligente de horários de pickup e dropoff
   */
  async calculateSmartScheduling(
    flightData: FlightData,
    serviceType: 'arrival' | 'departure',
    options: PickupTimeOptions = {}
  ): Promise<SmartSchedulingResult> {
    try {
      const {
        domesticFlight = this.isDomesticFlight(flightData.origin, flightData.destination),
        hasCheckedBaggage = true,
        airportCode = serviceType === 'arrival' ? flightData.destination : flightData.origin,
        customBufferMinutes
      } = options
      
      let bufferMinutes = customBufferMinutes || 0
      let reasoning = 'Cálculo baseado em: '
      let confidence: 'low' | 'medium' | 'high' = 'medium'
      
      if (!customBufferMinutes) {
        // Tempo base por tipo de voo
        if (domesticFlight) {
          bufferMinutes = 45 // 45 min para voos domésticos
          reasoning += 'voo doméstico (45min base)'
        } else {
          bufferMinutes = 90 // 90 min para voos internacionais
          reasoning += 'voo internacional (90min base)'
        }
        
        // Adicionar tempo para bagagem
        if (hasCheckedBaggage) {
          bufferMinutes += 20
          reasoning += ', bagagem despachada (+20min)'
        }
        
        // Ajustar por aeroporto específico
        const airportAdjustments: Record<string, number> = {
          'GRU': 15, // Guarulhos é mais demorado
          'SBGR': 15,
          'GIG': 10, // Galeão moderado
          'SBGL': 10,
          'CGH': -10, // Congonhas mais rápido
          'SBSP': -10
        }
        
        const adjustment = airportAdjustments[airportCode] || 0
        if (adjustment !== 0) {
          bufferMinutes += adjustment
          reasoning += `, aeroporto ${airportCode} (${adjustment > 0 ? '+' : ''}${adjustment}min)`
        }
        
        // Ajustar por atraso conhecido
        if (flightData.delayMinutes && flightData.delayMinutes > 0) {
          bufferMinutes += Math.min(flightData.delayMinutes, 60) // Máximo 60 min de ajuste
          reasoning += `, atraso previsto (+${Math.min(flightData.delayMinutes, 60)}min)`
          confidence = flightData.delayMinutes > 30 ? 'high' : 'medium'
        }
        
        // Ajustar por horário do dia (rush)
        const referenceTime = serviceType === 'arrival' ? 
          (flightData.estimatedArrival || flightData.scheduledArrival) :
          flightData.scheduledDeparture
        
        const hour = referenceTime.getHours()
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
          bufferMinutes += 15
          reasoning += ', horário de pico (+15min)'
        }
      }
      
      // Calcular horários sugeridos
      const referenceTime = serviceType === 'arrival' ? 
        (flightData.estimatedArrival || flightData.scheduledArrival) :
        flightData.scheduledDeparture
      
      const suggestedPickupTime = new Date(referenceTime)
      const suggestedDropoffTime = new Date(referenceTime)
      
      if (serviceType === 'arrival') {
        // Para chegadas: pickup após o pouso + buffer
        suggestedPickupTime.setMinutes(suggestedPickupTime.getMinutes() + bufferMinutes)
        suggestedDropoffTime.setMinutes(suggestedDropoffTime.getMinutes() + bufferMinutes + 60) // +1h para transfer
      } else {
        // Para partidas: pickup antes do voo - buffer
        suggestedPickupTime.setMinutes(suggestedPickupTime.getMinutes() - bufferMinutes - 60) // -1h para transfer
        suggestedDropoffTime.setMinutes(suggestedDropoffTime.getMinutes() - bufferMinutes)
      }
      
      // Ajustar confiança baseada na qualidade dos dados
      if (flightData.status === 'active' && flightData.estimatedArrival) {
        confidence = 'high'
      } else if (flightData.status === 'scheduled') {
        confidence = 'medium'
      } else {
        confidence = 'low'
      }
      
      return {
        suggestedPickupTime,
        suggestedDropoffTime,
        bufferMinutes,
        reasoning,
        confidence
      }
    } catch (error) {
      console.error('Erro no cálculo inteligente:', error)
      
      // Fallback para cálculo simples
      const fallbackBuffer = 60
      const referenceTime = serviceType === 'arrival' ? 
        flightData.scheduledArrival : flightData.scheduledDeparture
      
      const suggestedPickupTime = new Date(referenceTime)
      const suggestedDropoffTime = new Date(referenceTime)
      
      if (serviceType === 'arrival') {
        suggestedPickupTime.setMinutes(suggestedPickupTime.getMinutes() + fallbackBuffer)
        suggestedDropoffTime.setMinutes(suggestedDropoffTime.getMinutes() + fallbackBuffer + 60)
      } else {
        suggestedPickupTime.setMinutes(suggestedPickupTime.getMinutes() - fallbackBuffer - 60)
        suggestedDropoffTime.setMinutes(suggestedDropoffTime.getMinutes() - fallbackBuffer)
      }
      
      return {
        suggestedPickupTime,
        suggestedDropoffTime,
        bufferMinutes: fallbackBuffer,
        reasoning: 'Cálculo padrão (erro no cálculo inteligente)',
        confidence: 'low'
      }
    }
  }

  /**
   * Atualiza dados de voos monitorados
   */
  async updateMonitoredFlights(): Promise<void> {
    try {
      const { data: monitoredBookings } = await dbHelpers.getMonitoredBookings()
      
      if (!monitoredBookings?.length) return

      for (const booking of monitoredBookings) {
        if (booking.flight_data?.flight_number && booking.flight_data_id) {
          const updatedFlight = await this.getRealTimeFlightStatus(
            booking.flight_data.flight_number,
            booking.pickup_date || new Date().toISOString().split('T')[0]
          )
          
          if (updatedFlight) {
            // Atualizar os dados do voo no banco usando o flight_data_id correto
            await dbHelpers.updateFlightStatus(booking.flight_data_id, {
              flight_status: updatedFlight.status,
              estimated_arrival: updatedFlight.estimatedArrival?.toISOString(),
              actual_arrival: updatedFlight.actualArrival?.toISOString(),
              actual_departure: updatedFlight.actualDeparture?.toISOString(),
              gate: updatedFlight.gate,
              terminal: updatedFlight.terminal
            })
          }
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar voos monitorados:', error)
    }
  }

  /**
   * Verificar se é voo doméstico
   */
  private isDomesticFlight(origin: string, destination: string): boolean {
    const brazilianAirports = Object.values(AIRPORT_CODES)
    return brazilianAirports.includes(origin) && brazilianAirports.includes(destination)
  }

  // Métodos privados

  private async fetchFromFlightAware(flightNumber: string, date: string): Promise<FlightData | null> {
    try {
      // Usar endpoint correto /flights/search com parâmetros de data
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      
      const params = new URLSearchParams({
        query: flightNumber,
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        max_pages: '1'
      })
      
      const url = `${this.config.baseUrl}/flights/search?${params}`
      
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
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      const flights = data.flights || []
      
      if (flights.length === 0) {
        console.warn(`Nenhum voo encontrado para ${flightNumber} na data ${date}`)
        return null
      }
      
      // Pegar o primeiro voo da lista
      return this.mapApiToFlightData(flights[0])
    } catch (error) {
      console.error('Erro na API FlightAware:', error)
      return null
    }
  }

  private mapApiToFlightData(apiData: any): FlightData {
    const scheduledDeparture = new Date(apiData.scheduled_out || apiData.scheduled_off)
    const scheduledArrival = new Date(apiData.scheduled_in || apiData.scheduled_on)
    const actualDeparture = apiData.actual_out ? new Date(apiData.actual_out) : 
                           apiData.actual_off ? new Date(apiData.actual_off) : undefined
    const actualArrival = apiData.actual_in ? new Date(apiData.actual_in) : 
                         apiData.actual_on ? new Date(apiData.actual_on) : undefined
    const estimatedArrival = apiData.estimated_in ? new Date(apiData.estimated_in) : 
                            apiData.estimated_on ? new Date(apiData.estimated_on) : undefined
    
    // Calcular atraso em minutos
    let delayMinutes = 0
    if (actualArrival && scheduledArrival) {
      delayMinutes = Math.round((actualArrival.getTime() - scheduledArrival.getTime()) / (1000 * 60))
    } else if (estimatedArrival && scheduledArrival) {
      delayMinutes = Math.round((estimatedArrival.getTime() - scheduledArrival.getTime()) / (1000 * 60))
    }
    
    return {
      flightNumber: apiData.ident,
      faFlightId: apiData.fa_flight_id,
      airline: apiData.operator || '',
      airlineCode: apiData.operator_iata || apiData.operator_icao || '',
      origin: apiData.origin?.code || '',
      destination: apiData.destination?.code || '',
      scheduledDeparture,
      actualDeparture,
      scheduledArrival,
      actualArrival,
      estimatedArrival,
      status: this.mapFlightStatus(apiData.status),
      gate: apiData.gate_destination,
      terminal: apiData.terminal_destination,
      aircraftType: apiData.aircraft_type,
      delayMinutes: Math.abs(delayMinutes),
      lastUpdated: new Date(),
      divergenceAlert: Math.abs(delayMinutes) > 15 // Alerta se atraso > 15 min
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