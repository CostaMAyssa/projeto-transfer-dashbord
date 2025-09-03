import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interfaces para tipagem
interface GoFlightLabsResponse {
  data: FlightDataRaw[]
  pagination?: {
    limit: number
    offset: number
    count: number
    total: number
  }
}

interface FlightDataRaw {
  flight_date: string
  flight_status: string
  departure: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal: string
    gate: string
    delay: number
    scheduled: string
    estimated: string
    actual: string
  }
  arrival: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal: string
    gate: string
    baggage: string
    delay: number
    scheduled: string
    estimated: string
    actual: string
  }
  airline: {
    name: string
    iata: string
    icao: string
  }
  flight: {
    number: string
    iata: string
    icao: string
    codeshared: any
  }
  aircraft: {
    registration: string
    iata: string
    icao: string
    icao24: string
  }
  live: {
    updated: string
    latitude: number
    longitude: number
    altitude: number
    direction: number
    speed_horizontal: number
    speed_vertical: number
    is_ground: boolean
  }
}

interface FlightData {
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

class GoFlightLabsService {
  private accessKey: string
  private baseUrl = 'http://api.aviationstack.com/v1'
  private supabase: any

  constructor(accessKey: string, supabaseUrl: string, supabaseKey: string) {
    this.accessKey = accessKey
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<GoFlightLabsResponse> {
    const url = new URL(`${this.baseUrl}/${endpoint}`)
    url.searchParams.append('access_key', this.accessKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    console.log(`Fazendo requisição para: ${url.toString()}`)

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`Erro na API GoFlightLabs: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }

  private transformFlightData(rawData: FlightDataRaw): FlightData {
    // Calcula horário de embarque sugerido (1.5h antes para voos internacionais, 1h para domésticos)
    const departureTime = new Date(rawData.departure.scheduled)
    const boardingTime = new Date(departureTime.getTime() - (90 * 60 * 1000)) // 1.5h antes

    return {
      flightNumber: rawData.flight.iata || rawData.flight.number,
      airline: {
        name: rawData.airline.name,
        iata: rawData.airline.iata,
        icao: rawData.airline.icao
      },
      departure: {
        airport: {
          name: rawData.departure.airport,
          iata: rawData.departure.iata,
          icao: rawData.departure.icao
        },
        terminal: rawData.departure.terminal,
        gate: rawData.departure.gate,
        scheduled: rawData.departure.scheduled,
        estimated: rawData.departure.estimated,
        actual: rawData.departure.actual,
        delay: rawData.departure.delay || 0
      },
      arrival: {
        airport: {
          name: rawData.arrival.airport,
          iata: rawData.arrival.iata,
          icao: rawData.arrival.icao
        },
        terminal: rawData.arrival.terminal,
        gate: rawData.arrival.gate,
        baggage: rawData.arrival.baggage,
        scheduled: rawData.arrival.scheduled,
        estimated: rawData.arrival.estimated,
        actual: rawData.arrival.actual,
        delay: rawData.arrival.delay || 0
      },
      status: rawData.flight_status,
      aircraft: {
        type: rawData.aircraft?.iata || 'N/A',
        registration: rawData.aircraft?.registration || 'N/A'
      },
      suggestedBoardingTime: boardingTime.toISOString()
    }
  }

  async getFlightInfo(flightNumber: string, date?: string): Promise<FlightData | null> {
    try {
      const params: Record<string, string> = {
        flight_iata: flightNumber
      }
      
      if (date) {
        params.flight_date = date
      }

      const response = await this.makeRequest('flights', params)
      
      if (!response.data || response.data.length === 0) {
        return null
      }

      const flightData = this.transformFlightData(response.data[0])
      
      // Salvar no banco de dados
      await this.saveFlightData(response.data[0], flightData)
      
      return flightData
    } catch (error) {
      console.error('Erro ao buscar informações do voo:', error)
      throw error
    }
  }

  async getAirportSchedules(airportIata: string, type: 'departure' | 'arrival' = 'departure'): Promise<FlightData[]> {
    try {
      const endpoint = type === 'departure' ? 'flights' : 'flights'
      const params: Record<string, string> = {}
      
      if (type === 'departure') {
        params.dep_iata = airportIata
      } else {
        params.arr_iata = airportIata
      }

      const response = await this.makeRequest(endpoint, params)
      
      if (!response.data || response.data.length === 0) {
        return []
      }

      const flights = response.data.map(flight => this.transformFlightData(flight))
      
      // Salvar horários do aeroporto no banco
      await this.saveAirportSchedules(airportIata, type, response.data)
      
      return flights
    } catch (error) {
      console.error('Erro ao buscar horários do aeroporto:', error)
      throw error
    }
  }

  private async saveFlightData(rawData: FlightDataRaw, transformedData: FlightData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('flight_data')
        .upsert({
          flight_number: transformedData.flightNumber,
          airline_iata: transformedData.airline.iata,
          airline_icao: transformedData.airline.icao,
          airline_name: transformedData.airline.name,
          departure_airport_iata: transformedData.departure.airport.iata,
          departure_airport_icao: transformedData.departure.airport.icao,
          departure_airport_name: transformedData.departure.airport.name,
          departure_terminal: transformedData.departure.terminal,
          departure_gate: transformedData.departure.gate,
          departure_scheduled: transformedData.departure.scheduled,
          departure_estimated: transformedData.departure.estimated,
          departure_actual: transformedData.departure.actual,
          arrival_airport_iata: transformedData.arrival.airport.iata,
          arrival_airport_icao: transformedData.arrival.airport.icao,
          arrival_airport_name: transformedData.arrival.airport.name,
          arrival_terminal: transformedData.arrival.terminal,
          arrival_gate: transformedData.arrival.gate,
          arrival_scheduled: transformedData.arrival.scheduled,
          arrival_estimated: transformedData.arrival.estimated,
          arrival_actual: transformedData.arrival.actual,
          flight_status: transformedData.status,
          aircraft_type: transformedData.aircraft?.type,
          baggage_belt: transformedData.arrival.baggage,
          delay_minutes: transformedData.departure.delay,
          raw_data: rawData
        }, {
          onConflict: 'flight_number,departure_scheduled'
        })

      if (error) {
        console.error('Erro ao salvar dados do voo:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar no banco:', error)
    }
  }

  private async saveAirportSchedules(airportIata: string, type: 'departure' | 'arrival', flights: FlightDataRaw[]): Promise<void> {
    try {
      const schedules = flights.map(flight => ({
        airport_iata: airportIata,
        airport_icao: type === 'departure' ? flight.departure.icao : flight.arrival.icao,
        airport_name: type === 'departure' ? flight.departure.airport : flight.arrival.airport,
        schedule_type: type,
        flight_number: flight.flight.iata || flight.flight.number,
        airline_iata: flight.airline.iata,
        airline_name: flight.airline.name,
        destination_airport_iata: type === 'departure' ? flight.arrival.iata : null,
        origin_airport_iata: type === 'arrival' ? flight.departure.iata : null,
        scheduled_time: type === 'departure' ? flight.departure.scheduled : flight.arrival.scheduled,
        estimated_time: type === 'departure' ? flight.departure.estimated : flight.arrival.estimated,
        actual_time: type === 'departure' ? flight.departure.actual : flight.arrival.actual,
        terminal: type === 'departure' ? flight.departure.terminal : flight.arrival.terminal,
        gate: type === 'departure' ? flight.departure.gate : flight.arrival.gate,
        status: flight.flight_status,
        raw_data: flight
      }))

      const { error } = await this.supabase
        .from('airport_schedules')
        .upsert(schedules, {
          onConflict: 'airport_iata,flight_number,scheduled_time'
        })

      if (error) {
        console.error('Erro ao salvar horários do aeroporto:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar horários no banco:', error)
    }
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { method, url } = req
    const urlObj = new URL(url)
    const path = urlObj.pathname

    // Verificar variáveis de ambiente
    const accessKey = Deno.env.get('GOFLIGHTLABS_ACCESS_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!accessKey) {
      throw new Error('GOFLIGHTLABS_ACCESS_KEY não configurada')
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variáveis do Supabase não configuradas')
    }

    const flightService = new GoFlightLabsService(accessKey, supabaseUrl, supabaseServiceKey)

    if (method === 'GET') {
      const flightNumber = urlObj.searchParams.get('flight')
      const airportIata = urlObj.searchParams.get('airport')
      const scheduleType = urlObj.searchParams.get('type') as 'departure' | 'arrival'
      const date = urlObj.searchParams.get('date')

      // Buscar informações de um voo específico
      if (flightNumber) {
        const flightData = await flightService.getFlightInfo(flightNumber, date || undefined)
        
        if (!flightData) {
          return new Response(
            JSON.stringify({ error: 'Voo não encontrado' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ data: flightData }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Buscar horários de um aeroporto
      if (airportIata) {
        const schedules = await flightService.getAirportSchedules(
          airportIata, 
          scheduleType || 'departure'
        )

        return new Response(
          JSON.stringify({ data: schedules }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Parâmetros inválidos. Use ?flight=CODIGO ou ?airport=IATA' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro na Edge Function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})