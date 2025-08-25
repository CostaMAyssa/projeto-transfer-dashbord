-- Criação da tabela reservations
-- Esta tabela será usada pela área de reservas do admin
-- Mantém compatibilidade com o sistema atual de bookings

CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  
  -- Informações básicas da reserva
  reservation_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8)),
  
  -- Dados do cliente
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  
  -- Informações da viagem
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME WITHOUT TIME ZONE NOT NULL,
  
  -- Detalhes do serviço
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage_large INTEGER DEFAULT 0,
  luggage_small INTEGER DEFAULT 0,
  
  -- Veículo e motorista
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  
  -- Valores
  base_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  extras_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Status da reserva
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
  ),
  
  -- Status do pagamento
  payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'partial', 'paid', 'refunded')
  ),
  
  -- Informações adicionais
  flight_number VARCHAR(50),
  notes TEXT,
  special_requirements TEXT,
  
  -- Origem da reserva
  source VARCHAR(50) DEFAULT 'admin' CHECK (
    source IN ('admin', 'website', 'quote', 'api')
  ),
  
  -- Referência para orçamento (se aplicável)
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
  
  -- Campos para compatibilidade futura
  booking_reference VARCHAR(100), -- Para integração com sistema de bookings
  external_id VARCHAR(100), -- Para integrações externas
  
  -- Índices para performance
  CONSTRAINT reservations_pickup_date_check CHECK (pickup_date >= CURRENT_DATE - INTERVAL '1 year'),
  CONSTRAINT reservations_total_amount_check CHECK (total_amount >= 0)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_reservations_pickup_date ON reservations(pickup_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_reservation_number ON reservations(reservation_number);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_reservations_updated_at();

-- Habilitar Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Política para admins (acesso total)
CREATE POLICY "admin_manage_reservations" ON reservations
  FOR ALL USING (true)
  WITH CHECK (true);

-- Política para leitura pública (para páginas de status)
CREATE POLICY "public_read_reservations" ON reservations
  FOR SELECT USING (true);

-- Inserir dados de exemplo
INSERT INTO reservations (
  customer_name,
  customer_email,
  customer_phone,
  pickup_location,
  dropoff_location,
  pickup_date,
  pickup_time,
  passengers,
  luggage_large,
  luggage_small,
  total_amount,
  status,
  payment_status,
  notes,
  source
) VALUES 
(
  'João Silva',
  'joao.silva@email.com',
  '+55 11 99999-9999',
  'Aeroporto Internacional de São Paulo (GRU)',
  'Hotel Copacabana Palace - Rio de Janeiro',
  CURRENT_DATE + INTERVAL '2 days',
  '14:30:00',
  2,
  2,
  1,
  350.00,
  'confirmed',
  'paid',
  'Cliente VIP - Solicita veículo executivo',
  'admin'
),
(
  'Maria Santos',
  'maria.santos@email.com',
  '+55 21 88888-8888',
  'Hotel Marriott - São Paulo',
  'Aeroporto de Congonhas (CGH)',
  CURRENT_DATE + INTERVAL '1 day',
  '09:15:00',
  1,
  1,
  0,
  180.00,
  'pending',
  'unpaid',
  'Voo às 11:30 - Chegada antecipada solicitada',
  'website'
),
(
  'Carlos Oliveira',
  'carlos.oliveira@email.com',
  '+55 11 77777-7777',
  'Rua Augusta, 1000 - São Paulo',
  'Shopping Iguatemi - São Paulo',
  CURRENT_DATE,
  '16:00:00',
  3,
  0,
  2,
  120.00,
  'in_progress',
  'paid',
  'Transfer para evento corporativo',
  'admin'
),
(
  'Ana Costa',
  'ana.costa@email.com',
  '+55 11 66666-6666',
  'Terminal Rodoviário Tietê',
  'Aeroporto Internacional de São Paulo (GRU)',
  CURRENT_DATE + INTERVAL '3 days',
  '07:45:00',
  2,
  3,
  1,
  280.00,
  'confirmed',
  'partial',
  'Voo internacional - Check-in antecipado necessário',
  'quote'
),
(
  'Roberto Lima',
  'roberto.lima@email.com',
  '+55 11 55555-5555',
  'Hotel Ibis - São Paulo',
  'Estação da Luz',
  CURRENT_DATE - INTERVAL '1 day',
  '13:20:00',
  1,
  1,
  0,
  95.00,
  'completed',
  'paid',
  'Transfer concluído com sucesso',
  'admin'
);

-- Comentários para documentação
COMMENT ON TABLE reservations IS 'Tabela principal para gerenciamento de reservas no sistema admin';
COMMENT ON COLUMN reservations.reservation_number IS 'Número único da reserva para identificação do cliente';
COMMENT ON COLUMN reservations.source IS 'Origem da reserva: admin (criada no painel), website (site público), quote (convertida de orçamento), api (integração externa)';
COMMENT ON COLUMN reservations.quote_id IS 'Referência para o orçamento original, se a reserva foi criada a partir de um orçamento';
COMMENT ON COLUMN reservations.booking_reference IS 'Referência para integração com sistema de bookings existente';