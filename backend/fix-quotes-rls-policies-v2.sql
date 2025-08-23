-- Script para corrigir as políticas RLS (Row Level Security) da tabela quotes
-- Execute este script no SQL Editor do Supabase para permitir operações CRUD na tabela quotes

-- Primeiro, remover TODAS as políticas existentes que podem estar conflitando
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;
DROP POLICY IF EXISTS "Allow delete quotes" ON quotes;
DROP POLICY IF EXISTS "Allow insert quotes" ON quotes;
DROP POLICY IF EXISTS "Allow select quotes" ON quotes;
DROP POLICY IF EXISTS "Allow update quotes" ON quotes;
DROP POLICY IF EXISTS "Public can view quotes by ID" ON quotes;
DROP POLICY IF EXISTS "admin_manage_quotes" ON quotes;
DROP POLICY IF EXISTS "public_read_quotes" ON quotes;

-- Recriar as políticas corretamente

-- Política para admins (acesso total)
CREATE POLICY "admin_manage_quotes" ON quotes
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE admin_profiles.id = auth.uid() 
    AND admin_profiles.role = 'admin'
  ));

-- Política para leitura pública
CREATE POLICY "public_read_quotes" ON quotes
  FOR SELECT 
  USING (true);

-- Verificar se a tabela tem RLS habilitado
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Mostrar todas as políticas criadas para verificação
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY tablename, policyname;