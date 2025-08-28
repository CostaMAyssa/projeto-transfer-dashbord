-- SIMULAÇÃO COMPLETA DE CRIAÇÃO DE ORÇAMENTO
-- Execute este script no SQL Editor do Supabase para testar todo o fluxo

-- ===== PARTE 1: VERIFICAÇÃO DO AMBIENTE =====
SELECT '🔍 VERIFICANDO AMBIENTE' as status;

-- 1.1 Verificar se as tabelas existem
SELECT 'Tabelas existentes:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quotes', 'vehicle_categories', 'clients')
ORDER BY table_name;

-- 1.2 Verificar estrutura da tabela quotes
SELECT 'Estrutura da tabela quotes:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'quotes'
ORDER BY ordinal_position;

-- 1.3 Verificar categorias de veículos disponíveis
SELECT 'Categorias de veículos disponíveis:' as info;
SELECT id, name, base_price, is_active FROM vehicle_categories ORDER BY id;

-- 1.4 Verificar políticas RLS
SELECT 'Políticas RLS ativas:' as info;
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'quotes';

-- ===== PARTE 2: TESTE DE INSERÇÃO BÁSICA =====
SELECT '💾 TESTANDO INSERÇÃO BÁSICA' as status;

-- 2.1 Teste com dados mínimos obrigatórios
BEGIN;
SELECT 'Teste 1: Inserção com dados mínimos' as teste;
INSERT INTO quotes (
    pickup_address,
    dropoff_address,
    pickup_date,
    pickup_time,
    service_type,
    vehicle_category_id,
    base_price,
    total_cost,
    status
) VALUES (
    'Miami International Airport',
    'South Beach Hotel',
    CURRENT_DATE + INTERVAL '1 day',
    '14:30:00',
    'one-way',
    'sedan',
    150.00,
    150.00,
    'pending'
) RETURNING id, vehicle_category_id, base_price, total_cost, created_at;
ROLLBACK;

-- ===== PARTE 3: TESTE COM DADOS COMPLETOS =====
SELECT '📋 TESTANDO DADOS COMPLETOS' as status;

-- 3.1 Primeiro, verificar se existe um cliente
SELECT 'Clientes existentes:' as info;
SELECT id, name, email FROM clients LIMIT 3;

-- 3.2 Teste com todos os campos preenchidos
BEGIN;
SELECT 'Teste 2: Inserção com dados completos' as teste;
INSERT INTO quotes (
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    service_type,
    vehicle_category_id,
    base_price,
    total_cost,
    status,
    client_name,
    client_email,
    client_phone,
    passenger_count,
    luggage_count,
    flight_number,
    special_requests,
    notes
) VALUES (
    'Miami International Airport (MIA)',
    'Hotel Fontainebleau Miami Beach',
    CURRENT_DATE + INTERVAL '2 days',
    '16:45:00',
    'one-way',
    'suv',
    180.00,
    202.00, -- com extras
    'pending',
    'Mayssa Ferreira Costa',
    'mayssa@gmail.com',
    '64992019427',
    2,
    3,
    'AA1234',
    'Child seat required',
    'Preço ajustado manualmente para cliente VIP'
) RETURNING id, vehicle_category_id, base_price, total_cost, client_name, created_at;
ROLLBACK;

-- ===== PARTE 4: TESTE DE PREÇO PERSONALIZADO =====
SELECT '💰 TESTANDO PREÇO PERSONALIZADO' as status;

-- 4.1 Teste com preço personalizado (fora de cobertura)
BEGIN;
SELECT 'Teste 3: Preço personalizado para área fora de cobertura' as teste;
INSERT INTO quotes (
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    service_type,
    vehicle_category_id,
    base_price, -- Preço personalizado
    total_cost,
    status,
    client_name,
    client_email,
    client_phone,
    notes
) VALUES (
    'Orlando International Airport',
    'Disney World Resort',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00:00',
    'one-way',
    'van',
    250.00, -- Preço personalizado
    250.00,
    'pending',
    'Cliente Teste',
    'teste@email.com',
    '1234567890',
    'Localização fora da área de cobertura - preço ajustado manualmente'
) RETURNING id, vehicle_category_id, base_price, total_cost, notes, created_at;
ROLLBACK;

-- ===== PARTE 5: VERIFICAÇÃO DE ERROS COMUNS =====
SELECT '⚠️ TESTANDO ERROS COMUNS' as status;

-- 5.1 Teste com categoria inválida (deve falhar)
BEGIN;
SELECT 'Teste 4: Categoria inválida (deve falhar)' as teste;
INSERT INTO quotes (
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    service_type,
    vehicle_category_id,
    base_price,
    total_cost,
    status
) VALUES (
    'Test Pickup',
    'Test Dropoff',
    CURRENT_DATE + INTERVAL '1 day',
    '12:00:00',
    'one-way',
    'economy', -- Categoria que não existe
    120.00,
    120.00,
    'pending'
);
ROLLBACK;

-- ===== PARTE 6: VERIFICAÇÃO FINAL =====
SELECT '✅ VERIFICAÇÃO FINAL' as status;

-- 6.1 Contar orçamentos existentes
SELECT 'Total de orçamentos na base:' as info, COUNT(*) as total FROM quotes;

-- 6.2 Mostrar últimos orçamentos criados
SELECT 'Últimos 3 orçamentos:' as info;
SELECT id, client_name, vehicle_category_id, base_price, total_cost, status, created_at
FROM quotes 
ORDER BY created_at DESC 
LIMIT 3;

-- ===== RESULTADOS ESPERADOS =====
/*
RESULTADOS ESPERADOS:
✅ Teste 1: Deve inserir com sucesso (dados mínimos)
✅ Teste 2: Deve inserir com sucesso (dados completos)
✅ Teste 3: Deve inserir com sucesso (preço personalizado)
❌ Teste 4: Deve falhar com erro 23503 (categoria inválida)

Se algum dos testes 1, 2 ou 3 falhar, temos um problema no sistema.
Se o teste 4 não falhar, temos um problema de validação.
*/