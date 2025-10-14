import { createClient } from '@supabase/supabase-js'

// Interfaces para tipagem
export interface FlightData {
  flightNumber: string
  airline: {
    name: string
    iata: string
    icao: string
  }
  departure: {
    airport: {
      name: string
      iata: string
      icao: string
    }
    terminal?: string
    gate?: string
    scheduled: string
    estimated?: string
    actual?: string
    delay: number
  }
  arrival: {
    airport: {
      name: string
      iata: string
      icao: string
    }
    terminal?: string
    gate?: string
    baggage?: string
    scheduled: string
    estimated?: string
    actual?: string
    delay: number
  }
  status: string
  aircraft?: {
    type: string
    registration: string
  }
  suggestedBoardingTime?: string
}

export interface FlightSearchParams {
  flightNumber?: string
  airportIata?: string
  scheduleType?: 'departure' | 'arrival'
  date?: string
}

export interface FlightApiResponse {
  data: FlightData | FlightData[]
  error?: string
  message?: string
}

export class GoFlightLabsService {
  private supabase
  private baseUrl: string

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // URL da Edge Function
    this.baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/flight-data`
  }

  /**
   * Busca informações de um voo específico
   */
  async getFlightInfo(flightNumber: string, date?: string): Promise<FlightData | null> {
    try {
      const requestBody = {
        flight_number: flightNumber,
        date: date || new Date().toISOString().split('T')[0]
      }

      console.log('🚀 [SERVICE] Enviando requisição para flight-data:', {
        requestBody,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        timestamp: new Date().toISOString(),
        functionUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/flight-data`
      })

      const { data, error } = await this.supabase.functions.invoke('flight-data', {
        body: requestBody
      })

      console.log('📡 [SERVICE] Resposta completa da Edge Function:', {
        data,
        error,
        hasData: !!data,
        hasError: !!error,
        errorType: error?.constructor?.name,
        dataType: typeof data,
        dataKeys: data ? Object.keys(data) : null,
        timestamp: new Date().toISOString()
      })

      // Log detalhado dos dados recebidos
      if (data) {
        console.log('📊 [SERVICE] Dados detalhados recebidos:', {
          dataStructure: {
            hasDataProperty: 'data' in data,
            hasErrorProperty: 'error' in data,
            hasMessageProperty: 'message' in data,
            topLevelKeys: Object.keys(data),
            dataPropertyType: typeof data.data,
            dataPropertyValue: data.data
          },
          fullDataObject: data
        })
      }

      // Se há erro, verificar se é 404 (voo não encontrado)
      if (error) {
        console.log('⚠️ [SERVICE] Erro na Edge Function:', {
          error,
          message: error.message,
          details: error.details,
          code: error.code,
          errorString: JSON.stringify(error),
          is404: error.message?.includes('404'),
          isFlightNotFound: error.details?.includes('Voo não encontrado')
        })
        
        // Se é erro 404, significa que o voo não foi encontrado
        // Isso não é um erro crítico, apenas retorna null
        if (error.message?.includes('404') || error.details?.includes('Voo não encontrado')) {
          console.log('ℹ️ [SERVICE] Voo não encontrado na API externa - retornando null')
          return null
        }
        
        // Para outros erros, lança exceção
        console.error('💥 [SERVICE] Erro crítico na Edge Function - lançando exceção')
        throw new Error(`Edge Function Error: ${error.message || 'Erro ao buscar informações do voo'}`)
      }

      // Verificar se os dados estão no formato esperado
      const flightData = data?.data || null
      console.log('🔍 [SERVICE] Processando dados de retorno:', {
        hasFlightData: !!flightData,
        flightDataType: typeof flightData,
        isFlightDataObject: flightData && typeof flightData === 'object',
        flightDataKeys: flightData ? Object.keys(flightData) : null,
        finalResult: flightData
      })

      return flightData
    } catch (error) {
      console.error('💥 [SERVICE] Erro na requisição:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        errorStack: error instanceof Error ? error.stack : undefined,
        errorName: error instanceof Error ? error.name : undefined,
        errorType: typeof error,
        timestamp: new Date().toISOString()
      })
      throw error
    }
  }

  /**
   * Busca horários de chegada ou partida de um aeroporto
   */
  async getAirportSchedules(
    airportIata: string, 
    type: 'departure' | 'arrival' = 'departure'
  ): Promise<FlightData[]> {
    try {
      const params = new URLSearchParams({
        airport: airportIata,
        type: type
      })

      const { data, error } = await this.supabase.functions.invoke('flight-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ params: Object.fromEntries(params) })
      })

      if (error) {
        console.error('Erro ao buscar horários do aeroporto:', error)
        throw new Error(error.message || 'Erro ao buscar horários do aeroporto')
      }

      return data?.data || []
    } catch (error) {
      console.error('Erro na requisição:', error)
      throw error
    }
  }

  /**
   * Busca dados de voo usando requisição HTTP direta (fallback)
   */
  async getFlightInfoDirect(params: FlightSearchParams): Promise<FlightApiResponse> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.flightNumber) {
        searchParams.append('flight', params.flightNumber)
      }
      
      if (params.airportIata) {
        searchParams.append('airport', params.airportIata)
      }
      
      if (params.scheduleType) {
        searchParams.append('type', params.scheduleType)
      }
      
      if (params.date) {
        searchParams.append('date', params.date)
      }

      const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro na requisição direta:', error)
      throw error
    }
  }

  /**
   * Calcula horário de embarque sugerido baseado no horário de partida
   */
  calculateSuggestedBoardingTime(departureTime: string, isInternational: boolean = true): string {
    const departure = new Date(departureTime)
    const hoursBeforeDeparture = isInternational ? 2 : 1.5 // 2h para internacional, 1.5h para doméstico
    const boardingTime = new Date(departure.getTime() - (hoursBeforeDeparture * 60 * 60 * 1000))
    
    return boardingTime.toISOString()
  }

  /**
   * Formata dados de voo para exibição
   */
  formatFlightForDisplay(flight: FlightData) {
    return {
      ...flight,
      departure: {
        ...flight.departure,
        scheduledFormatted: new Date(flight.departure.scheduled).toLocaleString('pt-BR'),
        estimatedFormatted: flight.departure.estimated 
          ? new Date(flight.departure.estimated).toLocaleString('pt-BR') 
          : null,
        actualFormatted: flight.departure.actual 
          ? new Date(flight.departure.actual).toLocaleString('pt-BR') 
          : null
      },
      arrival: {
        ...flight.arrival,
        scheduledFormatted: new Date(flight.arrival.scheduled).toLocaleString('pt-BR'),
        estimatedFormatted: flight.arrival.estimated 
          ? new Date(flight.arrival.estimated).toLocaleString('pt-BR') 
          : null,
        actualFormatted: flight.arrival.actual 
          ? new Date(flight.arrival.actual).toLocaleString('pt-BR') 
          : null
      },
      suggestedBoardingTimeFormatted: flight.suggestedBoardingTime 
        ? new Date(flight.suggestedBoardingTime).toLocaleString('pt-BR') 
        : null
    }
  }

  /**
   * Verifica se um voo está atrasado
   */
  isFlightDelayed(flight: FlightData): boolean {
    return flight.departure.delay > 0 || flight.arrival.delay > 0
  }

  /**
   * Obtém status do voo em português
   */
  getFlightStatusInPortuguese(status: string): string {
    const statusMap: Record<string, string> = {
      'scheduled': 'Programado',
      'active': 'Em voo',
      'landed': 'Pousou',
      'cancelled': 'Cancelado',
      'incident': 'Incidente',
      'diverted': 'Desviado',
      'delayed': 'Atrasado'
    }
    
    return statusMap[status.toLowerCase()] || status
  }
}

// Instância singleton do serviço
export const goFlightLabsService = new GoFlightLabsService()