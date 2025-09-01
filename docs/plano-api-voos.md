# Plano de Implementação - API de Voos FlightAware

## 📋 Objetivo
Integrar a API de voos da FlightAware para fornecer horários mais precisos nas reservas de transfer, comparando dados de voos reais com os horários solicitados pelos clientes.

1- Permitir que o sistema de reservas utilize dados reais de voo para sugerir horários de pickup mais precisos.

2- Comparar horários solicitados pelos clientes com horários reais (programados, estimados e reais de chegada/partida).

## 🔍 Análise da API FlightAware

### APIs Disponíveis:
1. **AeroAPI™** - API baseada em consultas (Pull)
   - Dados em tempo real e históricos (últimas 2 semanas)
   - Preço: $0,002 por consulta
   - Ideal para aplicações pequenas/médias

2. **FlightAware Firehose** - Feed em tempo real (Push)
   - Dados históricos desde 2009
   - Ideal para big data e soluções corporativas

### Dados Relevantes para Transfer:
- ✅ Posições de voos em tempo real
- ✅ Status de voos e aeroportos
- ✅ Horários reais de partida e chegada
- ✅ Portão e terminal de chegada/partida
- ✅ Tempos programados vs reais (Block IN/OUT)
- ✅ Informações meteorológicas do aeroporto

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

#### A. Serviço de API de Voos (`lib/flight-api.ts`)
```typescript
interface FlightData {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledDeparture: Date;
  actualDeparture?: Date;
  scheduledArrival: Date;
  actualArrival?: Date;
  estimatedArrival?: Date;
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'delayed';
  gate?: string;
  terminal?: string;
}

class FlightAwareService {
  async getFlightInfo(flightNumber: string, date: string): Promise<FlightData>
  async getAirportArrivals(airport: string, date: string): Promise<FlightData[]>
  async monitorFlight(flightNumber: string): Promise<void>
  async getSuggestedPickupTime(flightData: FlightData, serviceType: 'arrival' | 'departure'): Promise<Date>
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

#### C. Componente de Busca de Voo (`components/FlightSearch.tsx`)
- Campo de entrada para número do voo
- Seletor de data
- Autocomplete com sugestões de voos
- Exibição de informações do voo selecionado

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
1. ✅ Criar conta na FlightAware
2. ✅ Obter chaves de API
3. ✅ Configurar variáveis de ambiente
4. ✅ Criar tabelas no banco de dados
5. ✅ Implementar serviço básico de API

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

### AeroAPI (Recomendado para início)
- **Consultas estimadas**: 1000/mês
- **Custo**: $2,00/mês
- **Limite gratuito**: Período de teste disponível

### Cenários de Uso:
- **Baixo volume** (50 reservas/mês): ~$0,50/mês
- **Médio volume** (200 reservas/mês): ~$2,00/mês
- **Alto volume** (1000 reservas/mês): ~$10,00/mês

## 🎯 Benefícios Esperados

1. **Precisão**: Horários mais precisos baseados em dados reais
2. **Experiência**: Cliente informado sobre status do voo
3. **Eficiência**: Menos reagendamentos de última hora
4. **Profissionalismo**: Serviço proativo e informado
5. **Competitividade**: Diferencial no mercado

## 🚀 Próximos Passos

1. **Aprovação do plano** ✅
2. **Configuração da conta FlightAware**
3. **Implementação do MVP (Fase 1 + 2)**
4. **Testes com dados reais**
5. **Deploy e monitoramento**
6. **Coleta de feedback e melhorias**

---

**Tempo estimado de implementação**: 2-3 semanas
**Complexidade**: Média
**ROI esperado**: Alto (melhoria na experiência do cliente)