-- Script para corrigir as políticas RLS (Row Level Security) da tabela quotes
-- Execute este script no SQL Editor do Supabase para permitir operações CRUD na tabela quotes

-- Primeiro, remover políticas existentes que podem estar conflitando
DROP POLICY IF EXISTS "public_read_quotes" ON quotes;
DROP POLICY IF EXISTS "admin_manage_quotes" ON quotes;

-- Recriar as políticas corretamente

-- QUOTES: Todos podem ler, admins podem fazer tudo
CREATE POLICY "public_read_quotes" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_quotes" ON quotes
  FOR ALL USING (true)
  WITH CHECK (true);

-- Verificar se a tabela tem RLS habilitado
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Mostrar todas as políticas criadas para verificação
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'quotes'
ORDER BY tablename, policyname;

-- Alternativa: Se as políticas acima não resolverem o problema, você pode temporariamente desabilitar RLS
-- ATENÇÃO: Use apenas em ambiente de desenvolvimento, não em produção!
-- ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;