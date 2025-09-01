-- Script para configurar políticas RLS para tabelas de pagamentos
-- Execute este script no SQL Editor do Supabase para permitir operações CRUD

-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payments', 'payment_installments', 'payment_transactions');

-- Habilitar RLS nas tabelas de pagamentos
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_transactions ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes que podem estar conflitando
DROP POLICY IF EXISTS "public_read_payments" ON payments;
DROP POLICY IF EXISTS "admin_manage_payments" ON payments;
DROP POLICY IF EXISTS "public_read_payment_installments" ON payment_installments;
DROP POLICY IF EXISTS "admin_manage_payment_installments" ON payment_installments;
DROP POLICY IF EXISTS "public_read_payment_transactions" ON payment_transactions;
DROP POLICY IF EXISTS "admin_manage_payment_transactions" ON payment_transactions;

-- PAYMENTS: Todos podem ler, admins podem fazer tudo
CREATE POLICY "public_read_payments" ON payments
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_payments" ON payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  );

-- PAYMENT_INSTALLMENTS: Todos podem ler, admins podem fazer tudo
CREATE POLICY "public_read_payment_installments" ON payment_installments
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_payment_installments" ON payment_installments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  );

-- PAYMENT_TRANSACTIONS: Todos podem ler, admins podem fazer tudo
CREATE POLICY "public_read_payment_transactions" ON payment_transactions
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_payment_transactions" ON payment_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.role = 'admin'
    )
  );

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

-- Comentário: Se as políticas acima não resolverem o problema, 
-- você pode temporariamente desabilitar RLS para teste
-- ATENÇÃO: Use apenas em ambiente de desenvolvimento!
-- ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE payment_installments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;