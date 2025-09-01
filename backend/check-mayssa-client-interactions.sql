-- Script para verificar cliente Mayssa e suas interações
-- Execute este script no SQL Editor do Supabase

SELECT '=== 🔍 INVESTIGAÇÃO COMPLETA: MAYSSA FERREIRA COSTA ===' as titulo;

-- ===== 1. VERIFICAR SE EXISTE CLIENTE MAYSSA =====
SELECT '👤 VERIFICANDO CLIENTE NA TABELA CLIENTS' as secao;

SELECT 
    id,
    full_name,
    email,
    phone,
    created_at
FROM clients 
WHERE full_name ILIKE '%mayssa%' 
   OR full_name ILIKE '%ferreira%' 
   OR full_name ILIKE '%costa%'
ORDER BY created_at DESC;

-- ===== 2. VERIFICAR ORÇAMENTOS DA MAYSSA =====
SELECT '💰 ORÇAMENTOS DA MAYSSA' as secao;

SELECT 
    id,
    customer_name,
    customer_email,
    customer_phone,
    status,
    booking_reference,
    total_amount,
    created_at
FROM quotes 
WHERE customer_name ILIKE '%mayssa%'
ORDER BY created_at DESC;

-- ===== 3. VERIFICAR CLIENT_INTERACTIONS EXISTENTES =====
SELECT '🔗 INTERAÇÕES DE CLIENTE EXISTENTES' as secao;

SELECT 
    ci.id,
    ci.client_id,
    ci.interaction_type,
    ci.reference_id,
    ci.status,
    ci.description,
    ci.created_at,
    c.full_name as cliente_nome
FROM client_interactions ci
LEFT JOIN clients c ON ci.client_id = c.id
WHERE ci.reference_id IN (
    SELECT id FROM quotes WHERE customer_name ILIKE '%mayssa%'
)
ORDER BY ci.created_at DESC;

-- ===== 4. VERIFICAR SE HÁ INTERAÇÕES SEM CLIENTE =====
SELECT '❓ INTERAÇÕES SEM CLIENTE VINCULADO' as secao;

SELECT 
    ci.id,
    ci.interaction_type,
    ci.reference_id,
    ci.status,
    ci.created_at,
    q.customer_name,
    q.booking_reference
FROM client_interactions ci
LEFT JOIN quotes q ON ci.reference_id = q.id
WHERE ci.client_id IS NULL
  AND q.customer_name ILIKE '%mayssa%'
ORDER BY ci.created_at DESC;

-- ===== 5. CRIAR CLIENTE MAYSSA SE NÃO EXISTIR =====
SELECT '➕ CRIANDO CLIENTE MAYSSA (SE NECESSÁRIO)' as secao;

-- Verificar se já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM clients 
        WHERE full_name ILIKE '%mayssa ferreira costa%'
    ) THEN
        INSERT INTO clients (
            full_name,
            email,
            phone,
            status
        ) VALUES (
            'Mayssa Ferreira Costa',
            'mayssa@gmail.com',
            '64992019427',
            'Ativo'
        );
        RAISE NOTICE 'Cliente Mayssa Ferreira Costa criado com sucesso!';
    ELSE
        RAISE NOTICE 'Cliente Mayssa Ferreira Costa já existe.';
    END IF;
END $$;

-- ===== 6. VERIFICAR CLIENTE APÓS CRIAÇÃO =====
SELECT '✅ CLIENTE MAYSSA APÓS VERIFICAÇÃO' as secao;

SELECT 
    id,
    full_name,
    email,
    phone,
    status,
    created_at
FROM clients 
WHERE full_name ILIKE '%mayssa%'
ORDER BY created_at DESC;

-- ===== 7. CRIAR INTERAÇÕES PARA ORÇAMENTOS EXISTENTES =====
SELECT '🔗 CRIANDO INTERAÇÕES PARA ORÇAMENTOS EXISTENTES' as secao;

-- Inserir interações para todos os orçamentos da Mayssa que não têm interação
INSERT INTO client_interactions (
    client_id,
    interaction_type,
    reference_id,
    status,
    description,
    created_by
)
SELECT 
    c.id as client_id,
    'quote' as interaction_type,
    q.id as reference_id,
    q.status,
    CONCAT('Orçamento ', q.booking_reference, ' - ', q.pickup_address, ' → ', q.destination_address) as description,
    'system_auto' as created_by
FROM quotes q
CROSS JOIN clients c
WHERE q.customer_name ILIKE '%mayssa%'
  AND c.full_name ILIKE '%mayssa%'
  AND NOT EXISTS (
      SELECT 1 FROM client_interactions ci 
      WHERE ci.reference_id = q.id 
        AND ci.interaction_type = 'quote'
  );

-- ===== 8. VERIFICAR RESULTADO FINAL =====
SELECT '🎯 RESULTADO FINAL - INTERAÇÕES DA MAYSSA' as secao;

SELECT 
    ci.id as interaction_id,
    ci.interaction_type,
    ci.status,
    ci.description,
    ci.created_at as interaction_created,
    c.full_name as cliente_nome,
    q.booking_reference,
    q.total_amount,
    q.created_at as quote_created
FROM client_interactions ci
JOIN clients c ON ci.client_id = c.id
JOIN quotes q ON ci.reference_id = q.id
WHERE c.full_name ILIKE '%mayssa%'
ORDER BY ci.created_at DESC;

-- ===== 9. ESTATÍSTICAS FINAIS =====
SELECT '📊 ESTATÍSTICAS FINAIS' as secao;

SELECT 
    'Total de clientes Mayssa' as metrica,
    COUNT(*) as valor
FROM clients 
WHERE full_name ILIKE '%mayssa%'

UNION ALL

SELECT 
    'Total de orçamentos Mayssa' as metrica,
    COUNT(*) as valor
FROM quotes 
WHERE customer_name ILIKE '%mayssa%'

UNION ALL

SELECT 
    'Total de interações Mayssa' as metrica,
    COUNT(*) as valor
FROM client_interactions ci
JOIN clients c ON ci.client_id = c.id
WHERE c.full_name ILIKE '%mayssa%';

SELECT '=== ✅ INVESTIGAÇÃO CONCLUÍDA ===' as titulo;
SELECT 'Execute este script para resolver o problema de vinculação!' as instrucao;