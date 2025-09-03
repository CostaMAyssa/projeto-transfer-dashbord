-- Script para verificar e corrigir registros na tabela integrations_google
-- Este script deve ser executado no banco de dados Supabase

-- 1. Verificar registros existentes na tabela integrations_google
SELECT 
    id,
    user_id,
    access_token IS NOT NULL as has_access_token,
    refresh_token IS NOT NULL as has_refresh_token,
    expiry_date,
    created_at,
    updated_at
FROM integrations_google
ORDER BY created_at DESC;

-- 2. Verificar usuários que fizeram login recentemente
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
ORDER BY last_sign_in_at DESC NULLS LAST
LIMIT 10;

-- 3. Verificar se há registros com user_id NULL
SELECT COUNT(*) as registros_sem_user_id
FROM integrations_google
WHERE user_id IS NULL;

-- 4. EXEMPLO de correção (AJUSTAR OS IDs CONFORME NECESSÁRIO)
-- Substitua os valores pelos IDs corretos do seu ambiente

-- Exemplo: Associar registro de integração ao usuário correto
-- UPDATE integrations_google 
-- SET user_id = '28e2c451-b7f0-42e1-9b73-5315c5f06c80'
-- WHERE id = '28e2c451-b7f0-42e1-9b73-5315c5f06c80';

-- 5. Verificar se a correção funcionou
-- SELECT 
--     ig.id,
--     ig.user_id,
--     u.email,
--     ig.access_token IS NOT NULL as has_access_token
-- FROM integrations_google ig
-- LEFT JOIN auth.users u ON ig.user_id = u.id
-- WHERE ig.user_id IS NOT NULL;

-- 6. Script para encontrar o user_id correto baseado no email
-- (útil se você souber o email do usuário que fez a integração)
-- SELECT id, email FROM auth.users WHERE email = 'seu-email@exemplo.com';