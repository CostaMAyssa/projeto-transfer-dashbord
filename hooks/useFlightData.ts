import { useState, useEffect, useCallback } from 'react'
import { flightAwareService, FlightData, PickupTimeOptions } from '../lib/flight-api'
import { dbHelpers } from '../lib/supabase'

export interface UseFlightDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number // em minutos
}

export interface FlightSearchResult {
  flight: FlightData
  suggestedPickupTime?: Date
  confidence: 'high' | 'medium' | 'low'
}

export interface UseFlightDataReturn {
  // Estado
  loading: boolean
  error: string | null
  flightData: FlightData | null
  searchResults: FlightSearchResult[]
  
  // Ações
  searchFlight: (flightNumber: string, date: string) => Promise<FlightData | null>
  getAirportArrivals: (airport: string, date: string) => Promise<FlightData[]>
  calculatePickupTime: (flight: FlightData, serviceType: 'arrival' | 'departure', options?: PickupTimeOptions) => Promise<Date>
  monitorFlight: (flightNumber: string) => Promise<void>
  clearData: () => void
  
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

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !flightData) return

    const interval = setInterval(async () => {
      if (flightData.flightNumber) {
        try {
          const updated = await flightAwareService.getFlightInfo(
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
  const searchFlight = useCallback(async (flightNumber: string, date: string): Promise<FlightData | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const flight = await flightAwareService.getFlightInfo(flightNumber, date)
      
      if (flight) {
        setFlightData(flight)
        return flight
      } else {
        setError('Voo não encontrado')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar voo'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar chegadas do aeroporto
  const getAirportArrivals = useCallback(async (airport: string, date: string): Promise<FlightData[]> => {
    setLoading(true)
    setError(null)
    
    try {
      const arrivals = await flightAwareService.getAirportArrivals(airport, date)
      
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
      return await flightAwareService.getSuggestedPickupTime(flight, serviceType, options)
    } catch (err) {
      console.error('Erro ao calcular horário de pickup:', err)
      // Fallback: retornar horário do voo
      return serviceType === 'arrival' ? flight.scheduledArrival : flight.scheduledDeparture
    }
  }, [])

  // Monitorar voo
  const monitorFlight = useCallback(async (flightNumber: string): Promise<void> => {
    try {
      await flightAwareService.monitorFlight(flightNumber)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao monitorar voo'
      setError(errorMessage)
    }
  }, [])

  // Limpar dados
  const clearData = useCallback(() => {
    setFlightData(null)
    setSearchResults([])
    setError(null)
  }, [])

  // Utilitários
  const formatFlightNumber = useCallback((flightNumber: string): string => {
    return flightNumber.toUpperCase().replace(/\s+/g, '')
  }, [])

  const isDomesticFlight = useCallback((origin: string, destination: string): boolean => {
    const brazilianAirports = ['SBGR', 'SBSP', 'SBRJ', 'SBGL', 'SBBR', 'SBCF', 'SBSV', 'SBRF', 'SBFZ', 'SBPA', 'SBCT', 'SBEG', 'SBBE']
    return brazilianAirports.includes(origin) && brazilianAirports.includes(destination)
  }, [])

  const getStatusInPortuguese = useCallback((status: FlightData['status']): string => {
    const statusMap = {
      'scheduled': 'Programado',
      'active': 'Em Voo',
      'landed': 'Pousou',
      'cancelled': 'Cancelado',
      'delayed': 'Atrasado'
    }
    
    return statusMap[status] || 'Desconhecido'
  }, [])

  return {
    // Estado
    loading,
    error,
    flightData,
    searchResults,
    
    // Ações
    searchFlight,
    getAirportArrivals,
    calculatePickupTime,
    monitorFlight,
    clearData,
    
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
        const flights = bookings
          .filter(booking => booking.flight_data)
          .map(booking => ({
            flightNumber: booking.flight_data!.flight_number,
            airline: booking.flight_data!.airline_name || '',
            airlineCode: booking.flight_data!.airline_code,
            origin: booking.flight_data!.origin_airport,
            destination: booking.flight_data!.destination_airport,
            scheduledDeparture: new Date(booking.flight_data!.scheduled_departure),
            actualDeparture: booking.flight_data!.actual_departure ? new Date(booking.flight_data!.actual_departure) : undefined,
            scheduledArrival: new Date(booking.flight_data!.scheduled_arrival),
            actualArrival: booking.flight_data!.actual_arrival ? new Date(booking.flight_data!.actual_arrival) : undefined,
            estimatedArrival: booking.flight_data!.estimated_arrival ? new Date(booking.flight_data!.estimated_arrival) : undefined,
            status: booking.flight_data!.flight_status as FlightData['status'],
            gate: booking.flight_data!.gate,
            terminal: booking.flight_data!.terminal,
            aircraftType: booking.flight_data!.aircraft_type
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
      await flightAwareService.updateMonitoredFlights()
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