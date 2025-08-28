-- SOLUÇÃO SIMPLES PARA ERRO DE CLIENT_INTERACTIONS
-- Remove apenas a restrição NOT NULL da coluna client_id

SELECT '=== 🔧 CORREÇÃO SIMPLES DA TABELA CLIENT_INTERACTIONS ===' as titulo;

-- Problema: client_id é obrigatório mas orçamentos podem ser criados sem cliente cadastrado
-- Solução: Tornar client_id opcional

ALTER TABLE public.client_interactions 
ALTER COLUMN client_id DROP NOT NULL;

SELECT '✅ Constraint NOT NULL removida da coluna client_id' as resultado;
SELECT 'Agora é possível criar registros em client_interactions sem client_id' as beneficio;

-- Verificar a mudança
SELECT 
    column_name as coluna,
    is_nullable as permite_null
FROM information_schema.columns 
WHERE table_name = 'client_interactions' 
    AND table_schema = 'public'
    AND column_name = 'client_id';

SELECT '=== FIM DA CORREÇÃO ===' as titulo;