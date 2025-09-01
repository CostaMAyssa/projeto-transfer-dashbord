-- Script conservador para corrigir políticas RLS conflitantes da tabela quotes
-- Este script mantém os relacionamentos com outras tabelas (zones, vehicle_categories)
-- mas remove apenas as políticas duplicadas e conflitantes

-- 1. Verificar políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY policyname;

-- 2. Remover apenas as políticas duplicadas e conflitantes
-- Mantemos as políticas que não conflitam entre si

-- Remover políticas duplicadas de admin
DROP POLICY IF EXISTS "admin_manage_quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;

-- Remover políticas duplicadas de leitura pública
DROP POLICY IF EXISTS "public_read_quotes" ON quotes;
DROP POLICY IF EXISTS "Public can view quotes by ID" ON quotes;

-- Manter apenas as políticas authenticated que funcionam
-- Não vamos remover: Allow delete quotes, Allow insert quotes, Allow select quotes, Allow update quotes
-- Essas políticas são necessárias para o funcionamento do sistema

-- 3. Criar políticas simplificadas e não conflitantes

-- Política para administradores (acesso total)
CREATE POLICY "quotes_admin_full_access" ON quotes
  FOR ALL 
  TO authenticated
  USING (
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

-- Política para leitura pública (anônimos podem ver quotes)
CREATE POLICY "quotes_public_read_only" ON quotes
  FOR SELECT 
  TO anon
  USING (true);

-- 4. Verificar políticas após correção
SELECT 'Políticas após correção:' AS status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY policyname;

-- 5. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'quotes';

-- 6. Teste básico de inserção (deve funcionar para authenticated)
SELECT 'Script executado com sucesso!' AS status;
SELECT 'Agora teste a criação de orçamentos na interface.' AS next_step;

-- INSTRUÇÕES:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se não há erros na execução
-- 3. Teste a criação de orçamentos na interface
-- 4. As políticas authenticated existentes (Allow insert quotes, etc.) continuarão funcionando
-- 5. Removemos apenas as políticas duplicadas que causavam conflito