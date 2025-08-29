-- Adicionar coluna cpf à tabela clients existente
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS cpf TEXT;

-- Adicionar coluna whatsapp se não existir
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Adicionar coluna position se não existir
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS position TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients' 
AND table_schema = 'public'
ORDER BY ordinal_position;