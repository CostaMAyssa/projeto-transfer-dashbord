-- Script para verificar orçamentos da Mayssa no banco de dados
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar total de orçamentos
SELECT COUNT(*) as total_quotes FROM quotes;

-- 2. Verificar orçamentos com customer_name contendo 'mayssa' (case insensitive)
SELECT 
    id,
    customer_name,
    status,
    booking_reference,
    pickup_address,
    destination_address,
    total_amount,
    created_at
FROM quotes 
WHERE customer_name ILIKE '%mayssa%'
ORDER BY created_at DESC;

-- 3. Verificar todos os status existentes na tabela
SELECT 
    status,
    COUNT(*) as count
FROM quotes 
GROUP BY status
ORDER BY count DESC;

-- 4. Verificar orçamentos por customer_name (primeiros 10)
SELECT 
    customer_name,
    COUNT(*) as count
FROM quotes 
WHERE customer_name IS NOT NULL
GROUP BY customer_name
ORDER BY count DESC
LIMIT 10;

-- 5. Verificar se há problemas de encoding ou caracteres especiais
SELECT 
    id,
    customer_name,
    LENGTH(customer_name) as name_length,
    ASCII(SUBSTRING(customer_name, 1, 1)) as first_char_ascii
FROM quotes 
WHERE customer_name ILIKE '%may%'
ORDER BY created_at DESC;