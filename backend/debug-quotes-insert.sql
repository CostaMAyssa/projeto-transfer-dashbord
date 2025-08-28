-- Script de diagnóstico para identificar o problema específico com inserção na tabela quotes
-- Execute este script no SQL Editor do Supabase para diagnosticar o erro 400

-- 1. Verificar se a tabela quotes existe e está acessível
SELECT 'Verificando tabela quotes...' AS status;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'quotes' AND table_schema = 'public';

-- 2. Verificar se RLS está habilitado
SELECT 'Verificando RLS...' AS status;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'quotes';

-- 3. Listar TODAS as políticas atuais da tabela quotes
SELECT 'Políticas atuais da tabela quotes:' AS status;
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

-- 4. Verificar se existe usuário autenticado (simular contexto)
SELECT 'Verificando contexto de autenticação...' AS status;
SELECT 
    current_user as current_db_user,
    session_user as session_db_user;

-- 5. Verificar se a tabela admin_profiles existe e tem dados
SELECT 'Verificando tabela admin_profiles...' AS status;
SELECT COUNT(*) as total_admins FROM admin_profiles;

-- 6. Teste de inserção básica (vai falhar, mas mostrará o erro específico)
SELECT 'Tentando inserção de teste...' AS status;

-- Primeiro, vamos tentar uma inserção mínima para ver o erro específico
BEGIN;

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
    total_amount
) VALUES (
    'TEST-' || extract(epoch from now())::text,
    'Teste Cliente',
    'teste@email.com',
    '+1234567890',
    'one-way',
    'Endereço de Origem Teste',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Endereço de Destino Teste',
    'economy', -- ou outro ID válido
    2,
    100.00,
    100.00
);

-- Se chegou até aqui, a inserção funcionou
SELECT 'Inserção de teste FUNCIONOU!' AS resultado;

ROLLBACK; -- Desfaz a inserção de teste

-- 7. Verificar permissões específicas para a operação INSERT
SELECT 'Verificando permissões de INSERT...' AS status;
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'quotes' 
AND privilege_type = 'INSERT';

-- 8. Verificar se há triggers que podem estar causando problemas
SELECT 'Verificando triggers...' AS status;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'quotes';

-- 9. Verificar constraints que podem estar falhando
SELECT 'Verificando constraints...' AS status;
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'quotes';

SELECT 'Diagnóstico completo!' AS status;
SELECT 'Se a inserção de teste falhou, o erro específico aparecerá acima.' AS info;
SELECT 'Execute este script e compartilhe todos os resultados.' AS instrucao;