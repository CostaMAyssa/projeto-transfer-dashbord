import { useState, useEffect, useCallback } from 'react'
import { goFlightLabsService, FlightData } from '../lib/goflightlabs-service'
import { dbHelpers } from '../lib/supabase'

// Interfaces para compatibilidade
export interface FlightAlert {
  type: 'delay' | 'cancellation' | 'gate_change' | 'terminal_change'
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
}

export interface SmartSchedulingResult {
  suggestedPickupTime: Date
  confidence: 'high' | 'medium' | 'low'
  factors: string[]
  bufferTime: number
}

export interface PickupTimeOptions {
  bufferMinutes?: number
  trafficFactor?: number
  isInternational?: boolean
}

export interface UseFlightDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number // em minutos
}

export interface FlightSearchResult {
  flight: FlightData
  suggestedPickupTime?: Date
  confidence: 'high' | 'medium' | 'low'
  alerts?: FlightAlert[]
  smartScheduling?: SmartSchedulingResult
}

export interface UseFlightDataReturn {
  // Estado
  loading: boolean
  error: string | null
  flightData: FlightData | null
  searchResults: FlightSearchResult[]
  alerts: FlightAlert[]
  smartScheduling: SmartSchedulingResult | null
  
  // Ações
  searchFlight: (flightNumber: string, date: string, airline?: string) => Promise<FlightData | null>
  getRealTimeStatus: (flightNumber: string, date: string) => Promise<FlightData | null>
  getAirportArrivals: (airport: string, date: string) => Promise<FlightData[]>
  calculatePickupTime: (flight: FlightData, serviceType: 'arrival' | 'departure', options?: PickupTimeOptions) => Promise<Date>
  calculateSmartScheduling: (serviceType: 'arrival' | 'departure', options?: PickupTimeOptions) => Promise<SmartSchedulingResult | null>
  checkFlightDivergence: (flight?: FlightData) => Promise<FlightAlert[]>
  monitorFlight: (flightNumber: string) => Promise<void>
  clearData: () => void
  refresh: () => Promise<void>
  
  // Utilitários
  formatFlightNumber: (flightNumber: string) => string
  isDomesticFlight: (origin: string, destination: string) => boolean
  getStatusInPortuguese: (status: FlightData['status']) => string
}

/**
 * Hook para gerenciar dados de voos
 */
export function useFlightData(options: UseFlightDataOptions = {}): UseFlightDataReturn {
  const { autoRefresh = false, refreshInterval = 15 } = options
  
  // Estados
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flightData, setFlightData] = useState<FlightData | null>(null)
  const [searchResults, setSearchResults] = useState<FlightSearchResult[]>([])
  const [alerts, setAlerts] = useState<FlightAlert[]>([])
  const [smartScheduling, setSmartScheduling] = useState<SmartSchedulingResult | null>(null)
  const [lastSearchParams, setLastSearchParams] = useState<{ flightNumber: string; date: string } | null>(null)

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !flightData) return

    const interval = setInterval(async () => {
      if (flightData.flightNumber) {
        try {
          const updated = await goFlightLabsService.getFlightInfo(
            flightData.flightNumber,
            new Date().toISOString().split('T')[0]
          )
          if (updated) {
            setFlightData(updated)
          }
        } catch (err) {
          console.error('Erro no auto-refresh:', err)
        }
      }
    }, refreshInterval * 60 * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, flightData])

  // Buscar voo específico
  const searchFlight = useCallback(async (flightNumber: string, date: string, airline?: string): Promise<FlightData | null> => {
    console.log('🔍 [FRONTEND] Iniciando busca de voo:', {
      flightNumber,
      date,
      airline,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    })
    
    setLoading(true)
    setError(null)
    setAlerts([])
    setSmartScheduling(null)
    
    try {
      console.log('📞 [FRONTEND] Chamando goFlightLabsService.getFlightInfo...')
      console.log('🌐 [FRONTEND] Configuração do ambiente:', {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV
      })
      
      const flight = await goFlightLabsService.getFlightInfo(flightNumber, date, airline)
      
      console.log('✅ [FRONTEND] Resposta recebida do serviço:', {
        hasFlight: !!flight,
        flightData: flight ? {
          flightNumber: flight.flightNumber,
          status: flight.status,
          airline: flight.airline,
          departure: {
            airport: flight.departure?.airport,
            scheduled: flight.departure?.scheduled,
            estimated: flight.departure?.estimated,
            actual: flight.departure?.actual
          },
          arrival: {
            airport: flight.arrival?.airport,
            scheduled: flight.arrival?.scheduled,
            estimated: flight.arrival?.estimated,
            actual: flight.arrival?.actual
          }
        } : null,
        rawFlightObject: flight
      })
      
      if (flight) {
        console.log('🎯 [FRONTEND] Voo encontrado - processando dados...')
        setFlightData(flight)
        setLastSearchParams({ flightNumber, date })
        
        // Verificar alertas automaticamente
        console.log('⚠️ [FRONTEND] Verificando alertas do voo...')
        const flightAlerts = await checkFlightDivergence(flight)
        console.log('📋 [FRONTEND] Alertas encontrados:', flightAlerts)
        setAlerts(flightAlerts)
        
        // Adicionar aos resultados de busca
        const result: FlightSearchResult = {
          flight,
          confidence: 'medium',
          alerts: flightAlerts
        }
        
        setSearchResults(prev => {
          const filtered = prev.filter(r => r.flight.flightNumber !== flight.flightNumber)
          return [result, ...filtered].slice(0, 10) // Manter apenas os 10 mais recentes
        })
        
        console.log('✅ [FRONTEND] Voo processado com sucesso!')
        return flight
      } else {
        console.log('⚠️ [FRONTEND] Voo não encontrado - retornando null')
        setError(`Voo ${flightNumber} não encontrado na data ${date}. Verifique se o voo existe nesta data.`)
        return null
      }
    } catch (err) {
      console.error('❌ [FRONTEND] Erro detalhado na busca de voo:', {
        error: err,
        message: err instanceof Error ? err.message : 'Erro desconhecido',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined,
        flightNumber,
        date,
        timestamp: new Date().toISOString(),
        errorType: typeof err,
        errorConstructor: err?.constructor?.name
      })
      
      // Tratar diferentes tipos de erro com mensagens mais específicas
      let errorMessage = 'Erro ao buscar voo'
      
      if (err instanceof Error) {
        console.log('🔍 [FRONTEND] Analisando tipo de erro:', {
          errorName: err.name,
          errorMessage: err.message,
          isFlightNotFound: err.name === 'FlightNotFoundError',
          isNoData: err.name === 'NoDataError',
          isInvalidFormat: err.name === 'InvalidDataFormatError',
          isFlightSearchError: err.name === 'FlightSearchError'
        })
        
        if (err.name === 'FlightNotFoundError') {
          errorMessage = `Voo ${flightNumber} não encontrado na data ${date}. Verifique se o voo existe nesta data.`
        } else if (err.name === 'NoDataError') {
          errorMessage = `Nenhum dado encontrado para o voo ${flightNumber}. Verifique se o número do voo está correto.`
        } else if (err.name === 'InvalidDataFormatError') {
          errorMessage = `Dados do voo ${flightNumber} estão em formato inválido. Tente novamente mais tarde.`
        } else if (err.name === 'FlightSearchError') {
          errorMessage = err.message
        } else {
          errorMessage = err.message
        }
      }
      
      console.log('📝 [FRONTEND] Mensagem de erro final:', errorMessage)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
      console.log('🏁 [FRONTEND] Busca de voo finalizada')
    }
  }, [])

  // Buscar status em tempo real
  const getRealTimeStatus = useCallback(async (flightNumber: string, date: string): Promise<FlightData | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const flight = await goFlightLabsService.getFlightInfo(flightNumber, date)
      
      if (flight) {
        setFlightData(flight)
        setLastSearchParams({ flightNumber, date })
        
        // Verificar alertas automaticamente
        const flightAlerts = await checkFlightDivergence(flight)
        setAlerts(flightAlerts)
        
        return flight
      }
      
      setError('Não foi possível obter status em tempo real')
      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar status em tempo real'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar divergências de voo
  const checkFlightDivergence = useCallback(async (flight?: FlightData): Promise<FlightAlert[]> => {
    const targetFlight = flight || flightData
    if (!targetFlight) {
      setError('Nenhum dado de voo disponível para verificação')
      return []
    }

    try {
      const alerts: FlightAlert[] = []
      
      // Verificar atrasos
      if (goFlightLabsService.isFlightDelayed(targetFlight)) {
        alerts.push({
          type: 'delay',
          message: `Voo atrasado em ${targetFlight.departure.delay} minutos`,
          severity: targetFlight.departure.delay > 60 ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        })
      }
      
      // Verificar cancelamento
      if (targetFlight.status.toLowerCase() === 'cancelled') {
        alerts.push({
          type: 'cancellation',
          message: 'Voo cancelado',
          severity: 'high',
          timestamp: new Date().toISOString()
        })
      }
      
      // Verificar mudança de portão
      if (targetFlight.departure.gate && targetFlight.departure.gate !== targetFlight.arrival.gate) {
        alerts.push({
          type: 'gate_change',
          message: `Portão alterado para ${targetFlight.departure.gate}`,
          severity: 'medium',
          timestamp: new Date().toISOString()
        })
      }
      
      setAlerts(alerts)
      return alerts
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar divergências'
      setError(errorMessage)
      return []
    }
  }, [flightData])

  // Calcular agendamento inteligente
  const calculateSmartScheduling = useCallback(async (
    serviceType: 'arrival' | 'departure',
    options: PickupTimeOptions = {}
  ): Promise<SmartSchedulingResult | null> => {
    if (!flightData) {
      setError('Nenhum dado de voo disponível para cálculo')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const { bufferMinutes = 30, trafficFactor = 1.2, isInternational = true } = options
      
      const referenceTime = serviceType === 'arrival' 
        ? new Date(flightData.arrival.estimated || flightData.arrival.scheduled)
        : new Date(flightData.departure.estimated || flightData.departure.scheduled)
      
      // Calcular tempo de pickup considerando fatores
      const baseBuffer = isInternational ? 60 : 30 // minutos
      const totalBuffer = (baseBuffer + bufferMinutes + flightData.departure.delay) * trafficFactor
      
      const suggestedPickupTime = new Date(referenceTime.getTime() - (totalBuffer * 60 * 1000))
      
      const factors = [
        `Buffer base: ${baseBuffer} min`,
        `Buffer adicional: ${bufferMinutes} min`,
        `Fator de trânsito: ${trafficFactor}x`,
        `Atraso do voo: ${flightData.departure.delay} min`
      ]
      
      const confidence: 'high' | 'medium' | 'low' = 
        flightData.departure.delay === 0 ? 'high' : 
        flightData.departure.delay < 30 ? 'medium' : 'low'
      
      const scheduling: SmartSchedulingResult = {
        suggestedPickupTime,
        confidence,
        factors,
        bufferTime: totalBuffer
      }
      
      setSmartScheduling(scheduling)
      return scheduling
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular agendamento'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [flightData])

  // Atualizar dados
  const refresh = useCallback(async () => {
    if (lastSearchParams) {
      await getRealTimeStatus(lastSearchParams.flightNumber, lastSearchParams.date)
    }
  }, [lastSearchParams, getRealTimeStatus])

  // Buscar chegadas do aeroporto
  const getAirportArrivals = useCallback(async (airport: string, date: string): Promise<FlightData[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const arrivals = await goFlightLabsService.getAirportSchedules(airport, 'arrival')
      
      // Converter para resultados de busca com confiança
      const results: FlightSearchResult[] = arrivals.map(flight => ({
        flight,
        confidence: 'high' as const
      }))
      
      setSearchResults(results)
      return arrivals
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar chegadas'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Calcular horário de pickup
  const calculatePickupTime = useCallback(async (
    flight: FlightData, 
    serviceType: 'arrival' | 'departure', 
    options?: PickupTimeOptions
  ): Promise<Date> => {
    try {
      const { bufferMinutes = 30, trafficFactor = 1.2, isInternational = true } = options || {}
      
      const referenceTime = serviceType === 'arrival' 
        ? new Date(flight.arrival.estimated || flight.arrival.scheduled)
        : new Date(flight.departure.estimated || flight.departure.scheduled)
      
      const baseBuffer = isInternational ? 60 : 30
      const totalBuffer = (baseBuffer + bufferMinutes + flight.departure.delay) * trafficFactor
      
      return new Date(referenceTime.getTime() - (totalBuffer * 60 * 1000))
    } catch (err) {
      console.error('Erro ao calcular horário de pickup:', err)
      // Fallback: retornar horário do voo
      return serviceType === 'arrival' 
        ? new Date(flight.arrival.scheduled) 
        : new Date(flight.departure.scheduled)
    }
  }, [])

  // Monitorar voo
  const monitorFlight = useCallback(async (flightNumber: string): Promise<void> => {
    try {
      // Implementação básica de monitoramento
      const flight = await goFlightLabsService.getFlightInfo(flightNumber)
      if (flight) {
        setFlightData(flight)
        const alerts = await checkFlightDivergence(flight)
        setAlerts(alerts)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao monitorar voo'
      setError(errorMessage)
    }
  }, [checkFlightDivergence])

  // Limpar dados
  const clearData = useCallback(() => {
    setFlightData(null)
    setSearchResults([])
    setError(null)
    setAlerts([])
    setSmartScheduling(null)
    setLastSearchParams(null)
  }, [])

  // Utilitários
  const formatFlightNumber = useCallback((flightNumber: string): string => {
    return flightNumber.toUpperCase().replace(/\s+/g, '')
  }, [])
  
  const isDomesticFlight = useCallback((origin: string, destination: string): boolean => {
    // Lista de códigos de aeroportos brasileiros (simplificada)
    const brazilianAirports = ['GRU', 'CGH', 'BSB', 'SDU', 'GIG', 'CNF', 'SSA', 'REC', 'FOR', 'POA', 'CWB', 'FLN']
    return brazilianAirports.includes(origin) && brazilianAirports.includes(destination)
  }, [])
  
  const getStatusInPortuguese = useCallback((status: string): string => {
    return goFlightLabsService.getFlightStatusInPortuguese(status)
  }, [])
  
  // Auto-refresh usando GoFlightLabs
  useEffect(() => {
    if (!autoRefresh || !flightData) return

    const interval = setInterval(async () => {
      if (flightData.flightNumber) {
        try {
          const updated = await goFlightLabsService.getFlightInfo(
            flightData.flightNumber,
            new Date().toISOString().split('T')[0]
          )
          if (updated) {
            setFlightData(updated)
          }
        } catch (err) {
          console.error('Erro no auto-refresh:', err)
        }
      }
    }, refreshInterval * 60 * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, flightData])
  
  return {
    // Estado
    loading,
    error,
    flightData,
    searchResults,
    alerts,
    smartScheduling,
    
    // Ações
    searchFlight,
    getRealTimeStatus,
    getAirportArrivals,
    calculatePickupTime,
    calculateSmartScheduling,
    checkFlightDivergence,
    monitorFlight,
    clearData,
    refresh,
    
    // Utilitários
    formatFlightNumber,
    isDomesticFlight,
    getStatusInPortuguese
  }
}

/**
 * Hook específico para busca de voos com debounce
 */
export function useFlightSearch(debounceMs: number = 500) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<FlightData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const { searchFlight, getAirportArrivals } = useFlightData()

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      
      try {
        // Se parece com número de voo (ex: LA3090, G31234)
        if (/^[A-Z]{1,3}\d{1,4}$/i.test(query.trim())) {
          const today = new Date().toISOString().split('T')[0]
          const flight = await searchFlight(query.trim(), today)
          setSuggestions(flight ? [flight] : [])
        }
        // Se parece com código de aeroporto (ex: GRU, CGH)
        else if (/^[A-Z]{3}$/i.test(query.trim())) {
          const today = new Date().toISOString().split('T')[0]
          const arrivals = await getAirportArrivals(query.trim(), today)
          setSuggestions(arrivals.slice(0, 10)) // Limitar a 10 resultados
        }
        else {
          setSuggestions([])
        }
      } catch (error) {
        console.error('Erro na busca:', error)
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [query, debounceMs, searchFlight, getAirportArrivals])

  return {
    query,
    setQuery,
    suggestions,
    isSearching,
    clearSuggestions: () => setSuggestions([])
  }
}

/**
 * Hook para monitoramento de voos
 */
export function useFlightMonitoring() {
  const [monitoredFlights, setMonitoredFlights] = useState<FlightData[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
  // Carregar voos monitorados
  const loadMonitoredFlights = useCallback(async () => {
    try {
      const { data: bookings } = await dbHelpers.getMonitoredBookings()
      
      if (bookings) {
        const flights: FlightData[] = bookings
          .filter(booking => booking.flight_data)
          .map(booking => ({
            flightNumber: booking.flight_data!.flight_number,
            airline: {
              name: booking.flight_data!.airline_name || '',
              iata: booking.flight_data!.airline_code || '',
              icao: booking.flight_data!.airline_code || ''
            },
            departure: {
              airport: {
                name: booking.flight_data!.origin_airport || '',
                iata: booking.flight_data!.origin_airport || '',
                icao: booking.flight_data!.origin_airport || ''
              },
              scheduled: booking.flight_data!.scheduled_departure,
              actual: booking.flight_data!.actual_departure,
              delay: 0
            },
            arrival: {
              airport: {
                name: booking.flight_data!.destination_airport || '',
                iata: booking.flight_data!.destination_airport || '',
                icao: booking.flight_data!.destination_airport || ''
              },
              scheduled: booking.flight_data!.scheduled_arrival,
              actual: booking.flight_data!.actual_arrival,
              estimated: booking.flight_data!.estimated_arrival,
              delay: 0
            },
            status: booking.flight_data!.flight_status as FlightData['status']
          }))
        
        setMonitoredFlights(flights)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Erro ao carregar voos monitorados:', error)
    }
  }, [])

  // Atualizar voos monitorados
  const updateMonitoredFlights = useCallback(async () => {
    try {
      // await goFlightLabsService.updateMonitoredFlights() // Método não implementado ainda
      await loadMonitoredFlights() // Recarregar após atualização
    } catch (error) {
      console.error('Erro ao atualizar voos monitorados:', error)
    }
  }, [loadMonitoredFlights])

  // Carregar na inicialização
  useEffect(() => {
    loadMonitoredFlights()
  }, [loadMonitoredFlights])

  return {
    monitoredFlights,
    lastUpdate,
    loadMonitoredFlights,
    updateMonitoredFlights
  }
}

export default useFlightData