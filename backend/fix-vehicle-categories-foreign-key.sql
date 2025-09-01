-- Script para adicionar a chave estrangeira entre quotes e vehicle_categories
-- Execute este script no SQL Editor do Supabase para corrigir o erro de relacionamento

-- Verificar se a tabela vehicle_categories existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'vehicle_categories'
);

-- Verificar se a coluna vehicle_category_id existe na tabela quotes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'quotes' 
AND column_name = 'vehicle_category_id';

-- Adicionar a chave estrangeira entre quotes e vehicle_categories
ALTER TABLE quotes
DROP CONSTRAINT IF EXISTS quotes_vehicle_category_id_fkey;

ALTER TABLE quotes
ADD CONSTRAINT quotes_vehicle_category_id_fkey
FOREIGN KEY (vehicle_category_id)
REFERENCES vehicle_categories(id);

-- Verificar se a chave estrangeira foi criada corretamente
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema 
    JOIN information_schema.constraint_column_usage AS ccu 
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='quotes' 
AND kcu.column_name='vehicle_category_id';

-- Mensagem de conclusão
SELECT 'Chave estrangeira entre quotes e vehicle_categories criada com sucesso!' AS status;