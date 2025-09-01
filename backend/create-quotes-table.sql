-- Criação da tabela quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informações básicas do orçamento
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  
  -- Dados do cliente (OBRIGATÓRIOS)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  
  -- Dados do trajeto (OBRIGATÓRIOS)
  quote_type VARCHAR(20) NOT NULL CHECK (quote_type IN ('one-way', 'round-trip', 'hourly')),
  pickup_address TEXT NOT NULL,
  pickup_coordinates POINT,
  pickup_zone_id TEXT REFERENCES zones(id),
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  destination_address TEXT NOT NULL,
  destination_coordinates POINT,
  destination_zone_id TEXT REFERENCES zones(id),
  
  -- Dados de volta (para round-trip)
  return_date DATE,
  return_time TIME,
  return_pickup_address TEXT,
  return_pickup_coordinates POINT,
  return_pickup_zone_id TEXT REFERENCES zones(id),
  return_destination_address TEXT,
  return_destination_coordinates POINT,
  return_destination_zone_id TEXT REFERENCES zones(id),
  
  -- Dados de serviço por horas (para hourly)
  service_hours INTEGER DEFAULT 2,
  service_type VARCHAR(20) CHECK (service_type IN ('airport-dropoff', 'airport-pickup')),
  
  -- Informações de voo (OPCIONAIS)
  flight_number VARCHAR(20),
  airline VARCHAR(100),
  no_flight_info BOOLEAN DEFAULT false,
  
  -- Dados do veículo (OBRIGATÓRIOS)
  vehicle_category_id TEXT NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage_large INTEGER DEFAULT 0,
  luggage_small INTEGER DEFAULT 0,
  
  -- Preços
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  extras_price DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Extras/serviços adicionais (OPCIONAIS)
  extras JSONB DEFAULT '[]'::jsonb,
  
  -- Configurações
  expires_days INTEGER DEFAULT 7,
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  
  -- Campos para compatibilidade com interface existente
  data_emissao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valor_total VARCHAR(20), -- Para manter formato "U$ 300.00"
  nome_cliente VARCHAR(255), -- Alias para customer_name
  telefone_cliente VARCHAR(50), -- Alias para customer_phone
  email_cliente VARCHAR(255), -- Alias para customer_email
  qtd_passageiros INTEGER, -- Alias para passengers
  qtd_bagagens INTEGER, -- Total de bagagens (large + small)
  bagagens_grandes INTEGER, -- Alias para luggage_large
  bagagens_pequenas INTEGER, -- Alias para luggage_small
  veiculo VARCHAR(255), -- Nome do veículo
  origem TEXT, -- Alias para pickup_address
  data_ida DATE, -- Alias para pickup_date
  horario TIME, -- Alias para pickup_time
  numero_voo VARCHAR(20), -- Alias para flight_number
  destino TEXT, -- Alias para destination_address
  tipo_trajeto VARCHAR(20), -- Alias para quote_type
  volta VARCHAR(100), -- Data e hora de volta formatada
  preco_base VARCHAR(20), -- Formato "U$ 250.00"
  valor_extras VARCHAR(20), -- Formato "U$ 50.00"
  validade VARCHAR(50) -- Formato "48 hours" ou "7 days"
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_quotes_booking_reference ON quotes(booking_reference);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_pickup_date ON quotes(pickup_date);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_expires_at ON quotes(expires_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at();

-- Trigger para sincronizar campos alias
CREATE OR REPLACE FUNCTION sync_quotes_alias_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Sincronizar campos principais com aliases
  NEW.nome_cliente = NEW.customer_name;
  NEW.email_cliente = NEW.customer_email;
  NEW.telefone_cliente = NEW.customer_phone;
  NEW.qtd_passageiros = NEW.passengers;
  NEW.bagagens_grandes = NEW.luggage_large;
  NEW.bagagens_pequenas = NEW.luggage_small;
  NEW.qtd_bagagens = COALESCE(NEW.luggage_large, 0) + COALESCE(NEW.luggage_small, 0);
  NEW.origem = NEW.pickup_address;
  NEW.data_ida = NEW.pickup_date;
  NEW.horario = NEW.pickup_time;
  NEW.numero_voo = NEW.flight_number;
  NEW.destino = NEW.destination_address;
  NEW.tipo_trajeto = NEW.quote_type;
  
  -- Formatar preços
  NEW.preco_base = 'U$ ' || NEW.base_price::text;
  NEW.valor_extras = CASE WHEN NEW.extras_price > 0 THEN 'U$ ' || NEW.extras_price::text ELSE NULL END;
  NEW.valor_total = 'U$ ' || NEW.total_amount::text;
  
  -- Formatar validade
  NEW.validade = CASE 
    WHEN NEW.expires_days = 1 THEN '1 day'
    WHEN NEW.expires_days < 7 THEN NEW.expires_days::text || ' days'
    WHEN NEW.expires_days = 7 THEN '1 week'
    WHEN NEW.expires_days < 30 THEN (NEW.expires_days / 7)::text || ' weeks'
    ELSE NEW.expires_days::text || ' days'
  END;
  
  -- Formatar volta (se round-trip)
  IF NEW.quote_type = 'round-trip' AND NEW.return_date IS NOT NULL THEN
    NEW.volta = NEW.return_date::text || CASE WHEN NEW.return_time IS NOT NULL THEN ' ' || NEW.return_time::text ELSE '' END;
  END IF;
  
  -- Definir expires_at se não estiver definido
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at = NEW.created_at + (NEW.expires_days || ' days')::interval;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_quotes_alias_fields
  BEFORE INSERT OR UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION sync_quotes_alias_fields();

-- RLS (Row Level Security)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Política para admins (acesso total)
CREATE POLICY "Admins can manage all quotes" ON quotes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  );

-- Política para visualização pública de quotes (por ID)
CREATE POLICY "Public can view quotes by ID" ON quotes
  FOR SELECT USING (true);

-- Comentários para documentação
COMMENT ON TABLE quotes IS 'Tabela de orçamentos/cotações de transfer';
COMMENT ON COLUMN quotes.booking_reference IS 'Referência única do orçamento (ex: AZ0005000NYC)';
COMMENT ON COLUMN quotes.status IS 'Status do orçamento: draft, sent, accepted, rejected, expired';
COMMENT ON COLUMN quotes.quote_type IS 'Tipo de viagem: one-way, round-trip, hourly';
COMMENT ON COLUMN quotes.extras IS 'Array JSON com serviços extras selecionados';
COMMENT ON COLUMN quotes.expires_at IS 'Data/hora de expiração do orçamento';
COMMENT ON COLUMN quotes.valor_total IS 'Campo de compatibilidade - valor total formatado (ex: U$ 300.00)';