-- SCRIPT DE DIAGNÓSTICO COMPLETO PARA PROBLEMAS DE SALVAMENTO DE ORÇAMENTOS
-- Execute este script no SQL Editor do Supabase para verificar o estado atual

SELECT '=== 🔍 DIAGNÓSTICO COMPLETO DO SISTEMA DE ORÇAMENTOS ===' as titulo;

-- ===== 1. VERIFICAR ESTRUTURA DA TABELA QUOTES =====
SELECT '📋 ESTRUTURA DA TABELA QUOTES' as secao;

SELECT 
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_name = 'quotes' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===== 2. VERIFICAR RESTRIÇÕES DA TABELA =====
SELECT '🔒 RESTRIÇÕES E CHECKS' as secao;

SELECT 
    constraint_name as restricao,
    constraint_type as tipo
FROM information_schema.table_constraints 
WHERE table_name = 'quotes' 
    AND table_schema = 'public';

-- ===== 3. VERIFICAR CATEGORIAS DE VEÍCULOS DISPONÍVEIS =====
SELECT '🚗 CATEGORIAS DE VEÍCULOS ATIVAS' as secao;

SELECT 
    id,
    name as nome,
    type as tipo,
    capacity as capacidade,
    base_price as preco_base,
    is_active as ativo,
    created_at as criado_em
FROM vehicle_categories 
WHERE is_active = true
ORDER BY id;

-- ===== 4. VERIFICAR POLÍTICAS RLS ATIVAS =====
SELECT '🔐 POLÍTICAS RLS ATIVAS' as secao;

SELECT 
    policyname as politica,
    cmd as comando,
    permissive as permissiva,
    roles as funcoes,
    qual as condicao
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY policyname;

-- ===== 5. VERIFICAR ÚLTIMOS ORÇAMENTOS CRIADOS =====
SELECT '📊 ÚLTIMOS ORÇAMENTOS (últimas 24h)' as secao;

SELECT 
    id,
    booking_reference as referencia,
    customer_name as cliente,
    vehicle_category_id as categoria,
    base_price as preco_base,
    total_amount as total,
    status,
    created_at as criado_em
FROM quotes 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 10;

-- ===== 6. VERIFICAR CONTADORES =====
SELECT '📈 ESTATÍSTICAS GERAIS' as secao;

SELECT 
    'Total de orçamentos' as metrica,
    COUNT(*) as valor
FROM quotes
UNION ALL
SELECT 
    'Orçamentos hoje' as metrica,
    COUNT(*) as valor
FROM quotes 
WHERE DATE(created_at) = CURRENT_DATE
UNION ALL
SELECT 
    'Categorias ativas' as metrica,
    COUNT(*) as valor
FROM vehicle_categories 
WHERE is_active = true;

-- ===== 7. TESTE DE INSERÇÃO SIMPLES =====
SELECT '🧪 TESTE DE INSERÇÃO SIMPLES' as secao;

-- Primeiro, verificar se podemos fazer uma inserção básica
BEGIN;

-- Tentar inserir um orçamento de teste
INSERT INTO quotes (
    booking_reference,
    customer_name,
    customer_email,
    customer_phone,
    quote_type,
    pickup_address,
    pickup_date,
    pickup_time,
    destination_address,
    vehicle_category_id,
    passengers,
    base_price,
    total_amount,
    status
) VALUES (
    'TEST' || EXTRACT(EPOCH FROM NOW())::text,
    'Cliente Teste',
    'teste@email.com',
    '+1234567890',
    'one-way',
    'Endereço de Origem Teste',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Endereço de Destino Teste',
    'sedan',  -- Assumindo que 'sedan' existe
    2,
    100.00,
    100.00,
    'draft'
);

SELECT 'Teste de inserção: SUCESSO' as resultado;

-- Reverter o teste
ROLLBACK;

-- ===== 8. VERIFICAR ERROS COMUNS =====
SELECT '⚠️ VERIFICAÇÕES DE PROBLEMAS COMUNS' as secao;

-- Verificar se existe categoria 'economy' (que causava erro)
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM vehicle_categories WHERE id = 'economy') 
        THEN '✅ Categoria economy existe'
        ELSE '❌ Categoria economy NÃO existe (pode causar erro 23503)'
    END as verificacao_economy;

-- Verificar se existem zonas configuradas
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM zones LIMIT 1) 
        THEN '✅ Zonas configuradas: ' || COUNT(*)::text
        ELSE '⚠️ Nenhuma zona configurada'
    END as verificacao_zonas
FROM zones;

-- ===== 9. RECOMENDAÇÕES =====
SELECT '💡 RECOMENDAÇÕES PARA DEBUGGING' as secao;

SELECT '1. Verifique se todas as categorias de veículos necessárias existem' as recomendacao
UNION ALL
SELECT '2. Confirme que as políticas RLS permitem inserção'
UNION ALL
SELECT '3. Verifique se os tipos de dados estão corretos (números como DECIMAL)'
UNION ALL
SELECT '4. Confirme que todos os campos obrigatórios estão sendo enviados'
UNION ALL
SELECT '5. Verifique se o status está entre os valores permitidos: draft, sent, accepted, rejected, expired';

SELECT '=== FIM DO DIAGNÓSTICO ===' as titulo;