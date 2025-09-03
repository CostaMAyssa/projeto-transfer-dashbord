# Plano de Implementação - API de Voos GoFlightLabs

## 📋 Objetivo
Integrar a API de voos da GoFlightLabs para fornecer horários mais precisos nas reservas de transfer, comparando dados de voos reais com os horários solicitados pelos clientes.

1- Permitir que o sistema de reservas utilize dados reais de voo para sugerir horários de pickup mais precisos.

2- Comparar horários solicitados pelos clientes com horários reais (programados, estimados e reais de chegada/partida).

## 🔍 Análise da API GoFlightLabs

### APIs Disponíveis:
1. **Real-Time Flights API** - Dados em tempo real
   - Informações de voos atualmente em progresso
   - Status de voo com horários programados e reais
   - Teste gratuito de 7 dias ou até 50 requisições

2. **Flight Schedules API** - Horários programados
   - Dados de chegadas e partidas por aeroporto
   - Filtros por companhia aérea, número do voo, data
   - Informações de terminal e portão

3. **Historical Flights API** - Dados históricos
   - Acesso a dados de voos passados
   - Análise de padrões e tendências

### Endpoints Principais:
- `https://app.goflightlabs.com/flights` - Voos em tempo real
- `https://app.goflightlabs.com/advanced-flights-schedules` - Horários por aeroporto
- `https://app.goflightlabs.com/flights-schedules` - Programação de voos

### Exemplos de Requisições:

#### 1. Buscar voo específico:
```
GET https://app.goflightlabs.com/flights?
access_key=YOUR_ACCESS_KEY&flight_iata=AA1234
```

#### 2. Horários de chegada de um aeroporto:
```
GET https://app.goflightlabs.com/advanced-flights-schedules?
access_key=YOUR_ACCESS_KEY&iataCode=JFK&type=arrival&limit=50
```

#### 3. Horários de partida de um aeroporto:
```
GET https://app.goflightlabs.com/advanced-flights-schedules?
access_key=YOUR_ACCESS_KEY&iataCode=LAX&type=departure&limit=50
```

### Exemplo de Resposta:
```json
{
  "success": true,
  "type": "departure",
  "data": [
    {
      "airline_iata": "AA",
      "airline_icao": "AAL",
      "flight_iata": "AA1234",
      "flight_icao": "AAL1234",
      "flight_number": "1234",
      "dep_iata": "JFK",
      "dep_icao": "KJFK",
      "dep_terminal": "4",
      "dep_gate": "A12",
      "dep_time": "2024-03-12 07:30",
      "dep_time_utc": "2024-03-12 11:30",
      "dep_estimated": "2024-03-12 07:35",
      "dep_actual": "2024-03-12 07:33",
      "arr_iata": "LAX",
      "arr_icao": "KLAX",
      "arr_terminal": "6",
      "arr_gate": "B15",
      "arr_baggage": "3",
      "arr_time": "2024-03-12 10:45",
      "arr_estimated": "2024-03-12 10:50",
      "arr_actual": null,
      "flight_status": "active"
    }
  ]
}
```

### Dados Relevantes para Transfer:
- ✅ Posições de voos em tempo real
- ✅ Status de voos e aeroportos
- ✅ Horários reais de partida e chegada (dep_actual, arr_actual)
- ✅ Horários estimados (dep_estimated, arr_estimated)
- ✅ Portão e terminal de chegada/partida
- ✅ Códigos IATA e ICAO de aeroportos e companhias
- ✅ Informações de bagagem (arr_baggage)

## 🏗️ Arquitetura da Solução

### 1. Estrutura de Dados
```sql
-- Nova tabela para armazenar dados de voos
CREATE TABLE flight_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number VARCHAR(10) NOT NULL,
  airline_code VARCHAR(3) NOT NULL,
  origin_airport VARCHAR(4) NOT NULL,
  destination_airport VARCHAR(4) NOT NULL,
  scheduled_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  scheduled_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  flight_status VARCHAR(20), -- scheduled, active, landed, cancelled, delayed
  gate VARCHAR(10),
  terminal VARCHAR(10),
  aircraft_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relacionar reservas com dados de voo
ALTER TABLE reservations ADD COLUMN flight_data_id UUID REFERENCES flight_data(id);
ALTER TABLE reservations ADD COLUMN flight_number VARCHAR(10);
ALTER TABLE reservations ADD COLUMN is_flight_monitored BOOLEAN DEFAULT FALSE;
```

### 2. Componentes do Sistema

#### A. Serviço de API de Voos (Supabase Edge Function)
```typescript
// Estrutura de resposta da GoFlightLabs API
interface GoFlightLabsResponse {
  success: boolean;
  type: 'departure' | 'arrival';
  data: FlightDataRaw[];
}

interface FlightDataRaw {
  airline_iata: string;
  airline_icao: string;
  flight_iata: string;
  flight_icao: string;
  flight_number: string;
  dep_iata: string;
  dep_icao: string;
  dep_terminal?: string;
  dep_gate?: string;
  dep_time: string; // "2024-03-12 07:30"
  dep_time_utc: string;
  dep_estimated?: string;
  dep_estimated_utc?: string;
  dep_actual?: string;
  dep_actual_utc?: string;
  arr_iata: string;
  arr_icao: string;
  arr_terminal?: string;
  arr_gate?: string;
  arr_baggage?: string;
  arr_time: string;
  arr_time_utc: string;
  arr_estimated?: string;
  arr_estimated_utc?: string;
  arr_actual?: string;
  arr_actual_utc?: string;
  flight_status: string;
}

// Interface padronizada para uso interno
interface FlightData {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledDeparture: Date;
  actualDeparture?: Date;
  estimatedDeparture?: Date;
  scheduledArrival: Date;
  actualArrival?: Date;
  estimatedArrival?: Date;
  status: string;
  depGate?: string;
  depTerminal?: string;
  arrGate?: string;
  arrTerminal?: string;
  arrBaggage?: string;
}

// Supabase Edge Function para API de Voos
class GoFlightLabsService {
  private accessKey: string;
  private baseUrl = 'https://app.goflightlabs.com';

  constructor() {
    this.accessKey = Deno.env.get('GOFLIGHTLABS_ACCESS_KEY') || '';
  }

  async getFlightInfo(flightNumber: string, date?: string): Promise<FlightData | null>
  async getAirportSchedules(airportCode: string, type: 'departure' | 'arrival', date?: string): Promise<FlightData[]>
  async searchFlightByNumber(flightIata: string): Promise<FlightData[]>
  async getSuggestedPickupTime(flightData: FlightData, serviceType: 'arrival' | 'departure'): Promise<Date>
  
  private transformFlightData(raw: FlightDataRaw): FlightData
  private makeRequest(endpoint: string, params: Record<string, string>): Promise<GoFlightLabsResponse>
}
```

#### B. Função de Cálculo de Horário Sugerido
```typescript
// Implementação detalhada da função getSuggestedPickupTime
async getSuggestedPickupTime(
  flightData: FlightData, 
  serviceType: 'arrival' | 'departure',
  options?: {
    domesticFlight?: boolean;
    hasCheckedBaggage?: boolean;
    airportCode?: string;
    customBufferMinutes?: number;
  }
): Promise<Date> {
  const {
    domesticFlight = true,
    hasCheckedBaggage = true,
    customBufferMinutes
  } = options || {};

  if (serviceType === 'arrival') {
    const arrivalTime = flightData.estimatedArrival || flightData.scheduledArrival;
    const disembarkTime = domesticFlight ? 15 : 30; // minutos
    const baggageTime = hasCheckedBaggage ? (domesticFlight ? 20 : 40) : 0;
    const walkingTime = 10; // tempo para sair do aeroporto
    const bufferTime = customBufferMinutes || 15;
    
    const totalMinutes = disembarkTime + baggageTime + walkingTime + bufferTime;
    return new Date(arrivalTime.getTime() + totalMinutes * 60000);
  } else {
    const departureTime = flightData.scheduledDeparture;
    const checkinTime = domesticFlight ? 60 : 120; // minutos antes
    const securityTime = domesticFlight ? 30 : 45; // tempo de segurança
    const bufferTime = customBufferMinutes || 30;
    
    const totalMinutes = checkinTime + securityTime + bufferTime;
    return new Date(departureTime.getTime() - totalMinutes * 60000);
  }
}
```

#### C. Hook para Dados de Voo (`hooks/useFlightData.ts`)
```typescript
interface UseFlightDataReturn {
  flightData: FlightData | null;
  loading: boolean;
  error: string | null;
  suggestedPickupTime: Date | null;
  searchFlight: (flightNumber: string, date: string) => Promise<void>;
  calculatePickupTime: (serviceType: 'arrival' | 'departure', options?: any) => Promise<void>;
  clearFlight: () => void;
}

export const useFlightData = (): UseFlightDataReturn {
  const searchFlight = async (flightNumber: string, date: string)
  const getFlightSuggestions = async (airport: string, date: string)
  const updateReservationWithFlight = async (reservationId: string, flightData: FlightData)
}
```

#### C. Implementação da Edge Function (`app/supabase/functions/flight-data/index.ts`)
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, flightNumber, airportCode, type, date } = await req.json()
    const accessKey = Deno.env.get('GOFLIGHTLABS_ACCESS_KEY')
    
    if (!accessKey) {
      throw new Error('GoFlightLabs access key not configured')
    }

    let url = ''
    let params = new URLSearchParams({ access_key: accessKey })

    switch (action) {
      case 'getFlightInfo':
        url = 'https://app.goflightlabs.com/flights'
        if (flightNumber) params.append('flight_iata', flightNumber)
        if (date) params.append('dep_date', date)
        break
        
      case 'getAirportSchedules':
        url = 'https://app.goflightlabs.com/advanced-flights-schedules'
        if (airportCode) params.append('iataCode', airportCode)
        if (type) params.append('type', type) // 'departure' or 'arrival'
        if (date) params.append('dep_date', date)
        params.append('limit', '50')
        break
        
      default:
        throw new Error('Invalid action')
    }

    const response = await fetch(`${url}?${params.toString()}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error('Failed to fetch flight data')
    }

    // Transform data to standardized format
    const transformedData = data.data.map(transformFlightData)

    return new Response(
      JSON.stringify({ success: true, data: transformedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

function transformFlightData(raw: any): FlightData {
  return {
    flightNumber: raw.flight_iata,
    airline: raw.airline_iata,
    origin: raw.dep_iata,
    destination: raw.arr_iata,
    scheduledDeparture: new Date(raw.dep_time),
    actualDeparture: raw.dep_actual ? new Date(raw.dep_actual) : undefined,
    estimatedDeparture: raw.dep_estimated ? new Date(raw.dep_estimated) : undefined,
    scheduledArrival: new Date(raw.arr_time),
    actualArrival: raw.arr_actual ? new Date(raw.arr_actual) : undefined,
    estimatedArrival: raw.arr_estimated ? new Date(raw.arr_estimated) : undefined,
    status: raw.flight_status,
    depGate: raw.dep_gate,
    depTerminal: raw.dep_terminal,
    arrGate: raw.arr_gate,
    arrTerminal: raw.arr_terminal,
    arrBaggage: raw.arr_baggage
  }
}
```

#### D. Componente de Busca de Voo (`components/FlightSearch.tsx`)
- Campo de entrada para número do voo
- Seletor de data
- Autocomplete com sugestões de voos
- Exibição de informações do voo selecionado
- Integração com a Edge Function para busca de dados

## 🔄 Fluxo de Funcionamento

### 1. Durante a Criação da Reserva
```
1. Cliente informa data e horário desejado
2. Cliente opcionalmente informa número do voo
3. Sistema busca dados do voo na API FlightAware
4. Sistema compara horário do voo com horário solicitado
5. Função getSuggestedPickupTime() calcula horário ideal baseado em:
   - Para chegadas: Horário de chegada + tempo de desembarque (15-30 min) + bagagem (20-40 min) + deslocamento (5-15 min) + buffer (10-15 min)
   - Para partidas: Horário de partida - tempo de check-in (60-120 min) - deslocamento (tempo variável) - buffer (15-30 min)
6. Sistema sugere ajuste de horário baseado no voo
7. Sistema salva dados do voo na reserva
```

### 2. Monitoramento Contínuo
```
1. Sistema monitora voos de reservas ativas
2. API webhook ou polling verifica mudanças
3. Sistema notifica cliente sobre atrasos/cancelamentos
4. Sistema sugere novo horário automaticamente
```

### 3. Sugestões Inteligentes
```
1. Para chegadas: Horário do voo + tempo de desembarque + tempo de bagagem
2. Para partidas: Horário do voo - tempo de check-in - tempo de viagem
3. Considerações: Terminal, portão, tráfego, clima
```

## 📱 Interface do Usuário

### 1. Formulário de Reserva Aprimorado
```
┌─────────────────────────────────────┐
│ 📅 Data: [____/____/____]          │
│ 🕐 Horário: [__:__]                │
│                                     │
│ ✈️ Número do Voo (opcional)        │
│ [AA1234_____________] [🔍 Buscar]   │
│                                     │
│ 📊 Informações do Voo:             │
│ ┌─────────────────────────────────┐ │
│ │ AA1234 - American Airlines     │ │
│ │ JFK → LGA                      │ │
│ │ Chegada: 14:30 (Estimado)      │ │
│ │ Terminal: 4, Portão: A12       │ │
│ │ Status: No horário ✅          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Sugestão: Agendar pickup para   │
│    15:15 (45min após chegada)      │
│                                     │
│ [Aceitar Sugestão] [Manter Horário]│
└─────────────────────────────────────┘
```

### 2. Dashboard de Monitoramento
```
┌─────────────────────────────────────┐
│ 📊 Reservas com Voos Monitorados   │
│                                     │
│ 🔴 AA1234 - Atrasado 30min         │
│    Cliente: João Silva              │
│    Novo horário sugerido: 15:45    │
│    [Notificar Cliente] [Reagendar]  │
│                                     │
│ 🟡 UA567 - Portão alterado         │
│    Cliente: Maria Santos            │
│    Novo portão: B15                 │
│    [Atualizar Info]                 │
│                                     │
│ 🟢 DL890 - No horário              │
│    Cliente: Pedro Costa             │
│    Chegada confirmada: 16:20        │
└─────────────────────────────────────┘
```

## 🔧 Implementação Técnica

### Fase 1: Configuração Básica
1. ✅ Criar conta na GoFlightLabs (https://app.goflightlabs.com/)
2. ✅ Obter access_key da API
3. ✅ Configurar variável de ambiente GOFLIGHTLABS_ACCESS_KEY
4. ✅ Criar tabelas no banco de dados
5. ✅ Implementar Edge Function no Supabase
6. ✅ Configurar CORS e autenticação

### Fase 2: Interface de Usuário
1. ✅ Componente de busca de voo
2. ✅ Integração no formulário de reserva
3. ✅ Exibição de informações do voo
4. ✅ Sistema de sugestões

### Fase 3: Monitoramento
1. ✅ Sistema de polling/webhook
2. ✅ Notificações automáticas
3. ✅ Dashboard de monitoramento
4. ✅ Reagendamento automático

### Fase 4: Otimizações
1. ✅ Cache de dados de voo
2. ✅ Previsões baseadas em histórico
3. ✅ Integração com clima/tráfego
4. ✅ Analytics e relatórios

## 💰 Estimativa de Custos

### GoFlightLabs API
- **Teste gratuito**: 7 dias ou até 50 requisições
- **Planos pagos**: Consultar site oficial para preços atualizados
- **Modelo de cobrança**: Por requisição/consulta

### Cenários de Uso Estimados:
- **Baixo volume** (50 reservas/mês): ~100 consultas/mês
- **Médio volume** (200 reservas/mês): ~400 consultas/mês  
- **Alto volume** (1000 reservas/mês): ~2000 consultas/mês

### Otimizações de Custo:
- Cache de dados de voo por 15-30 minutos
- Busca por aeroporto em vez de voo específico quando possível
- Monitoramento apenas de voos confirmados
- Uso de dados históricos para previsões

## 🎯 Benefícios Esperados

1. **Precisão**: Horários mais precisos baseados em dados reais
2. **Experiência**: Cliente informado sobre status do voo
3. **Eficiência**: Menos reagendamentos de última hora
4. **Profissionalismo**: Serviço proativo e informado
5. **Competitividade**: Diferencial no mercado

## 🚀 Próximos Passos

1. **Aprovação do plano** ✅
2. **Configuração da conta GoFlightLabs**
   - Criar conta em https://app.goflightlabs.com/
   - Obter access_key da API
   - Testar endpoints com dados de exemplo
3. **Implementação da Edge Function**
   - Criar função `flight-data` no Supabase
   - Configurar variáveis de ambiente
   - Implementar transformação de dados
4. **Integração no Frontend**
   - Atualizar hook `useFlightData`
   - Implementar componente de busca
   - Integrar no formulário de reservas
5. **Testes e Validação**
   - Testes com voos reais
   - Validação de horários sugeridos
   - Testes de performance e cache
6. **Deploy e Monitoramento**
   - Deploy da Edge Function
   - Monitoramento de uso da API
   - Coleta de feedback dos usuários

### Configuração de Ambiente
```bash
# Variáveis de ambiente necessárias
GOFLIGHTLABS_ACCESS_KEY=your_access_key_here

# Deploy da Edge Function
supabase functions deploy flight-data

# Teste da função
curl -X POST 'https://your-project.supabase.co/functions/v1/flight-data' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "getFlightInfo",
    "flightNumber": "AA1234",
    "date": "2024-03-15"
  }'
```

---

**Tempo estimado de implementação**: 2-3 semanas
**Complexidade**: Média
**ROI esperado**: Alto (melhoria na experiência do cliente)
**Vantagem da Edge Function**: Reutilização em outros sistemas, melhor performance, segurança das chaves de API