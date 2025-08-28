-- SCRIPT DE TESTE CORRIGIDO PARA CRIAÇÃO DE ORÇAMENTOS
-- Execute este script no SQL Editor do Supabase
-- Todos os nomes de colunas e campos obrigatórios estão corretos

-- ===== VERIFICAÇÃO INICIAL =====
SELECT '🔍 VERIFICANDO AMBIENTE' as status;

-- Verificar estrutura da tabela quotes
SELECT 'Colunas da tabela quotes:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'quotes'
AND column_name IN (
    'pickup_address', 'destination_address', 'quote_type', 
    'vehicle_category_id', 'base_price', 'total_amount',
    'customer_name', 'customer_email', 'customer_phone', 'booking_reference'
)
ORDER BY ordinal_position;

-- Verificar categorias de veículos disponíveis
SELECT 'Categorias de veículos disponíveis:' as info;
SELECT id, name, base_price, is_active 
FROM vehicle_categories 
WHERE is_active = true
ORDER BY id;

-- ===== TESTE 1: INSERÇÃO BÁSICA COM SEDAN =====
SELECT '💾 TESTE 1: Inserção básica com categoria SEDAN' as status;

BEGIN;
INSERT INTO quotes (
    -- Campos obrigatórios do cliente
    customer_name,
    customer_email,
    customer_phone,
    booking_reference,
    
    -- Campos obrigatórios do trajeto
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    quote_type,
    
    -- Campos obrigatórios do veículo
    vehicle_category_id,
    passengers,
    
    -- Campos obrigatórios de preço
    base_price,
    total_amount,
    
    -- Status
    status
) VALUES (
    'Mayssa Ferreira Costa',
    'mayssa@gmail.com',
    '64992019427',
    'TEST-SEDAN-' || EXTRACT(EPOCH FROM NOW())::text,
    
    'Miami International Airport (MIA)',
    'South Beach - Ocean Drive',
    CURRENT_DATE + INTERVAL '1 day',
    '14:30:00',
    'one-way',
    
    'sedan',
    2,
    
    170.00,
    170.00,
    
    'pending'
) RETURNING 
    id, 
    customer_name, 
    vehicle_category_id, 
    base_price, 
    total_amount, 
    created_at;
    
SELECT 'SUCESSO: Orçamento com SEDAN criado!' as resultado;
ROLLBACK;

-- ===== TESTE 2: INSERÇÃO COM SUV =====
SELECT '💾 TESTE 2: Inserção com categoria SUV' as status;

BEGIN;
INSERT INTO quotes (
    customer_name,
    customer_email,
    customer_phone,
    booking_reference,
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    quote_type,
    vehicle_category_id,
    passengers,
    base_price,
    total_amount,
    status
) VALUES (
    'Cliente SUV Test',
    'suv@test.com',
    '555-2345',
    'TEST-SUV-' || EXTRACT(EPOCH FROM NOW())::text,
    'Fort Lauderdale Airport',
    'Miami Beach Hotel',
    CURRENT_DATE + INTERVAL '2 days',
    '16:00:00',
    'one-way',
    'suv',
    4,
    220.00,
    220.00,
    'pending'
) RETURNING 
    id, 
    customer_name, 
    vehicle_category_id, 
    base_price, 
    total_amount;
    
SELECT 'SUCESSO: Orçamento com SUV criado!' as resultado;
ROLLBACK;

-- ===== TESTE 3: INSERÇÃO COM VAN =====
SELECT '💾 TESTE 3: Inserção com categoria VAN' as status;

BEGIN;
INSERT INTO quotes (
    customer_name,
    customer_email,
    customer_phone,
    booking_reference,
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    quote_type,
    vehicle_category_id,
    passengers,
    base_price,
    total_amount,
    status
) VALUES (
    'Cliente VAN Test',
    'van@test.com',
    '555-3456',
    'TEST-VAN-' || EXTRACT(EPOCH FROM NOW())::text,
    'Miami Airport',
    'Key Biscayne Resort',
    CURRENT_DATE + INTERVAL '3 days',
    '18:00:00',
    'one-way',
    'van',
    6,
    280.00,
    280.00,
    'pending'
) RETURNING 
    id, 
    customer_name, 
    vehicle_category_id, 
    base_price, 
    total_amount;
    
SELECT 'SUCESSO: Orçamento com VAN criado!' as resultado;
ROLLBACK;

-- ===== TESTE 4: PREÇO PERSONALIZADO =====
SELECT '💰 TESTE 4: Preço personalizado (fora de cobertura)' as status;

BEGIN;
INSERT INTO quotes (
    customer_name,
    customer_email,
    customer_phone,
    booking_reference,
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    quote_type,
    vehicle_category_id,
    passengers,
    base_price,
    total_amount,
    status,
    notes
) VALUES (
    'Cliente Personalizado',
    'custom@test.com',
    '555-9999',
    'TEST-CUSTOM-' || EXTRACT(EPOCH FROM NOW())::text,
    'Localização Personalizada A',
    'Localização Personalizada B',
    CURRENT_DATE + INTERVAL '4 days',
    '10:00:00',
    'one-way',
    'sedan',
    2,
    350.00, -- Preço personalizado
    350.00,
    'pending',
    'Preço personalizado para localização fora de cobertura'
) RETURNING 
    id, 
    customer_name, 
    vehicle_category_id, 
    base_price, 
    total_amount, 
    notes;
    
SELECT 'SUCESSO: Orçamento com preço personalizado criado!' as resultado;
ROLLBACK;

-- ===== TESTE 5: ERRO COM CATEGORIA INVÁLIDA =====
SELECT '❌ TESTE 5: Categoria inválida (deve falhar)' as status;

BEGIN;
SELECT 'Tentando inserir com categoria "economy" (deve falhar)...' as acao;
INSERT INTO quotes (
    customer_name,
    customer_email,
    customer_phone,
    booking_reference,
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    quote_type,
    vehicle_category_id,
    passengers,
    base_price,
    total_amount,
    status
) VALUES (
    'Teste Erro',
    'erro@test.com',
    '555-0000',
    'TEST-ERROR-' || EXTRACT(EPOCH FROM NOW())::text,
    'Test Location',
    'Test Destination',
    CURRENT_DATE + INTERVAL '1 day',
    '12:00:00',
    'one-way',
    'economy', -- Esta categoria não existe!
    2,
    100.00,
    100.00,
    'pending'
);
SELECT 'ERRO: Não deveria chegar aqui!' as resultado;
ROLLBACK;

-- ===== VERIFICAÇÃO FINAL =====
SELECT '✅ VERIFICAÇÃO FINAL' as status;
SELECT 'Todos os testes concluídos!' as info;
SELECT 'Se chegou até aqui, a estrutura da tabela está correta.' as conclusao;
SELECT 'Use categorias válidas: sedan, suv, van' as recomendacao;
SELECT 'Para preços personalizados, ajuste o campo base_price' as dica;