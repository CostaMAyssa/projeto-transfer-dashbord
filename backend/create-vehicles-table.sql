-- Script para criar a tabela vehicles com todas as configurações necessárias
-- Execute este script no SQL Editor do Supabase se a tabela não existir ou estiver com problemas

-- Habilitar extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar ou recriar a tabela vehicles
DROP TABLE IF EXISTS vehicles CASCADE;

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  passengers integer NOT NULL,
  luggage integer NOT NULL,
  year integer,
  license_plate text UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "public_read_vehicles" ON vehicles
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_vehicles" ON vehicles
  FOR ALL USING (true)
  WITH CHECK (true);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_updated_at 
    BEFORE UPDATE ON vehicles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo se a tabela estiver vazia
INSERT INTO vehicles (name, type, passengers, luggage, year, license_plate, status, image_url) 
VALUES 
  ('Mercedes-Benz E-Class', 'Business Class', 3, 2, 2022, 'AZ-1234', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp'),
  ('Mercedes-Benz S-Class', 'First Class', 3, 3, 2023, 'AZ-5678', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-s-class-2598047.webp'),
  ('Mercedes-Benz V-Class', 'Business Van/SUV', 7, 5, 2022, 'AZ-9012', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-v-class-2598047.webp'),
  ('BMW 5 Series', 'Business Class', 3, 2, 2021, 'AZ-3456', 'maintenance', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/bmw-5-series-2598047.webp'),
  ('Audi A8', 'First Class', 3, 3, 2022, 'AZ-7890', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/audi-a8-2598047.webp'),
  ('Chevrolet Suburban', 'Business Van/SUV', 7, 6, 2021, 'AZ-1357', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/chevrolet-suburban-2598047.webp')
ON CONFLICT (license_plate) DO NOTHING;

-- Verificar se tudo foi criado corretamente
SELECT 'Tabela vehicles criada com sucesso!' AS status;
SELECT COUNT(*) AS total_vehicles FROM vehicles;
SELECT * FROM vehicles ORDER BY created_at DESC LIMIT 3; 