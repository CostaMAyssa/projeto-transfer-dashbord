-- Script alternativo com políticas RLS mais simples para tabelas de pagamentos
-- Use este script se o anterior não funcionar adequadamente
-- Execute este script no SQL Editor do Supabase

-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payments', 'payment_installments', 'payment_transactions');

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "public_read_payments" ON payments;
DROP POLICY IF EXISTS "admin_manage_payments" ON payments;
DROP POLICY IF EXISTS "allow_all_payments" ON payments;
DROP POLICY IF EXISTS "public_read_payment_installments" ON payment_installments;
DROP POLICY IF EXISTS "admin_manage_payment_installments" ON payment_installments;
DROP POLICY IF EXISTS "allow_all_payment_installments" ON payment_installments;
DROP POLICY IF EXISTS "public_read_payment_transactions" ON payment_transactions;
DROP POLICY IF EXISTS "admin_manage_payment_transactions" ON payment_transactions;
DROP POLICY IF EXISTS "allow_all_payment_transactions" ON payment_transactions;

-- Criar políticas simples que permitem todas as operações
-- PAYMENTS: Acesso total para todos
CREATE POLICY "allow_all_payments" ON payments
  FOR ALL USING (true)
  WITH CHECK (true);

-- PAYMENT_INSTALLMENTS: Acesso total para todos
CREATE POLICY "allow_all_payment_installments" ON payment_installments
  FOR ALL USING (true)
  WITH CHECK (true);

-- PAYMENT_TRANSACTIONS: Acesso total para todos
CREATE POLICY "allow_all_payment_transactions" ON payment_transactions
  FOR ALL USING (true)
  WITH CHECK (true);

-- Habilitar RLS nas tabelas
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_transactions ENABLE ROW LEVEL SECURITY;

-- Verificar políticas criadas
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename IN ('payments', 'payment_installments', 'payment_transactions')
ORDER BY tablename, policyname;

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('payments', 'payment_installments', 'payment_transactions');

SELECT 'Políticas RLS configuradas com sucesso para tabelas de pagamentos!' as status;