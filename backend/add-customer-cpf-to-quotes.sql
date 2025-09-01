-- Adicionar coluna customer_cpf na tabela quotes
-- Este script adiciona uma nova coluna para armazenar o CPF do cliente nos orçamentos

ALTER TABLE quotes 
ADD COLUMN customer_cpf VARCHAR(14);

-- Adicionar comentário na coluna
COMMENT ON COLUMN quotes.customer_cpf IS 'CPF do cliente (formato: XXX.XXX.XXX-XX ou apenas números)';

-- Verificar se a coluna foi adicionada corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND column_name = 'customer_cpf';