// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Declarações de tipos para o ambiente Deno
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
interface FlightApiResponse {
  [key: string]: any;
}

interface FlightParams {
  flight_number?: string;
  flight_iata?: string;
  date?: string;
}

class GoFlightLabsService {
  accessKey: string;
  baseUrl = 'https://www.goflightlabs.com';
  supabase: any;
  constructor(accessKey: string, supabaseUrl: string, supabaseKey: string){
    this.accessKey = accessKey;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  async makeRequest(endpoint: string, params: any = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    // Adiciona access_key como primeiro parâmetro para garantir formato correto
    url.searchParams.append('access_key', this.accessKey);
    // Adiciona os demais parâmetros da requisição
    Object.entries(params).forEach(([key, value])=>{
      url.searchParams.append(key, String(value));
    });
    
    console.log(`Fazendo requisição para: ${url.toString()}`);
    
    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error(`❌ Erro na API GoFlightLabs: ${response.status} - ${response.statusText}`);
        
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error(`❌ Erro ao parsear JSON de erro:`, jsonError);
          errorData = { message: 'Erro ao parsear resposta da API' };
        }
        
        console.error(`❌ Detalhes do erro:`, errorData);
        
        // Tratamento específico por código de erro
        if (response.status === 401) {
          throw new Error('Chave de acesso inválida. Verifique GOFLIGHTLABS_ACCESS_KEY');
        } else if (response.status === 403) {
          throw new Error('Acesso negado. Verifique permissões da API key');
        } else if (response.status === 429) {
          // Extrair informações de rate limit se disponíveis
          const retryAfter = response.headers.get('Retry-After');
          const rateLimitInfo = retryAfter ? ` Aguarde ${retryAfter} segundos.` : '';
          throw new Error(`Limite de requisições excedido.${rateLimitInfo} Considere implementar cache ou reduzir frequência de chamadas.`);
        } else if (response.status >= 500) {
          throw new Error('Erro interno do servidor GoFlightLabs. Tente novamente mais tarde');
        } else {
          throw new Error(`Erro na API GoFlightLabs: ${response.status} - ${response.statusText}. Detalhes: ${JSON.stringify(errorData)}`);
        }
      }
      
      const data = await response.json() as FlightApiResponse;
      console.log(`✅ Resposta da API (${endpoint}):`, JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error(`❌ Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Função helper para detectar se é voo internacional
  isInternationalFlight(rawData: any): boolean {
    // Se não temos dados de aeroportos, assumir doméstico (mais conservador)
    if (!rawData.departure?.iata || !rawData.arrival?.iata) {
      console.log('⚠️ Dados de aeroporto insuficientes, assumindo voo doméstico');
      return false;
    }
    
    const depIata = rawData.departure.iata;
    const arrIata = rawData.arrival.iata;
    
    // Lista de aeroportos brasileiros conhecidos
    const brazilianAirports = [
      'GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'CNF', 'REC', 'SSA', 'FOR', 'BEL', 
      'POA', 'CWB', 'MAO', 'SLZ', 'JPA', 'NAT', 'MCZ', 'AJU', 'THE', 'FEN', 
      'JDO', 'CGB', 'CGR', 'VIX', 'UDI', 'RAO', 'BPS', 'IGU', 'JOI', 'LDB', 
      'MGF', 'PET', 'RBR', 'SJP', 'TUR', 'UBA', 'VCP'
    ];
    
    const isDepBrazilian = brazilianAirports.includes(depIata);
    const isArrBrazilian = brazilianAirports.includes(arrIata);
    
    // Se ambos são brasileiros, é doméstico
    if (isDepBrazilian && isArrBrazilian) {
      console.log(`✅ Voo doméstico detectado: ${depIata} -> ${arrIata}`);
      return false;
    }
    
    // Se pelo menos um não é brasileiro, é internacional
    if (!isDepBrazilian || !isArrBrazilian) {
      console.log(`✅ Voo internacional detectado: ${depIata} -> ${arrIata}`);
      return true;
    }
    
    // Fallback: assumir doméstico se não conseguir determinar
    console.log('⚠️ Não foi possível determinar tipo de voo, assumindo doméstico');
    return false;
  }
  
  transformFlightData(rawData: any): any {
    console.log('Dados brutos recebidos:', JSON.stringify(rawData, null, 2));
    
    // Validação mais flexível - apenas campos essenciais
    if (!rawData.departure || !rawData.arrival) {
      console.error('Dados de voo incompletos - falta departure ou arrival:', rawData);
      throw new Error('Dados de voo incompletos - falta informações de partida ou chegada');
    }
    
    // Verificar se scheduled existe e é válido
    if (!rawData.departure.scheduled) {
      console.error('Campo departure.scheduled não encontrado:', rawData.departure);
      throw new Error('Campo departure.scheduled não encontrado nos dados do voo');
    }
    
    // Validar se a data é válida
    const departureTime = new Date(rawData.departure.scheduled);
    if (isNaN(departureTime.getTime())) {
      console.error('Data de partida inválida:', rawData.departure.scheduled);
      throw new Error('Data de partida inválida');
    }
    
    // Calcular horário de embarque baseado no tipo de voo
    const isInternational = this.isInternationalFlight(rawData);
    const boardingMinutes = isInternational ? 90 : 60; // 1.5h para internacional, 1h para doméstico
    const boardingTime = new Date(departureTime.getTime() - boardingMinutes * 60 * 1000);
    
    return {
      flightNumber: rawData.flight.iata || rawData.flight.number || 'Unknown',
      airline: {
        name: rawData.airline.name || 'Unknown',
        iata: rawData.airline.iata || 'Unknown',
        icao: rawData.airline.icao || 'Unknown'
      },
      departure: {
        airport: {
          name: rawData.departure.airport || 'Unknown',
          iata: rawData.departure.iata || 'Unknown',
          icao: rawData.departure.icao || 'Unknown'
        },
        terminal: rawData.departure.terminal || null,
        gate: rawData.departure.gate || null,
        scheduled: rawData.departure.scheduled,
        estimated: rawData.departure.estimated || rawData.departure.scheduled,
        actual: rawData.departure.actual || null,
        delay: Math.max(0, rawData.departure.delay || 0) // Garantir que delay não seja negativo
      },
      arrival: {
        airport: {
          name: rawData.arrival.airport || 'Unknown',
          iata: rawData.arrival.iata || 'Unknown',
          icao: rawData.arrival.icao || 'Unknown'
        },
        terminal: rawData.arrival.terminal || null,
        gate: rawData.arrival.gate || null,
        baggage: rawData.arrival.baggage || null,
        scheduled: rawData.arrival.scheduled || 'Unknown',
        estimated: rawData.arrival.estimated || rawData.arrival.scheduled,
        actual: rawData.arrival.actual || null,
        delay: Math.max(0, rawData.arrival.delay || 0) // Garantir que delay não seja negativo
      },
      status: rawData.flight_status || 'Unknown',
      aircraft: {
        type: rawData.aircraft?.iata || 'N/A',
        registration: rawData.aircraft?.registration || 'N/A'
      },
      suggestedBoardingTime: boardingTime.toISOString()
    };
  }
  // Função para adaptar o novo formato de resposta da API para o formato esperado pelo sistema
  adaptApiResponse(apiResponse: any): any {
    console.log('Adaptando resposta da API:', JSON.stringify(apiResponse, null, 2));
    if (!apiResponse) return null;
    try {
      // Verificar se é o novo formato da API com campos em maiúsculas
      if (apiResponse.DATE && apiResponse.FROM && apiResponse.TO) {
        // Novo formato da API
        const flightDate = this.parseFlightDate(apiResponse.DATE);
        
        // Extrair códigos IATA dos aeroportos
        const depIata = this.extractIataCode(apiResponse.FROM);
        const arrIata = this.extractIataCode(apiResponse.TO);
        
        // Criar horários ISO a partir dos horários fornecidos
        const scheduledDeparture = this.createISODateTime(flightDate, apiResponse.STD);
        const scheduledArrival = this.createISODateTime(flightDate, apiResponse.STA);
        const actualDeparture = apiResponse.ATD && apiResponse.ATD !== '—' ? this.createISODateTime(flightDate, apiResponse.ATD) : '';
        
        // Extrair informações da aeronave
        const aircraftInfo = this.parseAircraftInfo(apiResponse.AIRCRAFT);
        
        const adaptedData = {
          flight_date: flightDate,
          flight_status: this.parseFlightStatus(apiResponse.STATUS),
          departure: {
            airport: apiResponse.FROM,
            timezone: 'UTC',
            iata: depIata,
            icao: '',
            terminal: '',
            gate: '',
            delay: 0,
            scheduled: scheduledDeparture,
            estimated: scheduledDeparture,
            actual: actualDeparture
          },
          arrival: {
            airport: apiResponse.TO,
            timezone: 'UTC',
            iata: arrIata,
            icao: '',
            terminal: '',
            gate: '',
            baggage: '',
            delay: 0,
            scheduled: scheduledArrival,
            estimated: scheduledArrival,
            actual: ''
          },
          airline: {
            name: apiResponse.AIRLINE || 'Unknown Airline',
            iata: this.extractIataCode(apiResponse.AIRLINE) || 'Unknown',
            icao: this.extractIcaoCode(apiResponse.AIRLINE) || 'Unknown'
          },
          flight: {
            number: apiResponse.FLIGHT_NUMBER || 'Unknown',
            iata: apiResponse.FLIGHT_IATA || 'Unknown',
            icao: apiResponse.FLIGHT_ICAO || 'Unknown',
            codeshared: null
          },
          aircraft: {
            registration: aircraftInfo.registration,
            iata: aircraftInfo.type,
            icao: aircraftInfo.type,
            icao24: ''
          },
          live: {
            updated: new Date().toISOString(),
            latitude: 0,
            longitude: 0,
            altitude: 0,
            direction: 0,
            speed_horizontal: 0,
            speed_vertical: 0,
            is_ground: false
          }
        };
        
        console.log('Dados adaptados com sucesso (novo formato):', JSON.stringify(adaptedData, null, 2));
        return adaptedData;
      }
      
      // Formato antigo da API (manter compatibilidade)
      const flightDate = apiResponse.updated ? new Date(apiResponse.updated * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      // Usar horários reais da API, não hardcoded
      const scheduledDeparture = apiResponse.dep_scheduled || apiResponse.dep_time || '';
      const scheduledArrival = apiResponse.arr_scheduled || apiResponse.arr_time || '';
      const airlineName = apiResponse.airline_name || apiResponse.airline_icao || apiResponse.airline_iata || 'Unknown Airline';
      const departureAirportName = apiResponse.dep_name || apiResponse.dep_icao || apiResponse.dep_iata || 'Unknown Airport';
      const arrivalAirportName = apiResponse.arr_name || apiResponse.arr_icao || apiResponse.arr_iata || 'Unknown Airport';
      
      const adaptedData = {
        flight_date: flightDate,
        flight_status: apiResponse.status || 'scheduled',
        departure: {
          airport: departureAirportName,
          timezone: apiResponse.dep_timezone || 'UTC',
          iata: apiResponse.dep_iata || 'UNK',
          icao: apiResponse.dep_icao || 'UNKN',
          terminal: apiResponse.dep_terminal || '',
          gate: apiResponse.dep_gate || '',
          delay: apiResponse.dep_delay || 0,
          scheduled: apiResponse.dep_time || scheduledDeparture,
          estimated: apiResponse.dep_estimated || scheduledDeparture,
          actual: apiResponse.dep_actual || ''
        },
        arrival: {
          airport: arrivalAirportName,
          timezone: apiResponse.arr_timezone || 'UTC',
          iata: apiResponse.arr_iata || 'UNK',
          icao: apiResponse.arr_icao || 'UNKN',
          terminal: apiResponse.arr_terminal || '',
          gate: apiResponse.arr_gate || '',
          baggage: apiResponse.arr_baggage || '',
          delay: apiResponse.arr_delay || 0,
          scheduled: apiResponse.arr_time || scheduledArrival,
          estimated: apiResponse.arr_estimated || scheduledArrival,
          actual: apiResponse.arr_actual || ''
        },
        airline: {
          name: airlineName,
          iata: apiResponse.airline_iata || 'UNK',
          icao: apiResponse.airline_icao || 'UNKN'
        },
        flight: {
          number: apiResponse.flight_number || '0000',
          iata: apiResponse.flight_iata || `UNK${apiResponse.flight_number || '0000'}`,
          icao: apiResponse.flight_icao || `UNKN${apiResponse.flight_number || '0000'}`,
          codeshared: null
        },
        aircraft: {
          registration: apiResponse.reg_number || '',
          iata: apiResponse.aircraft_icao || apiResponse.aircraft_iata || '',
          icao: apiResponse.aircraft_icao || '',
          icao24: apiResponse.hex || ''
        },
        live: {
          updated: apiResponse.updated ? new Date(apiResponse.updated * 1000).toISOString() : '',
          latitude: apiResponse.lat || 0,
          longitude: apiResponse.lng || 0,
          altitude: apiResponse.alt || 0,
          direction: apiResponse.dir || 0,
          speed_horizontal: apiResponse.speed || 0,
          speed_vertical: apiResponse.v_speed || 0,
          is_ground: apiResponse.is_ground !== undefined ? apiResponse.is_ground : false
        }
      };
      
      console.log('Dados adaptados com sucesso (formato antigo):', JSON.stringify(adaptedData, null, 2));
      return adaptedData;
    } catch (error) {
      console.error('Erro ao adaptar resposta da API:', error);
      return null;
    }
  }
  
  // Funções auxiliares para o novo formato da API
  parseFlightDate(dateStr: string): string {
    try {
      // Tratar formato PT-BR: "13 de setembro de 2025"
      if (dateStr.includes(' de ')) {
        const monthsPT = {
          'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5,
          'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
        };
        
        const match = dateStr.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
        if (match) {
          const [, day, monthName, year] = match;
          const month = monthsPT[monthName.toLowerCase() as keyof typeof monthsPT];
          if (month !== undefined) {
            const date = new Date(Number(year), month, Number(day));
            return date.toISOString().split('T')[0];
          }
        }
      }
      
      // Tratar formato EN: "13 Sep 2025"
      const monthsEN = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      
      const matchEN = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/);
      if (matchEN) {
        const [, day, monthName, year] = matchEN;
        const month = monthsEN[monthName.toLowerCase() as keyof typeof monthsEN];
        if (month !== undefined) {
          const date = new Date(Number(year), month, Number(day));
          return date.toISOString().split('T')[0];
        }
      }
      
      // Fallback: tentar parse direto
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Formato de data inválido');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erro ao parsear data:', dateStr, error);
      return new Date().toISOString().split('T')[0];
    }
  }
  
  extractIataCode(airportStr: string): string {
    // Extrair código IATA de strings como "Nador (NDR)" ou "Barcelona (BCN)"
    const match = airportStr.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : 'UNK';
  }

  extractIcaoCode(airlineStr: string): string {
    // Extrair código ICAO de strings de companhia aérea
    if (!airlineStr) return 'UNKN';
    const match = airlineStr.match(/\(([A-Z]{4})\)/);
    return match ? match[1] : 'UNKN';
  }
  
  createISODateTime(date: string, time: string): string {
    if (!time || time === '—') return '';
    try {
      // Combinar data e hora para criar ISO datetime
      const dateTime = new Date(`${date}T${time}:00.000Z`);
      return dateTime.toISOString();
    } catch (error) {
      console.error('Erro ao criar datetime ISO:', date, time, error);
      return '';
    }
  }
  
  parseAircraftInfo(aircraftStr: string): { type: string; registration: string } {
    if (!aircraftStr) return { type: '', registration: '' };
    
    // Extrair informações da aeronave como "A320 (CN-NMR)" ou "320"
    const registrationMatch = aircraftStr.match(/\(([A-Z0-9-]+)\)/);
    const typeMatch = aircraftStr.match(/^([A-Z0-9]+)/);
    
    return {
      type: typeMatch ? typeMatch[1] : aircraftStr,
      registration: registrationMatch ? registrationMatch[1] : ''
    };
  }
  
  parseFlightStatus(statusStr: string): string {
    if (!statusStr) return 'scheduled';
    
    const status = statusStr.toLowerCase();
    if (status.includes('landed')) return 'landed';
    if (status.includes('scheduled')) return 'scheduled';
    if (status.includes('delayed')) return 'delayed';
    if (status.includes('cancelled')) return 'cancelled';
    
    return 'scheduled';
  }

  // Extrair apenas o número do voo (sem prefixo IATA)
  extractFlightNumber(fullFlightNumber: string): string {
    const original = fullFlightNumber.toUpperCase().trim();
    console.log(`🔍 Processando voo original: "${original}"`);
    
    // Se já é só número (ex: 30375, 1900)
    if (/^\d+$/.test(original)) {
      console.log(`✅ Já é só número: ${original}`);
      return original;
    }
    
    // Extrair número de voos com prefixo IATA (ex: LA3359 -> 3359)
    const numberMatch = original.match(/\d+/);
    if (numberMatch) {
      const number = numberMatch[0];
      console.log(`✅ Número extraído: "${original}" -> "${number}"`);
      return number;
    }
    
    // Fallback: usar como está
    console.log(`⚠️ Não foi possível extrair número, mantendo original: "${original}"`);
    return original;
  }

  async getFlightInfo(flightNumber: string, date?: string, airline?: string): Promise<any> {
    try {
      // Processar o número do voo com mapeamento dinâmico
      const cleanFlightNumber = this.extractFlightNumber(flightNumber);
      // Determinar código da companhia aérea
      const airlineCode = airline ? airline.toUpperCase() : 'LA'; // fallback para LATAM
      
      const params: any = { 
        delay: 0, // buscar qualquer atraso (incluindo 0)
        type: 'departures' // tipo obrigatório
      };
      if (date) params.date = date;

      const endpoint = 'flight_delays'; // usar endpoint que funciona
      console.log(`Buscando voo no endpoint /${endpoint}:`, params);

      const response = await this.makeRequest(endpoint, params);
      console.log('Resposta da API (/flight_delays):', JSON.stringify(response, null, 2));
      
      // Filtrar o voo específico nos resultados
      const targetFlightIata = `${airlineCode}${cleanFlightNumber}`;
      let flightData = null;
      
      if (response?.data && Array.isArray(response.data)) {
        flightData = response.data.find(flight => 
          flight.flight_iata === targetFlightIata || 
          flight.flight_number === cleanFlightNumber
        );
      }
      
      if (!flightData) {
        console.warn(`⚠ Voo ${targetFlightIata} não encontrado nos resultados`);
        return null;
      }
      
      console.log(`✅ Voo ${targetFlightIata} encontrado:`, flightData);

      // Processar os dados do voo encontrado
      const rawData = this.adaptApiResponse(flightData);
      
      if (!rawData) {
        console.error('Não foi possível adaptar a resposta da API');
        const error = new Error(`Dados do voo ${flightNumber} estão em formato inválido. Tente novamente mais tarde.`);
        error.name = 'InvalidDataFormatError';
        throw error;
      }

      const transformedFlightData = this.transformFlightData(rawData);
      await this.saveFlightData(rawData, transformedFlightData);

      return transformedFlightData;
    } catch (error) {
      console.error('Erro ao buscar informações do voo:', error);
      
      // Se já é um erro customizado, manter a mensagem
      if (error instanceof Error && error.name && error.name.includes('Error')) {
        throw error;
      }
      
      // Para outros erros, criar mensagem mais amigável
      const friendlyError = new Error(`Erro ao buscar voo ${flightNumber}: ${error instanceof Error ? error.message : String(error)}`);
      friendlyError.name = 'FlightSearchError';
      throw friendlyError;
    }
  }
  // Método para validar se a resposta da API tem o formato esperado
  validateFlightResponse(data: any): boolean {
    if (!data) return false;
    
    // Verifica se é o novo formato da API com campos em maiúsculas
    const hasNewApiFormat = data.DATE && data.FROM && data.TO && data.STD && data.STA;
    if (hasNewApiFormat) {
      console.log('Detectado novo formato da API com campos em maiúsculas');
      return true;
    }
    
    // Verifica se os campos essenciais existem no formato antigo
    const hasRequiredFields = data.departure && data.departure.scheduled && data.arrival && data.flight && data.airline;
    // Verifica se os campos essenciais existem no formato novo
    const hasNewFormatFields = (data.dep_iata || data.dep_icao) && (data.arr_iata || data.arr_icao) && (data.flight_iata || data.flight_icao || data.flight_number) && (data.airline_iata || data.airline_icao);
    
    // Se estiver no formato novo, podemos adaptar
    if (hasNewFormatFields) {
      return true;
    }
    
    if (!hasRequiredFields && !hasNewApiFormat) {
      console.error('Campos obrigatórios ausentes na resposta:', {
        hasDeparture: !!data.departure,
        hasDepartureScheduled: data.departure ? !!data.departure.scheduled : false,
        hasArrival: !!data.arrival,
        hasFlight: !!data.flight,
        hasAirline: !!data.airline,
        // Campos do formato novo
        hasDepIata: !!data.dep_iata,
        hasDepIcao: !!data.dep_icao,
        hasArrIata: !!data.arr_iata,
        hasArrIcao: !!data.arr_icao,
        hasFlightIata: !!data.flight_iata,
        hasFlightIcao: !!data.flight_icao,
        hasFlightNumber: !!data.flight_number,
        hasAirlineIata: !!data.airline_iata,
        hasAirlineIcao: !!data.airline_icao,
        // Campos do novo formato da API
        hasDATE: !!data.DATE,
        hasFROM: !!data.FROM,
        hasTO: !!data.TO,
        hasSTD: !!data.STD,
        hasSTA: !!data.STA
      });
    }
    
    return hasRequiredFields || hasNewFormatFields || hasNewApiFormat;
  }
  async getAirportSchedules(airportIata: string, type: string = 'departure'): Promise<any[]> {
    try {
      // Mesmo endpoint 'flights' para ambos os tipos
      const endpoint = 'flights';
      const params: any = {};
      // Parâmetros corretos para a API GoFlightLabs
      if (type === 'departure') {
        params.dep_iata = airportIata;
      } else {
        params.arr_iata = airportIata;
      }
      console.log(`Buscando horários do aeroporto: ${airportIata}, tipo: ${type}`);
      console.log('Parâmetros da requisição:', params);
      const response = await this.makeRequest(endpoint, params);
      console.log(`Resposta recebida da API:`, JSON.stringify(response, null, 2));
      // Processar a resposta - API retorna array direto conforme documentação
      let rawFlights = [];
      
      if (Array.isArray(response) && response.length > 0) {
        console.log('Detectado formato da API como array direto (conforme documentação)');
        // Processar cada voo no array
        for (const flight of response) {
          if (this.validateFlightResponse(flight)) {
            rawFlights.push(flight);
          } else {
            const adaptedFlight = this.adaptApiResponse(flight);
            if (adaptedFlight) rawFlights.push(adaptedFlight);
          }
        }
      } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('Detectado formato da API com propriedade data (fallback)');
        // Processar cada voo no array
        for (const flight of response.data) {
          if (this.validateFlightResponse(flight)) {
            rawFlights.push(flight);
          } else {
            const adaptedFlight = this.adaptApiResponse(flight);
            if (adaptedFlight) rawFlights.push(adaptedFlight);
          }
        }
      } else {
        console.log('Formato de resposta não reconhecido para horários de aeroporto');
      }
      if (rawFlights.length === 0) {
        console.warn('Nenhum voo com dados válidos encontrado');
        return [];
      }
      console.log(`Processando ${rawFlights.length} voos válidos`);
      const flights = rawFlights.map((flight: any)=>{
        try {
          return this.transformFlightData(flight);
        } catch (error) {
          console.error('Erro ao transformar dados do voo:', error);
          return null;
        }
      }).filter(Boolean);
      // Salvar horários do aeroporto no banco
      await this.saveAirportSchedules(airportIata, type, rawFlights);
      return flights;
    } catch (error) {
      console.error('Erro ao buscar horários do aeroporto:', error);
      throw error;
    }
  }
  async saveFlightData(rawData: any, transformedData: any): Promise<void> {
    try {
      const { error } = await this.supabase.from('flight_data').upsert({
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
      });
      if (error) {
        console.error('Erro ao salvar dados do voo:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
    }
  }
  async saveAirportSchedules(airportIata: string, type: string, flights: any[]): Promise<void> {
    try {
      const schedules = flights.map((flight: any)=>({
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
          status: flight.status,
          raw_data: flight
        }));
      const { error } = await this.supabase.from('airport_schedules').upsert(schedules, {
        onConflict: 'airport_iata,flight_number,scheduled_time'
      });
      if (error) {
        console.error('Erro ao salvar horários do aeroporto:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar horários no banco:', error);
    }
  }
}
serve(async (req: Request)=>{
  console.log('🚀 Edge Function recebeu requisição:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    timestamp: new Date().toISOString()
  });
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('✅ Respondendo a requisição OPTIONS (CORS)');
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { method, url } = req;
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    console.log('📋 Detalhes da requisição:', {
      method,
      path,
      searchParams: Object.fromEntries(urlObj.searchParams.entries())
    });
    // Verificar variáveis de ambiente
    const accessKey = Deno.env.get('GOFLIGHTLABS_ACCESS_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!accessKey) {
      throw new Error('GOFLIGHTLABS_ACCESS_KEY não configurada');
    }
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variáveis do Supabase não configuradas');
    }
    const flightService = new GoFlightLabsService(accessKey, supabaseUrl, supabaseServiceKey);
    if (method === 'GET' || method === 'POST') {
      let flightNumber, airportIata, scheduleType, date, airline;
      
      if (method === 'GET') {
        flightNumber = urlObj.searchParams.get('flight');
        airportIata = urlObj.searchParams.get('airport');
        scheduleType = urlObj.searchParams.get('type');
        date = urlObj.searchParams.get('date');
        airline = urlObj.searchParams.get('airline') || undefined;
        
        console.log('📥 Parâmetros GET extraídos:', {
          flightNumber, airportIata, scheduleType, date
        });
      } else if (method === 'POST') {
        console.log('📦 Processando requisição POST...');
        const body = await req.json();
        console.log('📄 Body da requisição POST:', body);
        
        flightNumber = body.flight_number;
        airportIata = body.airport;
        scheduleType = body.type;
        date = body.date;
        airline = body.airline;
        
        console.log('📥 Parâmetros POST extraídos:', {
          flightNumber, airportIata, scheduleType, date, airline
        });
      }
      // Buscar informações de um voo específico
      if (flightNumber) {
        console.log('🔍 Buscando informações do voo:', { flightNumber, date });
        
        try {
          const flightData = await flightService.getFlightInfo(flightNumber, date || undefined, airline);
          
          console.log('✅ Dados do voo obtidos:', {
            hasData: !!flightData,
            flightNumber: flightData?.flightNumber,
            status: flightData?.status
          });
          
          if (!flightData) {
            console.log('⚠️ Voo não encontrado, retornando 200 com success: false');
            return new Response(JSON.stringify({
              success: false,
              data: null,
              error: 'Voo não encontrado',
              message: `Voo ${flightNumber} não encontrado na data ${date || 'hoje'}. Verifique se o voo existe nesta data.`
            }), {
              status: 200,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          
          console.log('🎉 Retornando dados do voo com sucesso');
          return new Response(JSON.stringify({
            data: flightData
          }), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        } catch (flightError) {
          console.error('❌ Erro ao buscar voo:', {
            error: flightError,
            message: flightError instanceof Error ? flightError.message : String(flightError),
            stack: flightError instanceof Error ? flightError.stack : undefined
          });
          
          // Determinar status HTTP baseado no tipo de erro
          let statusCode = 500;
          let errorType = 'Erro interno do servidor';
          
          if (flightError instanceof Error) {
            if (flightError.name === 'FlightNotFoundError') {
              statusCode = 404;
              errorType = 'Voo não encontrado';
            } else if (flightError.name === 'NoDataError') {
              statusCode = 404;
              errorType = 'Dados não encontrados';
            } else if (flightError.name === 'InvalidDataFormatError') {
              statusCode = 422;
              errorType = 'Formato de dados inválido';
            } else if (flightError.name === 'FlightSearchError') {
              statusCode = 400;
              errorType = 'Erro na busca do voo';
            }
          }
          
          return new Response(JSON.stringify({
            success: false,
            error: errorType,
            message: flightError instanceof Error ? flightError.message : String(flightError),
            flightNumber: flightNumber,
            date: date || 'hoje'
          }), {
            status: statusCode,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
      }
      // Buscar horários de um aeroporto
      if (airportIata) {
        const schedules = await flightService.getAirportSchedules(airportIata, scheduleType || 'departure');
        return new Response(JSON.stringify({
          data: schedules
        }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      return new Response(JSON.stringify({
        error: 'Parâmetros inválidos. Use ?flight=CODIGO ou ?airport=IATA'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      error: 'Método não permitido'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erro na Edge Function:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({
      error: 'Erro interno do servidor',
      message: errorMessage
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
