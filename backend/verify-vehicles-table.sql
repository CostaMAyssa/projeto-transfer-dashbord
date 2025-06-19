-- Script para verificar se a tabela vehicles está configurada corretamente
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela vehicles existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'vehicles'
) AS table_exists;

-- 2. Verificar a estrutura da tabela vehicles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vehicles'
ORDER BY ordinal_position;

-- 3. Verificar se a extensão uuid-ossp está habilitada
SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
) AS uuid_extension_enabled;

-- 4. Verificar RLS na tabela vehicles
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'vehicles';

-- 5. Verificar políticas RLS existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'vehicles'
ORDER BY policyname;

-- 6. Testar se consegue inserir um registro de teste (comentar/descomentar conforme necessário)
/*
INSERT INTO vehicles (name, type, passengers, luggage, year, license_plate, status, image_url) 
VALUES ('Teste Vehicle', 'Business Class', 4, 2, 2024, 'TEST-001', 'active', 'https://example.com/image.jpg')
RETURNING id, name, created_at;
*/

-- 7. Verificar se a função uuid_generate_v4() funciona
SELECT uuid_generate_v4() AS generated_uuid; 