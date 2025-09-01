-- Script de Dados Iniciais - AZ Transfer Booking
-- Data: 2024-01-20
-- Descrição: Inserção de dados iniciais para desenvolvimento e testes

-- =====================================================
-- DADOS INICIAIS - VEÍCULOS
-- =====================================================

INSERT INTO vehicles (id, name, type, passengers, luggage, year, license_plate, status, image_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Mercedes Sprinter Premium', 'minivan', 8, 8, 2023, 'AZ-001', 'active', '/images/vehicles/sprinter.jpg'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Toyota Hiace Comfort', 'van', 12, 10, 2022, 'AZ-002', 'active', '/images/vehicles/hiace.jpg'),
  ('550e8400-e29b-41d4-a716-446655440003', 'BMW X5 Executive', 'suv', 4, 4, 2024, 'AZ-003', 'active', '/images/vehicles/bmw-x5.jpg'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Audi A6 Business', 'sedan', 3, 3, 2023, 'AZ-004', 'active', '/images/vehicles/audi-a6.jpg'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Ford Transit Custom', 'van', 9, 8, 2022, 'AZ-005', 'maintenance', '/images/vehicles/transit.jpg'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Mercedes E-Class', 'sedan', 3, 3, 2024, 'AZ-006', 'active', '/images/vehicles/e-class.jpg')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DADOS INICIAIS - MOTORISTAS
-- =====================================================

INSERT INTO drivers (id, full_name, phone, email, license_number, status, vehicle_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'João Silva Santos', '+55 11 99999-1001', 'joao.silva@aztransfer.com', 'SP123456789', 'active', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Maria Oliveira Costa', '+55 11 99999-1002', 'maria.oliveira@aztransfer.com', 'SP123456790', 'active', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Carlos Eduardo Lima', '+55 11 99999-1003', 'carlos.lima@aztransfer.com', 'SP123456791', 'active', '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Ana Paula Ferreira', '+55 11 99999-1004', 'ana.ferreira@aztransfer.com', 'SP123456792', 'active', '550e8400-e29b-41d4-a716-446655440004'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Roberto Almeida', '+55 11 99999-1005', 'roberto.almeida@aztransfer.com', 'SP123456793', 'inactive', null),
  ('660e8400-e29b-41d4-a716-446655440006', 'Fernanda Santos', '+55 11 99999-1006', 'fernanda.santos@aztransfer.com', 'SP123456794', 'active', '550e8400-e29b-41d4-a716-446655440006')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DADOS INICIAIS - EXTRAS
-- =====================================================

INSERT INTO extras (id, name, description, price) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Cadeirinha Infantil', 'Cadeirinha de segurança para crianças até 12 anos', 15.00),
  ('770e8400-e29b-41d4-a716-446655440002', 'WiFi Premium', 'Internet de alta velocidade durante toda a viagem', 10.00),
  ('770e8400-e29b-41d4-a716-446655440003', 'Kit Cortesia', 'Água mineral, snacks e toalhas refrescantes', 8.00),
  ('770e8400-e29b-41d4-a716-446655440004', 'Parada Extra', 'Parada adicional durante o trajeto (máximo 15 minutos)', 25.00),
  ('770e8400-e29b-41d4-a716-446655440005', 'Carregador Universal', 'Carregador para dispositivos móveis (USB-C, Lightning, Micro-USB)', 5.00),
  ('770e8400-e29b-41d4-a716-446655440006', 'Jornal e Revistas', 'Seleção de jornais e revistas atuais', 3.00),
  ('770e8400-e29b-41d4-a716-446655440007', 'Serviço de Espera', 'Motorista aguarda até 30 minutos sem custo adicional', 20.00),
  ('770e8400-e29b-41d4-a716-446655440008', 'Ar Condicionado Premium', 'Climatização personalizada e aromatização do veículo', 12.00)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DADOS DE EXEMPLO - VOOS (PARA TESTES)
-- =====================================================

INSERT INTO flight_data (
  id, flight_number, airline_code, airline_name, origin_airport, destination_airport,
  scheduled_departure, scheduled_arrival, flight_status, service_type, is_domestic
) VALUES
  (
    '880e8400-e29b-41d4-a716-446655440001',
    'G31234',
    'G3',
    'GOL Linhas Aéreas',
    'SBSP',
    'SBRJ',
    '2024-01-25 08:00:00-03',
    '2024-01-25 09:15:00-03',
    'scheduled',
    'arrival',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440002',
    'AD4567',
    'AD',
    'Azul Linhas Aéreas',
    'SBGR',
    'SBPA',
    '2024-01-25 14:30:00-03',
    '2024-01-25 16:45:00-03',
    'scheduled',
    'departure',
    true
  ),
  (
    '880e8400-e29b-41d4-a716-446655440003',
    'TP8901',
    'TP',
    'TAP Air Portugal',
    'LPPT',
    'SBGR',
    '2024-01-25 23:45:00+00',
    '2024-01-26 08:30:00-03',
    'scheduled',
    'arrival',
    false
  ),
  (
    '880e8400-e29b-41d4-a716-446655440004',
    'LA3456',
    'LA',
    'LATAM Airlines',
    'SBGR',
    'KJFK',
    '2024-01-26 01:15:00-03',
    '2024-01-26 09:45:00-05',
    'scheduled',
    'departure',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Calcular horários sugeridos de pickup para os voos de exemplo
UPDATE flight_data SET
  suggested_pickup_time = CASE
    WHEN service_type = 'arrival' AND is_domestic = true THEN
      scheduled_arrival + INTERVAL '45 minutes'  -- 15 min desembarque + 20 min bagagem + 10 min buffer
    WHEN service_type = 'arrival' AND is_domestic = false THEN
      scheduled_arrival + INTERVAL '80 minutes'  -- 30 min desembarque + 40 min bagagem + 10 min buffer
    WHEN service_type = 'departure' AND is_domestic = true THEN
      scheduled_departure - INTERVAL '105 minutes'  -- 60 min check-in + 30 min segurança + 15 min buffer
    WHEN service_type = 'departure' AND is_domestic = false THEN
      scheduled_departure - INTERVAL '195 minutes'  -- 120 min check-in + 45 min segurança + 30 min buffer
  END
WHERE suggested_pickup_time IS NULL;

-- =====================================================
-- DADOS DE EXEMPLO - RESERVAS (PARA TESTES)
-- =====================================================

-- Nota: As reservas de exemplo serão criadas apenas se houver usuários autenticados
-- Este script pode ser executado após a criação de usuários de teste

-- Exemplo de reserva com voo (comentado para evitar erro de foreign key)
/*
INSERT INTO bookings (
  id, user_id, pickup_location, dropoff_location, pickup_date, pickup_time,
  vehicle_id, passengers, luggage, flight_data_id, flight_number,
  is_flight_monitored, pickup_time_source, notes, status
) VALUES (
  '990e8400-e29b-41d4-a716-446655440001',
  'user-uuid-here',  -- Substituir por UUID de usuário real
  'Aeroporto Internacional de Guarulhos (GRU)',
  'Hotel Copacabana Palace - Rio de Janeiro',
  '2024-01-25',
  '10:00:00',
  '550e8400-e29b-41d4-a716-446655440001',
  2,
  3,
  '880e8400-e29b-41d4-a716-446655440001',
  'G31234',
  true,
  'flight_suggested',
  'Transfer para hotel após chegada do voo GOL',
  'confirmed'
);
*/

-- =====================================================
-- VERIFICAÇÕES E ESTATÍSTICAS
-- =====================================================

-- Verificar dados inseridos
SELECT 'vehicles' as table_name, count(*) as total FROM vehicles
UNION ALL
SELECT 'drivers' as table_name, count(*) as total FROM drivers
UNION ALL
SELECT 'extras' as table_name, count(*) as total FROM extras
UNION ALL
SELECT 'flight_data' as table_name, count(*) as total FROM flight_data
UNION ALL
SELECT 'bookings' as table_name, count(*) as total FROM bookings;

-- Verificar relacionamentos
SELECT 
  v.name as vehicle_name,
  d.full_name as driver_name,
  v.status as vehicle_status,
  d.status as driver_status
FROM vehicles v
LEFT JOIN drivers d ON v.id = d.vehicle_id
ORDER BY v.name;

-- Verificar voos com horários sugeridos
SELECT 
  flight_number,
  airline_name,
  service_type,
  is_domestic,
  scheduled_departure,
  scheduled_arrival,
  suggested_pickup_time,
  CASE 
    WHEN service_type = 'arrival' THEN 
      EXTRACT(EPOCH FROM (suggested_pickup_time - scheduled_arrival))/60
    ELSE 
      EXTRACT(EPOCH FROM (scheduled_departure - suggested_pickup_time))/60
  END as buffer_minutes
FROM flight_data
ORDER BY scheduled_departure;