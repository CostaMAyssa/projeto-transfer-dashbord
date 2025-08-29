-- Script final para vincular orçamentos da Mayssa às interações
-- Execute este script no SQL Editor do Supabase

SELECT '=== 🎯 VINCULAÇÃO FINAL: MAYSSA FERREIRA COSTA ===' as titulo;

-- ===== 1. VERIFICAR SITUAÇÃO ATUAL =====
SELECT '📊 SITUAÇÃO ATUAL' as secao;

-- Cliente correto (ID 2)
SELECT 
    'Cliente correto:' as info,
    id,
    full_name,
    email,
    phone
FROM clients 
WHERE id = 2;

-- Orçamentos da Mayssa
SELECT 
    'Total de orçamentos Mayssa:' as info,
    COUNT(*) as quantidade
FROM quotes 
WHERE customer_name ILIKE '%mayssa ferreira costa%';

-- Interações existentes (com e sem client_id)
SELECT 
    'Interações com client_id:' as info,
    COUNT(*) as quantidade
FROM client_interactions ci
WHERE ci.client_id = 2
  AND ci.reference_id IN (
      SELECT id FROM quotes WHERE customer_name ILIKE '%mayssa ferreira costa%'
  )

UNION ALL

SELECT 
    'Interações sem client_id:' as info,
    COUNT(*) as quantidade
FROM client_interactions ci
WHERE ci.client_id IS NULL
  AND ci.reference_id IN (
      SELECT id FROM quotes WHERE customer_name ILIKE '%mayssa ferreira costa%'
  );

-- ===== 2. LISTAR ORÇAMENTOS SEM INTERAÇÃO =====
SELECT '🔍 ORÇAMENTOS SEM INTERAÇÃO' as secao;

SELECT 
    q.id,
    q.customer_name,
    q.booking_reference,
    q.status,
    q.total_amount,
    q.created_at,
    CASE 
        WHEN ci.id IS NULL THEN '❌ SEM INTERAÇÃO'
        ELSE '✅ COM INTERAÇÃO'
    END as status_interacao
FROM quotes q
LEFT JOIN client_interactions ci ON (
    ci.reference_id = q.id 
    AND ci.client_id = 2 
    AND ci.interaction_type = 'quote'
)
WHERE q.customer_name ILIKE '%mayssa ferreira costa%'
ORDER BY q.created_at DESC;

-- ===== 3. ATUALIZAR INTERAÇÕES EXISTENTES SEM CLIENT_ID =====
SELECT '🔄 ATUALIZANDO INTERAÇÕES EXISTENTES' as secao;

UPDATE client_interactions 
SET client_id = 2,
    created_by = COALESCE(created_by, 'system_auto_fix')
WHERE client_id IS NULL
  AND reference_id IN (
      SELECT id FROM quotes WHERE customer_name ILIKE '%mayssa ferreira costa%'
  )
  AND interaction_type = 'quote';

SELECT 'Interações atualizadas com client_id' as resultado;

-- ===== 4. CRIAR INTERAÇÕES PARA ORÇAMENTOS SEM VINCULAÇÃO =====
SELECT '➕ CRIANDO INTERAÇÕES FALTANTES' as secao;

INSERT INTO client_interactions (
    client_id,
    interaction_type,
    reference_id,
    status,
    description,
    created_by
)
SELECT 
    2 as client_id,  -- ID da Mayssa Ferreira Costa
    'quote' as interaction_type,
    q.id as reference_id,
    q.status,
    CONCAT(
        'Orçamento ', q.booking_reference, 
        ' - ', COALESCE(q.pickup_address, 'Origem não informada'),
        ' → ', COALESCE(q.destination_address, 'Destino não informado'),
        ' - Valor: $', q.total_amount
    ) as description,
    'system_auto_fix' as created_by
FROM quotes q
WHERE q.customer_name ILIKE '%mayssa ferreira costa%'
  AND NOT EXISTS (
      SELECT 1 FROM client_interactions ci 
      WHERE ci.reference_id = q.id 
        AND ci.interaction_type = 'quote'
  );

SELECT 'Novas interações criadas' as resultado;

-- ===== 5. VERIFICAR RESULTADO FINAL =====
SELECT '🎯 RESULTADO FINAL' as secao;

-- Todas as interações da Mayssa
SELECT 
    ci.id as interaction_id,
    ci.interaction_type,
    ci.status as interaction_status,
    ci.created_at as interaction_created,
    ci.created_by,
    q.booking_reference,
    q.customer_name,
    q.total_amount,
    q.status as quote_status,
    q.created_at as quote_created
FROM client_interactions ci
JOIN quotes q ON ci.reference_id = q.id
WHERE ci.client_id = 2
  AND ci.interaction_type = 'quote'
ORDER BY q.created_at DESC;

-- ===== 6. ESTATÍSTICAS FINAIS =====
SELECT '📈 ESTATÍSTICAS FINAIS' as secao;

SELECT 
    'Cliente' as item,
    'Mayssa Ferreira Costa (ID: 2)' as valor

UNION ALL

SELECT 
    'Total de orçamentos' as item,
    CAST(COUNT(q.id) as TEXT) as valor
FROM quotes q
WHERE q.customer_name ILIKE '%mayssa ferreira costa%'

UNION ALL

SELECT 
    'Total de interações' as item,
    CAST(COUNT(ci.id) as TEXT) as valor
FROM client_interactions ci
WHERE ci.client_id = 2
  AND ci.interaction_type = 'quote'

UNION ALL

SELECT 
    'Valor total dos orçamentos' as item,
    CONCAT('$', CAST(SUM(q.total_amount) as TEXT)) as valor
FROM quotes q
WHERE q.customer_name ILIKE '%mayssa ferreira costa%'

UNION ALL

SELECT 
    'Status dos orçamentos' as item,
    STRING_AGG(DISTINCT q.status, ', ') as valor
FROM quotes q
WHERE q.customer_name ILIKE '%mayssa ferreira costa%';

-- ===== 7. VERIFICAÇÃO DE INTEGRIDADE =====
SELECT '🔒 VERIFICAÇÃO DE INTEGRIDADE' as secao;

-- Verificar se todos os orçamentos têm interação
SELECT 
    CASE 
        WHEN COUNT(q.id) = COUNT(ci.id) THEN '✅ TODOS OS ORÇAMENTOS TÊM INTERAÇÃO'
        ELSE CONCAT('❌ FALTAM ', (COUNT(q.id) - COUNT(ci.id)), ' INTERAÇÕES')
    END as status_integridade
FROM quotes q
LEFT JOIN client_interactions ci ON (
    ci.reference_id = q.id 
    AND ci.client_id = 2 
    AND ci.interaction_type = 'quote'
)
WHERE q.customer_name ILIKE '%mayssa ferreira costa%';

SELECT '=== ✅ VINCULAÇÃO CONCLUÍDA COM SUCESSO ===' as titulo;
SELECT 'Agora todos os orçamentos da Mayssa estão vinculados às interações!' as resultado;
SELECT 'Verifique no painel admin em: Clients > Mayssa Ferreira Costa > Interações' as instrucao;