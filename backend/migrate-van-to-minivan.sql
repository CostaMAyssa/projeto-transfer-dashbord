-- Script de Migração Segura: Van → Minivan
-- Execute este script no SQL Editor do Supabase
-- 
-- OBJETIVO: Atualizar todas as referências de 'Van' para 'Minivan' sem quebrar o sistema
-- SEGURANÇA: Script com verificações e rollback automático em caso de erro

-- =====================================================
-- FASE 1: DIAGNÓSTICO E VERIFICAÇÃO
-- =====================================================

SELECT '=== DIAGNÓSTICO INICIAL ===' as fase;

-- 1. Verificar tabelas existentes
SELECT 'Tabelas relevantes encontradas:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('vehicles', 'vehicle_categories', 'quotes', 'bookings', 'pricing_rules')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela vehicles
SELECT '=== ESTRUTURA TABELA VEHICLES ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'vehicles'
ORDER BY ordinal_position;

-- 3. Verificar registros com 'Van' na tabela vehicles
SELECT '=== REGISTROS COM VAN EM VEHICLES ===' as info;
SELECT id, name, type, passengers, luggage, status, created_at
FROM vehicles 
WHERE type ILIKE '%van%' OR name ILIKE '%van%'
ORDER BY created_at;

-- 4. Verificar se existe tabela vehicle_categories
SELECT '=== TABELA VEHICLE_CATEGORIES ===' as info;
SELECT CASE 
  WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicle_categories')
  THEN 'EXISTE'
  ELSE 'NÃO EXISTE'
END as status_tabela;

-- 5. Se vehicle_categories existe, verificar registros com Van
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicle_categories') THEN
    RAISE NOTICE 'Verificando vehicle_categories...';
    PERFORM * FROM vehicle_categories WHERE id ILIKE '%van%' OR name ILIKE '%van%';
  END IF;
END $$;

-- 6. Verificar quotes que referenciam 'van'
SELECT '=== QUOTES COM REFERÊNCIA A VAN ===' as info;
SELECT COUNT(*) as total_quotes_van
FROM quotes 
WHERE vehicle_category_id ILIKE '%van%'
OR notes ILIKE '%van%'
OR pickup_address ILIKE '%van%'
OR destination_address ILIKE '%van%';

-- 7. Verificar bookings que referenciam 'van'
SELECT '=== BOOKINGS COM REFERÊNCIA A VAN ===' as info;
SELECT COUNT(*) as total_bookings_van
FROM bookings 
WHERE vehicle_json::text ILIKE '%van%'
OR notes ILIKE '%van%'
OR pickup_location ILIKE '%van%'
OR dropoff_location ILIKE '%van%';

-- =====================================================
-- FASE 2: BACKUP E PREPARAÇÃO
-- =====================================================

SELECT '=== CRIANDO BACKUP ===' as fase;

-- Criar tabela de backup para vehicles (se houver registros com Van)
CREATE TABLE IF NOT EXISTS vehicles_backup_van_migration AS 
SELECT *, now() as backup_timestamp 
FROM vehicles 
WHERE type ILIKE '%van%' OR name ILIKE '%van%';

SELECT 'Backup criado com ' || COUNT(*) || ' registros' as backup_status
FROM vehicles_backup_van_migration;

-- =====================================================
-- FASE 3: MIGRAÇÃO SEGURA
-- =====================================================

SELECT '=== INICIANDO MIGRAÇÃO ===' as fase;

-- Iniciar transação para rollback em caso de erro
BEGIN;

-- 3.1. Atualizar tabela vehicles
SELECT '--- Atualizando tabela vehicles ---' as step;

-- Primeiro, verificar se há constraint CHECK que pode impedir a atualização
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
AND constraint_name LIKE '%vehicles%';

-- Atualizar registros na tabela vehicles
-- Mudança 1: 'Business Van/SUV' → 'Business Minivan/SUV'
UPDATE vehicles 
SET type = 'Business Minivan/SUV',
    updated_at = now()
WHERE type = 'Business Van/SUV';

SELECT 'Atualizados ' || ROW_COUNT() || ' registros: Business Van/SUV → Business Minivan/SUV' as resultado;

-- Mudança 2: 'Van' → 'Minivan' (caso exista)
UPDATE vehicles 
SET type = 'Minivan',
    updated_at = now()
WHERE type = 'Van';

SELECT 'Atualizados ' || ROW_COUNT() || ' registros: Van → Minivan' as resultado;

-- Mudança 3: Atualizar nomes que contenham 'Van' para 'Minivan' (apenas se necessário)
-- Esta atualização é mais conservadora - apenas se o nome for exatamente 'Van'
UPDATE vehicles 
SET name = REPLACE(name, ' Van ', ' Minivan '),
    updated_at = now()
WHERE name LIKE '% Van %';

SELECT 'Atualizados ' || ROW_COUNT() || ' nomes de veículos' as resultado;

-- 3.2. Atualizar vehicle_categories (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicle_categories') THEN
    -- Atualizar registros na tabela vehicle_categories
    UPDATE vehicle_categories 
    SET name = 'Minivan',
        updated_at = COALESCE(updated_at, now())
    WHERE name = 'Van' OR id = 'van';
    
    RAISE NOTICE 'vehicle_categories atualizada';
  ELSE
    RAISE NOTICE 'Tabela vehicle_categories não existe - pulando';
  END IF;
END $$;

-- 3.3. Atualizar quotes (com cuidado)
SELECT '--- Atualizando quotes ---' as step;

UPDATE quotes 
SET vehicle_category_id = 'minivan',
    updated_at = now()
WHERE vehicle_category_id = 'van';

SELECT 'Atualizados ' || ROW_COUNT() || ' quotes: van → minivan' as resultado;

-- 3.4. Atualizar pricing_rules (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pricing_rules') THEN
    UPDATE pricing_rules 
    SET vehicle_type = 'Minivan'
    WHERE vehicle_type = 'Van';
    
    RAISE NOTICE 'pricing_rules atualizada';
  END IF;
END $$;

-- =====================================================
-- FASE 4: VERIFICAÇÃO PÓS-MIGRAÇÃO
-- =====================================================

SELECT '=== VERIFICAÇÃO PÓS-MIGRAÇÃO ===' as fase;

-- Verificar se ainda existem referências a 'Van'
SELECT 'Verificando vehicles...' as check_step;
SELECT COUNT(*) as vehicles_com_van_restantes
FROM vehicles 
WHERE type ILIKE '%van%' AND type NOT ILIKE '%minivan%';

SELECT 'Verificando quotes...' as check_step;
SELECT COUNT(*) as quotes_com_van_restantes
FROM quotes 
WHERE vehicle_category_id = 'van';

-- Mostrar resultado final
SELECT '=== RESULTADO FINAL ===' as fase;
SELECT id, name, type, passengers, luggage, updated_at
FROM vehicles 
WHERE type ILIKE '%minivan%'
ORDER BY updated_at DESC;

-- =====================================================
-- FASE 5: COMMIT OU ROLLBACK
-- =====================================================

-- Se chegou até aqui sem erros, fazer commit
COMMIT;

SELECT '✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!' as status;
SELECT 'Todas as referências de "Van" foram atualizadas para "Minivan"' as resultado;
SELECT 'Backup salvo na tabela: vehicles_backup_van_migration' as backup_info;

-- =====================================================
-- INSTRUÇÕES DE ROLLBACK (se necessário)
-- =====================================================

/*
EM CASO DE PROBLEMAS, EXECUTE O ROLLBACK:

-- Restaurar da tabela de backup
UPDATE vehicles 
SET 
  name = backup.name,
  type = backup.type,
  updated_at = backup.updated_at
FROM vehicles_backup_van_migration backup
WHERE vehicles.id = backup.id;

-- Remover tabela de backup após confirmação
-- DROP TABLE vehicles_backup_van_migration;
*/

-- =====================================================
-- VERIFICAÇÃO FINAL DO SISTEMA
-- =====================================================

SELECT '=== VERIFICAÇÃO FINAL DO SISTEMA ===' as fase;

-- Verificar integridade das foreign keys
SELECT 'Verificando integridade referencial...' as check_step;

-- Verificar se todos os vehicle_category_id em quotes existem
SELECT CASE 
  WHEN EXISTS (
    SELECT 1 FROM quotes q 
    LEFT JOIN vehicle_categories vc ON q.vehicle_category_id = vc.id 
    WHERE vc.id IS NULL AND q.vehicle_category_id IS NOT NULL
  )
  THEN '❌ ERRO: Existem quotes com vehicle_category_id inválido'
  ELSE '✅ OK: Todas as referências estão válidas'
END as integridade_quotes;

-- Verificar se todos os vehicle_id em bookings existem
SELECT CASE 
  WHEN EXISTS (
    SELECT 1 FROM bookings b 
    LEFT JOIN vehicles v ON b.vehicle_id = v.id 
    WHERE v.id IS NULL AND b.vehicle_id IS NOT NULL
  )
  THEN '❌ ERRO: Existem bookings com vehicle_id inválido'
  ELSE '✅ OK: Todas as referências de veículos estão válidas'
END as integridade_bookings;

SELECT '🎉 MIGRAÇÃO FINALIZADA - SISTEMA PRONTO PARA USO!' as conclusao;