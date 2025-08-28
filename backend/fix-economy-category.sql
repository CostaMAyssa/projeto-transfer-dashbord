-- Script para corrigir o problema da categoria 'economy'
-- Execute no SQL Editor do Supabase

-- DIAGNÓSTICO: Verificar o problema
SELECT '=== DIAGNÓSTICO DO PROBLEMA ===' as info;

-- 1. Categorias existentes
SELECT 'Categorias válidas:' as tipo, id, name FROM vehicle_categories;

-- 2. Verificar se economy existe
SELECT 'Categoria economy existe?' as pergunta, 
       CASE WHEN EXISTS(SELECT 1 FROM vehicle_categories WHERE id = 'economy') 
            THEN 'SIM' ELSE 'NÃO - ESTE É O PROBLEMA!' END as resposta;

-- SOLUÇÃO 1: Criar a categoria 'economy' (se necessário)
SELECT '=== SOLUÇÃO 1: CRIAR CATEGORIA ECONOMY ===' as info;

-- Descomente as linhas abaixo se quiser criar a categoria 'economy'
/*
INSERT INTO vehicle_categories (id, name, description, base_price, capacity, is_active)
VALUES (
    'economy',
    'Economy Class',
    'Veículo econômico para transporte básico',
    80.00,  -- Preço base menor que sedan
    4,
    true
);
SELECT 'Categoria economy criada com sucesso!' as resultado;
*/

-- SOLUÇÃO 2: Usar categoria válida existente
SELECT '=== SOLUÇÃO 2: USAR CATEGORIA VÁLIDA ===' as info;
SELECT 'Use uma destas categorias válidas:' as instrucao, id, name, base_price 
FROM vehicle_categories WHERE is_active = true;

-- TESTE: Simular inserção com categoria válida
SELECT '=== TESTE COM CATEGORIA VÁLIDA ===' as info;
SELECT 'Exemplo de inserção correta:' as exemplo;

-- Este INSERT funcionaria (não execute, é só exemplo)
/*
INSERT INTO quotes (
    pickup_address, destination_address, pickup_date, pickup_time,
    quote_type, vehicle_category_id, base_price, total_amount, status,
    customer_name, customer_email, customer_phone, booking_reference
) VALUES (
    'Miami Airport', 'South Beach Hotel', '2024-02-15', '14:30',
    'one-way', 'sedan', 150.00, 150.00, 'pending',
    'Fix Test', 'fix@test.com', '555-1111', 'FIX' || EXTRACT(EPOCH FROM NOW())::text
);
*/

-- RECOMENDAÇÃO FINAL
SELECT '=== RECOMENDAÇÃO ===' as info;
SELECT 'Para preços personalizados, use:' as recomendacao,
       '1. Categoria válida (sedan/suv/van)' as opcao1,
       '2. Ajuste o campo base_price conforme necessário' as opcao2,
       '3. Documente no campo notes o motivo do preço especial' as opcao3;

-- ERRO ATUAL:
-- Error: insert or update on table "quotes" violates foreign key constraint
-- CAUSA: vehicle_category_id='economy' não existe na tabela vehicle_categories
-- SOLUÇÃO: Use 'sedan', 'suv' ou 'van' + ajuste base_price para preço personalizado