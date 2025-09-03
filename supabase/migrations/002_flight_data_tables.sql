-- Migração para tabelas de dados de voo - GoFlightLabs API
-- Criado em: 2024

-- Tabela para armazenar dados de voos
CREATE TABLE IF NOT EXISTS flight_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_number VARCHAR(10) NOT NULL,
  airline_iata VARCHAR(3),
  airline_icao VARCHAR(4),
  airline_name VARCHAR(255),
  departure_airport_iata VARCHAR(3),
  departure_airport_icao VARCHAR(4),
  departure_airport_name VARCHAR(255),
  departure_terminal VARCHAR(10),
  departure_gate VARCHAR(10),
  departure_scheduled TIMESTAMPTZ,
  departure_estimated TIMESTAMPTZ,
  departure_actual TIMESTAMPTZ,
  arrival_airport_iata VARCHAR(3),
  arrival_airport_icao VARCHAR(4),
  arrival_airport_name VARCHAR(255),
  arrival_terminal VARCHAR(10),
  arrival_gate VARCHAR(10),
  arrival_scheduled TIMESTAMPTZ,
  arrival_estimated TIMESTAMPTZ,
  arrival_actual TIMESTAMPTZ,
  flight_status VARCHAR(50),
  aircraft_type VARCHAR(50),
  baggage_belt VARCHAR(10),
  delay_minutes INTEGER DEFAULT 0,
  raw_data JSONB, -- Dados brutos da API para referência
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para horários de aeroportos (chegadas e partidas)
CREATE TABLE IF NOT EXISTS airport_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  airport_iata VARCHAR(3) NOT NULL,
  airport_icao VARCHAR(4),
  airport_name VARCHAR(255),
  schedule_type VARCHAR(20) NOT NULL CHECK (schedule_type IN ('departure', 'arrival')),
  flight_number VARCHAR(10) NOT NULL,
  airline_iata VARCHAR(3),
  airline_name VARCHAR(255),
  destination_airport_iata VARCHAR(3), -- Para partidas
  origin_airport_iata VARCHAR(3), -- Para chegadas
  scheduled_time TIMESTAMPTZ,
  estimated_time TIMESTAMPTZ,
  actual_time TIMESTAMPTZ,
  terminal VARCHAR(10),
  gate VARCHAR(10),
  status VARCHAR(50),
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_flight_data_flight_number ON flight_data(flight_number);
CREATE INDEX IF NOT EXISTS idx_flight_data_departure_airport ON flight_data(departure_airport_iata);
CREATE INDEX IF NOT EXISTS idx_flight_data_arrival_airport ON flight_data(arrival_airport_iata);
CREATE INDEX IF NOT EXISTS idx_flight_data_departure_scheduled ON flight_data(departure_scheduled);
CREATE INDEX IF NOT EXISTS idx_flight_data_arrival_scheduled ON flight_data(arrival_scheduled);
CREATE INDEX IF NOT EXISTS idx_flight_data_status ON flight_data(flight_status);

CREATE INDEX IF NOT EXISTS idx_airport_schedules_airport ON airport_schedules(airport_iata);
CREATE INDEX IF NOT EXISTS idx_airport_schedules_type ON airport_schedules(schedule_type);
CREATE INDEX IF NOT EXISTS idx_airport_schedules_flight ON airport_schedules(flight_number);
CREATE INDEX IF NOT EXISTS idx_airport_schedules_time ON airport_schedules(scheduled_time);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_flight_data_updated_at
    BEFORE UPDATE ON flight_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airport_schedules_updated_at
    BEFORE UPDATE ON airport_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Permitir leitura para usuários autenticados
ALTER TABLE flight_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - Permitir leitura para todos os usuários autenticados
CREATE POLICY "Allow read access to flight_data" ON flight_data
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to airport_schedules" ON airport_schedules
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir inserção/atualização apenas para service_role (Edge Functions)
CREATE POLICY "Allow service_role to manage flight_data" ON flight_data
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service_role to manage airport_schedules" ON airport_schedules
    FOR ALL USING (auth.role() = 'service_role');

-- Comentários para documentação
COMMENT ON TABLE flight_data IS 'Armazena dados detalhados de voos obtidos da API GoFlightLabs';
COMMENT ON TABLE airport_schedules IS 'Armazena horários de chegadas e partidas de aeroportos específicos';
COMMENT ON COLUMN flight_data.raw_data IS 'Dados brutos da API GoFlightLabs para referência e debug';
COMMENT ON COLUMN airport_schedules.schedule_type IS 'Tipo de horário: departure (partida) ou arrival (chegada)';