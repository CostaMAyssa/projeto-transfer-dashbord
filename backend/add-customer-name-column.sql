-- Adicionar colunas customer_name e customer_phone na tabela payments
-- Este comando resolve o erro PGRST204 relacionado à coluna customer_name

ALTER TABLE payments 
ADD COLUMN customer_name TEXT,
ADD COLUMN customer_phone TEXT;

-- Opcional: Adicionar comentários para documentar as colunas
COMMENT ON COLUMN payments.customer_name IS 'Nome do cliente associado ao pagamento';
COMMENT ON COLUMN payments.customer_phone IS 'Telefone do cliente associado ao pagamento';

-- Verificar se as colunas foram adicionadas com sucesso
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name IN ('customer_name', 'customer_phone')
ORDER BY column_name;