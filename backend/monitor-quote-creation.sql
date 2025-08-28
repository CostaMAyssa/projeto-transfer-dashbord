-- MONITOR DE CRIAÇÃO DE ORÇAMENTOS EM TEMPO REAL
-- Execute este script ANTES de tentar salvar pelo frontend

-- ===== CONFIGURAÇÃO DE MONITORAMENTO =====
SELECT '🔍 INICIANDO MONITORAMENTO' as status, NOW() as timestamp;

-- Habilitar logs detalhados (se necessário)
-- SET log_statement = 'all';
-- SET log_min_duration_statement = 0;

-- ===== ESTADO INICIAL DO SISTEMA =====
SELECT '📊 ESTADO INICIAL' as secao;

-- Contar orçamentos existentes
SELECT 'Orçamentos existentes antes do teste:' as info, COUNT(*) as total FROM quotes;

-- Último ID de orçamento
SELECT 'Último ID de orçamento:' as info, COALESCE(MAX(id), 0) as ultimo_id FROM quotes;

-- Verificar conexões ativas
SELECT 'Conexões ativas:' as info, COUNT(*) as total 
FROM pg_stat_activity 
WHERE state = 'active';

-- ===== VERIFICAÇÃO DE CATEGORIAS =====
SELECT '🚗 CATEGORIAS DISPONÍVEIS' as secao;
SELECT id, name, base_price, is_active 
FROM vehicle_categories 
WHERE is_active = true
ORDER BY id;

-- ===== VERIFICAÇÃO DE POLÍTICAS RLS =====
SELECT '🔒 POLÍTICAS RLS ATIVAS' as secao;
SELECT 
    policyname as politica,
    cmd as comando,
    permissive as permissiva,
    roles as funcoes,
    qual as condicao
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY policyname;

-- ===== TESTE DE INSERÇÃO RÁPIDA =====
SELECT '⚡ TESTE RÁPIDO DE INSERÇÃO' as secao;

-- Teste básico para verificar se a inserção funciona
BEGIN;
INSERT INTO quotes (
    pickup_address,
    destination_address,
    pickup_date,
    pickup_time,
    quote_type,
    vehicle_category_id,
    base_price,
    total_amount,
    status,
    customer_name,
    customer_email,
    customer_phone,
    booking_reference
) VALUES (
    'Test Location',
    'Test Destination',
    CURRENT_DATE + INTERVAL '1 day',
    '12:00:00',
    'one-way',
    'sedan',
    100.00,
    100.00,
    'pending',
    'Monitor Test',
    'monitor@test.com',
    '555-0000',
    'MONITOR' || EXTRACT(EPOCH FROM NOW())::text
) RETURNING id, created_at;

SELECT 'TESTE BÁSICO: SUCESSO - Sistema aceita inserções' as resultado;
ROLLBACK;

-- ===== MONITORAMENTO DE ERROS =====
SELECT '🚨 PREPARANDO MONITORAMENTO DE ERROS' as secao;

-- Criar função temporária para capturar erros
CREATE OR REPLACE FUNCTION log_quote_error()
RETURNS trigger AS $$
BEGIN
    -- Log de tentativa de inserção
    RAISE NOTICE 'TENTATIVA DE INSERÇÃO: client_name=%, vehicle_category_id=%, base_price=%', 
                 NEW.client_name, NEW.vehicle_category_id, NEW.base_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger temporário (se não existir)
DROP TRIGGER IF EXISTS quote_insert_log ON quotes;
CREATE TRIGGER quote_insert_log
    BEFORE INSERT ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION log_quote_error();

SELECT 'Trigger de monitoramento criado' as status;

-- ===== INSTRUÇÕES PARA O USUÁRIO =====
SELECT '📋 INSTRUÇÕES' as secao;
SELECT 'AGORA EXECUTE OS SEGUINTES PASSOS:' as instrucao;
SELECT '1. Mantenha esta aba do SQL Editor aberta' as passo1;
SELECT '2. Vá para o frontend (localhost:3000/admin/quotes/new)' as passo2;
SELECT '3. Preencha o formulário com os dados que você quer' as passo3;
SELECT '4. Clique em "Salvar Rascunho"' as passo4;
SELECT '5. Volte aqui e execute o script de verificação abaixo' as passo5;

-- ===== SCRIPT DE VERIFICAÇÃO PÓS-TENTATIVA =====
SELECT '🔍 EXECUTE ESTE BLOCO APÓS TENTAR SALVAR NO FRONTEND:' as verificacao;

/*
-- COPIE E EXECUTE ESTE BLOCO APÓS TENTAR SALVAR:

SELECT '=== VERIFICAÇÃO PÓS-TENTATIVA ===' as status, NOW() as timestamp;

-- Verificar se novos orçamentos foram criados
SELECT 'Novos orçamentos criados:' as info, COUNT(*) as total 
FROM quotes 
WHERE created_at > NOW() - INTERVAL '5 minutes';

-- Mostrar últimos orçamentos
SELECT 'Últimos orçamentos (últimos 5 min):' as info;
SELECT id, client_name, vehicle_category_id, base_price, total_cost, created_at
FROM quotes 
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;

-- Verificar logs de erro no PostgreSQL
SELECT 'Verificar logs do servidor para erros recentes' as instrucao;

-- Limpar trigger temporário
DROP TRIGGER IF EXISTS quote_insert_log ON quotes;
DROP FUNCTION IF EXISTS log_quote_error();
SELECT 'Trigger de monitoramento removido' as limpeza;

*/

-- ===== POSSÍVEIS PROBLEMAS E SOLUÇÕES =====
SELECT '💡 POSSÍVEIS PROBLEMAS' as secao;
SELECT 'Se não aparecer nenhum orçamento novo:' as problema;
SELECT '1. Erro de validação no frontend' as causa1;
SELECT '2. Erro de rede/conexão' as causa2;
SELECT '3. Erro de autenticação/RLS' as causa3;
SELECT '4. Categoria de veículo inválida' as causa4;
SELECT '5. Campos obrigatórios não preenchidos' as causa5;

SELECT 'PRONTO PARA MONITORAMENTO!' as status_final, NOW() as inicio_monitoramento;