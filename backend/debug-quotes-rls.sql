-- Script para debugar e corrigir políticas RLS da tabela quotes
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar políticas atuais
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY policyname;

-- 2. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'quotes';

-- 3. Contar total de registros na tabela (sem RLS)
SELECT COUNT(*) as total_quotes FROM quotes;

-- 4. Verificar registros com customer_name contendo 'mayssa'
SELECT 
    id,
    customer_name,
    status,
    booking_reference,
    created_at
FROM quotes 
WHERE customer_name ILIKE '%mayssa%'
ORDER BY created_at DESC;

-- 5. Verificar todos os status existentes
SELECT 
    status,
    COUNT(*) as count
FROM quotes 
GROUP BY status
ORDER BY count DESC;

-- 6. Temporariamente desabilitar RLS para teste (CUIDADO: apenas para debug)
-- DESCOMENTE APENAS SE NECESSÁRIO PARA TESTE:
-- ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- 7. Para reabilitar RLS após o teste:
-- ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;