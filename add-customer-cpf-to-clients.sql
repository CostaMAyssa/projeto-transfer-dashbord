-- Script para adicionar a coluna customer_cpf à tabela clients
-- Execute este script no SQL Editor do Supabase Dashboard

-- Adicionar a coluna customer_cpf à tabela clients
ALTER TABLE public.clients 
ADD COLUMN customer_cpf TEXT;

-- Criar um índice para melhorar a performance das buscas por CPF
CREATE INDEX IF NOT EXISTS idx_clients_customer_cpf 
ON public.clients(customer_cpf);

-- Verificar se a coluna foi adicionada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clients' 
AND table_schema = 'public' 
AND column_name = 'customer_cpf';

-- Comentário sobre a coluna
COMMENT ON COLUMN public.clients.customer_cpf IS 'CPF do cliente para identificação';