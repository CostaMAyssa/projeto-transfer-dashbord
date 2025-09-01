-- Adicionar colunas para links de pagamento na tabela reservations
-- Este script adiciona as colunas necessárias para armazenar links de pagamento
-- e o tipo de pagamento (único ou parcial)

-- Adicionar coluna para armazenar os links de pagamento em formato JSON
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS payment_links JSONB DEFAULT NULL;

-- Adicionar coluna para tipo de pagamento
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'single' CHECK (
  payment_type IN ('single', 'partial')
);

-- Adicionar coluna para ID do pagamento (referência para tabela payments)
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) ON DELETE SET NULL;

-- Adicionar índice para melhor performance nas consultas de pagamento
CREATE INDEX IF NOT EXISTS idx_reservations_payment_type ON reservations(payment_type);
CREATE INDEX IF NOT EXISTS idx_reservations_payment_id ON reservations(payment_id);

-- Comentários para documentação
COMMENT ON COLUMN reservations.payment_links IS 'Links de pagamento em formato JSON. Para pagamento único: {"link": "url"}. Para pagamento parcial: {"first_installment": "url1", "second_installment": "url2"}';
COMMENT ON COLUMN reservations.payment_type IS 'Tipo de pagamento: single (único) ou partial (parcial em duas vezes)';
COMMENT ON COLUMN reservations.payment_id IS 'Referência para o registro de pagamento na tabela payments';

-- Exemplos de estrutura JSON para payment_links:
-- Pagamento único:
-- {
--   "link": "https://checkout.stripe.com/pay/cs_test_..."
-- }
--
-- Pagamento parcial:
-- {
--   "first_installment": "https://checkout.stripe.com/pay/cs_test_...",
--   "second_installment": "https://checkout.stripe.com/pay/cs_test_..."
-- }

PRINT 'Colunas de pagamento adicionadas à tabela reservations com sucesso!';