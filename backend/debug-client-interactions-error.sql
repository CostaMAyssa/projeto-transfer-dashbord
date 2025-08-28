-- Script para diagnosticar erro de client_interactions durante criação de quotes
-- ERRO: 23502 - null value in column "client_id" of relation "client_interactions" violates not-null constraint

SELECT '🔍 DIAGNÓSTICO: ERRO CLIENT_INTERACTIONS' as status;

-- ===== PARTE 1: VERIFICAR TRIGGERS E FUNÇÕES =====
SELECT '📋 VERIFICANDO TRIGGERS NA TABELA QUOTES' as secao;

-- Listar todos os triggers na tabela quotes
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'quotes'
ORDER BY trigger_name;

-- ===== PARTE 2: VERIFICAR FUNÇÕES QUE MENCIONAM CLIENT_INTERACTIONS =====
SELECT '📋 VERIFICANDO FUNÇÕES QUE MENCIONAM CLIENT_INTERACTIONS' as secao;

-- Buscar funções que possam estar inserindo em client_interactions
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%client_interactions%'
   OR routine_definition ILIKE '%client_interaction%'
ORDER BY routine_name;

-- ===== PARTE 3: VERIFICAR TRIGGERS EM CLIENT_INTERACTIONS =====
SELECT '📋 VERIFICANDO TRIGGERS NA TABELA CLIENT_INTERACTIONS' as secao;

-- Listar triggers na tabela client_interactions
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'client_interactions'
ORDER BY trigger_name;

-- ===== PARTE 4: VERIFICAR ESTRUTURA DAS TABELAS =====
SELECT '📋 VERIFICANDO ESTRUTURA CLIENT_INTERACTIONS' as secao;

-- Verificar estrutura da tabela client_interactions
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'client_interactions'
ORDER BY ordinal_position;

-- ===== PARTE 5: VERIFICAR ÚLTIMAS TENTATIVAS DE INSERÇÃO =====
SELECT '📋 VERIFICANDO ÚLTIMAS TENTATIVAS' as secao;

-- Verificar últimos registros em client_interactions
SELECT 'Últimos 5 registros em client_interactions:' as info;
SELECT 
    id,
    client_id,
    interaction_type,
    reference_id,
    status,
    description,
    created_at
FROM client_interactions 
ORDER BY created_at DESC 
LIMIT 5;

-- ===== PARTE 6: VERIFICAR RELAÇÃO COM QUOTES =====
SELECT '📋 VERIFICANDO RELAÇÃO COM QUOTES' as secao;

-- Verificar se há alguma foreign key ou constraint que force a criação
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND (tc.table_name = 'client_interactions' OR ccu.table_name = 'client_interactions');

-- ===== PARTE 7: TESTE DE INSERÇÃO SIMPLES =====
SELECT '📋 PREPARANDO TESTE DE INSERÇÃO' as secao;

-- Verificar se existe algum cliente para teste
SELECT 'Clientes disponíveis para teste:' as info;
SELECT id, full_name, email 
FROM clients 
LIMIT 3;

-- ===== INSTRUÇÕES =====
SELECT '💡 PRÓXIMOS PASSOS' as secao;
SELECT 'Execute este script para identificar:' as instrucao;
SELECT '1. Triggers que podem estar criando client_interactions automaticamente' as passo1;
SELECT '2. Funções que mencionam client_interactions' as passo2;
SELECT '3. Constraints que podem estar forçando a criação' as passo3;
SELECT '4. Estrutura atual das tabelas' as passo4;

SELECT '⚠️ ATENÇÃO' as alerta;
SELECT 'Se encontrar triggers ou funções suspeitas, elas podem estar' as explicacao;
SELECT 'tentando criar registros de interação automaticamente' as explicacao2;
SELECT 'sem ter um client_id válido disponível.' as explicacao3;