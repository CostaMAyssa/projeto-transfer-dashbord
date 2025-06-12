-- Script para popular as tabelas com dados de exemplo
-- Execute este script no SQL Editor do Supabase

-- Inserir veículos
INSERT INTO vehicles (name, type, passengers, luggage, year, license_plate, status, image_url) VALUES
('Mercedes-Benz E-Class', 'Business Class', 3, 2, 2022, 'AZ-1234', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp'),
('Mercedes-Benz S-Class', 'First Class', 3, 3, 2023, 'AZ-5678', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-s-class-2598047.webp'),
('Mercedes-Benz V-Class', 'Business Van/SUV', 7, 5, 2022, 'AZ-9012', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-v-class-2598047.webp'),
('BMW 5 Series', 'Business Class', 3, 2, 2021, 'AZ-3456', 'maintenance', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/bmw-5-series-2598047.webp'),
('Audi A8', 'First Class', 3, 3, 2022, 'AZ-7890', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/audi-a8-2598047.webp'),
('Chevrolet Suburban', 'Business Van/SUV', 7, 6, 2021, 'AZ-1357', 'active', 'https://content.app-sources.com/s/98064488125095989/uploads/Images/chevrolet-suburban-2598047.webp');

-- Inserir motoristas
INSERT INTO drivers (full_name, phone, email, license_number, status, vehicle_id) VALUES
('João Silva', '+55 11 99999-1234', 'joao.silva@aztransfer.com', '12345678901', 'active', (SELECT id FROM vehicles WHERE license_plate = 'AZ-1234')),
('Maria Santos', '+55 11 99999-5678', 'maria.santos@aztransfer.com', '23456789012', 'active', (SELECT id FROM vehicles WHERE license_plate = 'AZ-5678')),
('Pedro Oliveira', '+55 11 99999-9012', 'pedro.oliveira@aztransfer.com', '34567890123', 'active', (SELECT id FROM vehicles WHERE license_plate = 'AZ-9012')),
('Ana Costa', '+55 11 99999-3456', 'ana.costa@aztransfer.com', '45678901234', 'on_leave', (SELECT id FROM vehicles WHERE license_plate = 'AZ-3456')),
('Carlos Ferreira', '+55 11 99999-7890', 'carlos.ferreira@aztransfer.com', '56789012345', 'active', (SELECT id FROM vehicles WHERE license_plate = 'AZ-7890')),
('Lucia Rodrigues', '+55 11 99999-1357', 'lucia.rodrigues@aztransfer.com', '67890123456', 'active', (SELECT id FROM vehicles WHERE license_plate = 'AZ-1357'));

-- Inserir extras
INSERT INTO extras (name, description, price) VALUES
('Cadeirinha Infantil', 'Adequada para crianças de 0-18 kg (aproximadamente 0 a 4 anos)', 12.00),
('Assento Elevado', 'Adequado para crianças de 15-36 kg (aproximadamente 4 a 10 anos)', 12.00),
('Garrafa de Vodka', 'Garrafa Absolut Vodka 0.7l', 39.00),
('Buquê de Flores', 'Buquê de flores sazonais preparado por florista local', 75.00),
('Pacote de Bebidas', 'Seleção premium de destilados e mixers', 120.00),
('Assistência no Aeroporto', 'Assistência VIP no aeroporto e serviço fast-track', 150.00),
('Serviço de Segurança', 'Pessoal de segurança profissional para sua viagem', 250.00);

-- Inserir regras de preços
INSERT INTO pricing_rules (origin_city, destination_city, vehicle_type, base_price, price_per_km, currency) VALUES
('London', 'Heathrow Airport', 'Business Class', 85.00, 2.50, 'GBP'),
('London', 'Heathrow Airport', 'First Class', 120.00, 3.00, 'GBP'),
('London', 'Heathrow Airport', 'Business Van/SUV', 140.00, 3.50, 'GBP'),
('London', 'Gatwick Airport', 'Business Class', 95.00, 2.50, 'GBP'),
('London', 'Gatwick Airport', 'First Class', 130.00, 3.00, 'GBP'),
('London', 'Gatwick Airport', 'Business Van/SUV', 150.00, 3.50, 'GBP'),
('London', 'Stansted Airport', 'Business Class', 105.00, 2.50, 'GBP'),
('London', 'Stansted Airport', 'First Class', 140.00, 3.00, 'GBP'),
('London', 'Stansted Airport', 'Business Van/SUV', 160.00, 3.50, 'GBP'),
(NULL, NULL, 'Business Class', 75.00, 2.00, 'GBP'), -- Regra geral para Business Class
(NULL, NULL, 'First Class', 100.00, 2.50, 'GBP'), -- Regra geral para First Class
(NULL, NULL, 'Business Van/SUV', 120.00, 3.00, 'GBP'); -- Regra geral para Van/SUV

-- Inserir algumas reservas de exemplo
INSERT INTO bookings (pickup_location, dropoff_location, pickup_date, pickup_time, vehicle_id, passengers, luggage, total_amount, status, payment_status, notes) VALUES
('Heathrow Airport Terminal 5', 'Mayfair, London', '2024-01-15', '14:30:00', (SELECT id FROM vehicles WHERE license_plate = 'AZ-1234'), 2, 3, 95.50, 'completed', 'paid', 'Flight BA123 arriving from New York'),
('Central London Hotel', 'Gatwick Airport', '2024-01-16', '08:00:00', (SELECT id FROM vehicles WHERE license_plate = 'AZ-5678'), 1, 2, 142.00, 'scheduled', 'paid', 'Early morning departure'),
('Stansted Airport', 'Cambridge', '2024-01-17', '16:45:00', (SELECT id FROM vehicles WHERE license_plate = 'AZ-9012'), 4, 6, 185.75, 'pending', 'unpaid', 'Family with children'),
('London Bridge', 'Heathrow Airport Terminal 2', '2024-01-18', '11:15:00', (SELECT id FROM vehicles WHERE license_plate = 'AZ-7890'), 2, 2, 108.25, 'in_progress', 'paid', 'Business meeting pickup'),
('Canary Wharf', 'Luton Airport', '2024-01-19', '06:30:00', (SELECT id FROM vehicles WHERE license_plate = 'AZ-1357'), 3, 4, 156.00, 'scheduled', 'paid', 'Early flight to Dublin');

-- Inserir alguns extras nas reservas
INSERT INTO booking_extras (booking_id, extra_id, quantity, price) VALUES
((SELECT id FROM bookings WHERE pickup_location = 'Heathrow Airport Terminal 5'), (SELECT id FROM extras WHERE name = 'Cadeirinha Infantil'), 1, 12.00),
((SELECT id FROM bookings WHERE pickup_location = 'Stansted Airport'), (SELECT id FROM extras WHERE name = 'Cadeirinha Infantil'), 2, 12.00),
((SELECT id FROM bookings WHERE pickup_location = 'Stansted Airport'), (SELECT id FROM extras WHERE name = 'Assento Elevado'), 1, 12.00),
((SELECT id FROM bookings WHERE pickup_location = 'London Bridge'), (SELECT id FROM extras WHERE name = 'Assistência no Aeroporto'), 1, 150.00);

-- Verificar se os dados foram inseridos corretamente
SELECT 'Veículos inseridos:' as info, count(*) as total FROM vehicles
UNION ALL
SELECT 'Motoristas inseridos:', count(*) FROM drivers
UNION ALL
SELECT 'Extras inseridos:', count(*) FROM extras
UNION ALL
SELECT 'Regras de preço inseridas:', count(*) FROM pricing_rules
UNION ALL
SELECT 'Reservas inseridas:', count(*) FROM bookings
UNION ALL
SELECT 'Extras de reservas inseridos:', count(*) FROM booking_extras; 