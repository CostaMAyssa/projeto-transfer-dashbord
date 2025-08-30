-- Script de Verificação Pós-Migração: Van → Minivan
-- Execute este script APÓS executar o migrate-van-to-minivan.sql
-- 
-- OBJETIVO: Verificar se a migração foi bem-sucedida e o sistema está funcionando

SELECT '🔍 VERIFICAÇÃO PÓS-MIGRAÇÃO: VAN → MINIVAN' as titulo;
SELECT '=================================================' as separador;

-- =====================================================
-- 1. VERIFICAÇÃO DE DADOS MIGRADOS
-- =====================================================

SELECT '1️⃣ VERIFICANDO DADOS MIGRADOS' as secao;

-- Verificar se ainda existem referências a 'Van' (que não sejam 'Minivan')
SELECT '--- Verificando tabela vehicles ---' as subsecao;
SELECT 
  COUNT(*) as total_vehicles,
  COUNT(CASE WHEN type ILIKE '%minivan%' THEN 1 END) as minivans,
  COUNT(CASE WHEN type ILIKE '%van%' AND type NOT ILIKE '%minivan%' THEN 1 END) as vans_restantes
FROM vehicles;

-- Mostrar todos os tipos de veículos atuais
SELECT 'Tipos de veículos atuais:' as info;
SELECT DISTINCT type, COUNT(*) as quantidade
FROM vehicles 
GROUP BY type 
ORDER BY type;

-- Verificar vehicle_categories (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicle_categories') THEN
    RAISE NOTICE '--- Verificando vehicle_categories ---';
    PERFORM id, name FROM vehicle_categories WHERE name ILIKE '%van%';
  ELSE
    RAISE NOTICE 'Tabela vehicle_categories não existe';
  END IF;
END $$;

-- =====================================================
-- 2. VERIFICAÇÃO DE INTEGRIDADE REFERENCIAL
-- =====================================================

SELECT '2️⃣ VERIFICANDO INTEGRIDADE REFERENCIAL' as secao;

-- Verificar quotes
SELECT '--- Verificando quotes ---' as subsecao;
SELECT 
  COUNT(*) as total_quotes,
  COUNT(CASE WHEN vehicle_category_id = 'minivan' THEN 1 END) as quotes_minivan,
  COUNT(CASE WHEN vehicle_category_id = 'van' THEN 1 END) as quotes_van_restantes
FROM quotes;

-- Verificar se há quotes órfãs (vehicle_category_id que não existe)
SELECT 'Quotes com vehicle_category_id inválido:' as info;
SELECT COUNT(*) as quotes_orfas
FROM quotes q
LEFT JOIN vehicle_categories vc ON q.vehicle_category_id = vc.id
WHERE vc.id IS NULL AND q.vehicle_category_id IS NOT NULL;

-- Verificar bookings
SELECT '--- Verificando bookings ---' as subsecao;
SELECT 
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN vehicle_json::text ILIKE '%minivan%' THEN 1 END) as bookings_minivan,
  COUNT(CASE WHEN vehicle_json::text ILIKE '%van%' AND vehicle_json::text NOT ILIKE '%minivan%' THEN 1 END) as bookings_van_restantes
FROM bookings;

-- =====================================================
-- 3. TESTE DE FUNCIONALIDADE
-- =====================================================

SELECT '3️⃣ TESTANDO FUNCIONALIDADES' as secao;

-- Testar se é possível criar um quote com minivan
SELECT '--- Testando criação de quote com minivan ---' as subsecao;

-- Simular inserção de quote (sem realmente inserir)
SELECT 
  'minivan' as vehicle_category_test,
  CASE 
    WHEN EXISTS (SELECT 1 FROM vehicle_categories WHERE id = 'minivan')
    THEN '✅ vehicle_category "minivan" existe'
    ELSE '❌ vehicle_category "minivan" NÃO existe'
  END as categoria_status;

-- Verificar se há veículos minivan disponíveis
SELECT 
  COUNT(*) as minivans_disponiveis,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Há veículos minivan disponíveis'
    ELSE '❌ Não há veículos minivan disponíveis'
  END as disponibilidade_status
FROM vehicles 
WHERE type ILIKE '%minivan%' AND status = 'active';

-- =====================================================
-- 4. VERIFICAÇÃO DE PREÇOS
-- =====================================================

SELECT '4️⃣ VERIFICANDO PREÇOS' as secao;

-- Verificar se há preços configurados para minivan
SELECT '--- Verificando zone_pricing ---' as subsecao;
SELECT 
  COUNT(*) as precos_minivan,
  COUNT(DISTINCT origin_zone_id) as zonas_origem,
  COUNT(DISTINCT destination_zone_id) as zonas_destino
FROM zone_pricing 
WHERE vehicle_category_id = 'minivan';

-- Mostrar alguns exemplos de preços
SELECT 'Exemplos de preços para minivan:' as info;
SELECT 
  origin_zone_id,
  destination_zone_id,
  price,
  is_active
FROM zone_pricing 
WHERE vehicle_category_id = 'minivan'
LIMIT 5;

-- =====================================================
-- 5. VERIFICAÇÃO DE BACKUP
-- =====================================================

SELECT '5️⃣ VERIFICANDO BACKUP' as secao;

-- Verificar se o backup foi criado
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles_backup_van_migration')
    THEN '✅ Backup existe'
    ELSE '❌ Backup NÃO existe'
  END as backup_status;

-- Mostrar informações do backup
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles_backup_van_migration') THEN
    RAISE NOTICE 'Registros no backup: %', (SELECT COUNT(*) FROM vehicles_backup_van_migration);
    RAISE NOTICE 'Data do backup: %', (SELECT MIN(backup_timestamp) FROM vehicles_backup_van_migration);
  END IF;
END $$;

-- =====================================================
-- 6. RELATÓRIO FINAL
-- =====================================================

SELECT '📊 RELATÓRIO FINAL' as secao;
SELECT '==================' as separador;

-- Resumo da migração
WITH migration_summary AS (
  SELECT 
    (SELECT COUNT(*) FROM vehicles WHERE type ILIKE '%minivan%') as total_minivans,
    (SELECT COUNT(*) FROM vehicles WHERE type ILIKE '%van%' AND type NOT ILIKE '%minivan%') as vans_restantes,
    (SELECT COUNT(*) FROM quotes WHERE vehicle_category_id = 'minivan') as quotes_minivan,
    (SELECT COUNT(*) FROM quotes WHERE vehicle_category_id = 'van') as quotes_van_restantes,
    (SELECT COUNT(*) FROM zone_pricing WHERE vehicle_category_id = 'minivan') as precos_minivan
)
SELECT 
  '✅ Veículos Minivan: ' || total_minivans as resultado_1,
  CASE 
    WHEN vans_restantes = 0 THEN '✅ Nenhum "Van" restante'
    ELSE '⚠️ Ainda há ' || vans_restantes || ' "Van" restantes'
  END as resultado_2,
  '✅ Quotes Minivan: ' || quotes_minivan as resultado_3,
  CASE 
    WHEN quotes_van_restantes = 0 THEN '✅ Nenhum quote "van" restante'
    ELSE '⚠️ Ainda há ' || quotes_van_restantes || ' quotes "van" restantes'
  END as resultado_4,
  '✅ Preços Minivan: ' || precos_minivan as resultado_5
FROM migration_summary;

-- Status geral
WITH status_check AS (
  SELECT 
    CASE 
      WHEN (
        (SELECT COUNT(*) FROM vehicles WHERE type ILIKE '%van%' AND type NOT ILIKE '%minivan%') = 0
        AND (SELECT COUNT(*) FROM quotes WHERE vehicle_category_id = 'van') = 0
        AND (SELECT COUNT(*) FROM vehicles WHERE type ILIKE '%minivan%') > 0
      ) THEN 'SUCESSO'
      ELSE 'ATENÇÃO NECESSÁRIA'
    END as status_geral
)
SELECT 
  CASE 
    WHEN status_geral = 'SUCESSO' 
    THEN '🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!'
    ELSE '⚠️ MIGRAÇÃO PRECISA DE ATENÇÃO - Verifique os itens acima'
  END as conclusao
FROM status_check;

SELECT '=================================================' as fim;
SELECT 'Execute este script sempre que quiser verificar o status da migração' as instrucao;

-- =====================================================
-- COMANDOS ÚTEIS PARA TROUBLESHOOTING
-- =====================================================

/*
🔧 COMANDOS ÚTEIS PARA TROUBLESHOOTING:

-- Ver todos os tipos de veículos:
SELECT DISTINCT type FROM vehicles ORDER BY type;

-- Ver todas as categorias de veículos:
SELECT * FROM vehicle_categories ORDER BY name;

-- Ver quotes com problemas:
SELECT id, vehicle_category_id, created_at 
FROM quotes 
WHERE vehicle_category_id NOT IN (SELECT id FROM vehicle_categories);

-- Restaurar do backup (se necessário):
UPDATE vehicles 
SET type = backup.type, name = backup.name, updated_at = backup.updated_at
FROM vehicles_backup_van_migration backup
WHERE vehicles.id = backup.id;

-- Limpar backup após confirmação:
DROP TABLE vehicles_backup_van_migration;
*/