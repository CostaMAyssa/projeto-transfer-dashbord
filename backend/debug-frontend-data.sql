-- SIMULAÇÃO DOS DADOS ENVIADOS PELO FRONTEND
-- Este script simula exatamente os dados que o frontend está tentando enviar

-- ===== DADOS DO FORMULÁRIO ATUAL =====
SELECT '📝 SIMULANDO DADOS DO FRONTEND' as status;

-- Baseado na imagem fornecida, estes são os dados do formulário:
-- Cliente: Mayssa Ferreira Costa
-- Email: mayssa@gmail.com
-- Telefone: 64992019427
-- Origem: Hertz Car Rental - New York City - John F Kennedy International Airport (JFK)
-- Destino: John F. Kennedy International Airport (JFK), Queens, NY
-- Tipo: One-way
-- Preço Base: $170.00
-- Extras: $22.00
-- Total: $192.00

-- ===== TESTE 1: SIMULAÇÃO EXATA DO FRONTEND =====
SELECT '🎯 TESTE COM DADOS EXATOS DO FORMULÁRIO' as teste;

BEGIN;
INSERT INTO quotes (
    -- Dados do cliente
    customer_name,
    customer_email,
    customer_phone,
    
    -- Dados do trajeto
    pickup_address,
    destination_address,
    quote_type,
    
    -- Dados de data/hora (usando valores padrão para teste)
    pickup_date,
    pickup_time,
    
    -- Categoria do veículo (PROBLEMA POTENCIAL)
    vehicle_category_id,
    
    -- Preços
    base_price,
    total_amount,
    
    -- Status
    status,
    
    -- Referência
    booking_reference
) VALUES (
    'Mayssa Ferreira Costa',
    'mayssa@gmail.com',
    '64992019427',
    
    'Hertz Car Rental - New York City - John F Kennedy International Airport (JFK), Federal Circle, Queens, NY',
    'John F. Kennedy International Airport (JFK), Queens, NY',
    'one-way',
    
    CURRENT_DATE + INTERVAL '1 day',
    '14:30:00',
    
    'sedan', -- Tentando com categoria válida
    
    170.00,
    192.00,
    
    'pending',
    
    'MAYSSA' || EXTRACT(EPOCH FROM NOW())::text
) RETURNING 
    id,
    client_name,
    vehicle_category_id,
    base_price,
    total_cost,
    created_at;

SELECT 'SUCESSO: Orçamento inserido com categoria sedan' as resultado;
ROLLBACK;

-- ===== TESTE 2: VERIFICAR SE O PROBLEMA É A CATEGORIA =====
SELECT '🔍 TESTANDO DIFERENTES CATEGORIAS' as teste;

-- Teste com SUV
BEGIN;
INSERT INTO quotes (
    customer_name, customer_email, customer_phone,
    pickup_address, destination_address, quote_type,
    pickup_date, pickup_time,
    vehicle_category_id, base_price, total_amount, status,
    booking_reference
) VALUES (
    'Mayssa Ferreira Costa', 'mayssa@gmail.com', '64992019427',
    'JFK Airport', 'JFK Airport', 'one-way',
    CURRENT_DATE + 1, '14:30:00',
    'suv', 170.00, 192.00, 'pending',
    'SUV' || EXTRACT(EPOCH FROM NOW())::text
) RETURNING id, vehicle_category_id;
SELECT 'SUCESSO: Categoria SUV funciona' as resultado;
ROLLBACK;

-- Teste com VAN
BEGIN;
INSERT INTO quotes (
    customer_name, customer_email, customer_phone,
    pickup_address, destination_address, quote_type,
    pickup_date, pickup_time,
    vehicle_category_id, base_price, total_amount, status,
    booking_reference
) VALUES (
    'Mayssa Ferreira Costa', 'mayssa@gmail.com', '64992019427',
    'JFK Airport', 'JFK Airport', 'one-way',
    CURRENT_DATE + 1, '14:30:00',
    'van', 170.00, 192.00, 'pending',
    'VAN' || EXTRACT(EPOCH FROM NOW())::text
) RETURNING id, vehicle_category_id;
SELECT 'SUCESSO: Categoria VAN funciona' as resultado;
ROLLBACK;

-- ===== TESTE 3: VERIFICAR CAMPOS OBRIGATÓRIOS =====
SELECT '📋 VERIFICANDO CAMPOS OBRIGATÓRIOS' as teste;

-- Verificar quais campos são NOT NULL
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'quotes'
AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- ===== TESTE 4: SIMULAR ERRO COM DADOS INVÁLIDOS =====
SELECT '❌ TESTANDO DADOS INVÁLIDOS' as teste;

-- Teste com categoria inexistente (como 'economy')
BEGIN;
SELECT 'Tentando inserir com categoria inexistente...' as acao;
INSERT INTO quotes (
    customer_name, customer_email, customer_phone,
    pickup_address, destination_address, quote_type,
    pickup_date, pickup_time,
    vehicle_category_id, base_price, total_amount, status,
    booking_reference
) VALUES (
    'Mayssa Ferreira Costa', 'mayssa@gmail.com', '64992019427',
    'JFK Airport', 'JFK Airport', 'one-way',
    CURRENT_DATE + 1, '14:30:00',
    'economy', 170.00, 192.00, 'pending', -- Esta linha deve falhar
    'ECON' || EXTRACT(EPOCH FROM NOW())::text
);
SELECT 'ERRO: Não deveria chegar aqui!' as resultado;
ROLLBACK;

-- ===== DIAGNÓSTICO FINAL =====
SELECT '🔧 DIAGNÓSTICO FINAL' as status;

-- Verificar se há triggers ou funções que podem estar interferindo
SELECT 'Triggers na tabela quotes:' as info;
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'quotes';

-- Verificar permissões do usuário atual
SELECT 'Usuário atual:' as info, current_user;

-- Verificar se RLS está bloqueando
SELECT 'RLS habilitado:' as info, 
       CASE WHEN rowsecurity THEN 'SIM' ELSE 'NÃO' END as rls_ativo
FROM pg_tables 
WHERE tablename = 'quotes';

-- ===== INSTRUÇÕES =====
/*
INSTRUÇÕES PARA EXECUÇÃO:

1. Execute este script completo no SQL Editor do Supabase
2. Observe quais testes passam e quais falham
3. Se os testes 1, 2 e 3 passarem, o problema não é no banco
4. Se algum teste falhar, anote o erro exato
5. O teste 4 DEVE falhar com erro 23503

POSSÍVEIS PROBLEMAS:
- Categoria de veículo incorreta sendo enviada pelo frontend
- Campos obrigatórios não preenchidos
- Políticas RLS bloqueando a inserção
- Triggers interferindo na inserção
- Problemas de permissão
*/