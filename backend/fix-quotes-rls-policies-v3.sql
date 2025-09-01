-- Script para corrigir as políticas RLS da tabela quotes
-- Remove todas as políticas existentes e cria apenas as necessárias

-- Listar políticas atuais para referência
SELECT * FROM pg_policies WHERE tablename = 'quotes';

-- Remover todas as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Admins can manage all quotes" ON "public"."quotes";
DROP POLICY IF EXISTS "Allow delete quotes" ON "public"."quotes";
DROP POLICY IF EXISTS "Allow insert quotes" ON "public"."quotes";
DROP POLICY IF EXISTS "Allow select quotes" ON "public"."quotes";
DROP POLICY IF EXISTS "Allow update quotes" ON "public"."quotes";
DROP POLICY IF EXISTS "Public can view quotes by ID" ON "public"."quotes";
DROP POLICY IF EXISTS "admin_manage_quotes" ON "public"."quotes";
DROP POLICY IF EXISTS "public_read_quotes" ON "public"."quotes";

-- Criar apenas duas políticas claras e não conflitantes

-- 1. Política para administradores (todas as operações)
CREATE POLICY "admin_manage_quotes" ON "public"."quotes"
AS PERMISSIVE FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 
    FROM admin_profiles 
    WHERE admin_profiles.id = auth.uid() AND admin_profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM admin_profiles 
    WHERE admin_profiles.id = auth.uid() AND admin_profiles.role = 'admin'
  )
);

-- 2. Política para leitura pública (apenas SELECT)
CREATE POLICY "public_read_quotes" ON "public"."quotes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Garantir que RLS está habilitado
ALTER TABLE "public"."quotes" ENABLE ROW LEVEL SECURITY;

-- Listar políticas após as alterações para verificação
SELECT * FROM pg_policies WHERE tablename = 'quotes';