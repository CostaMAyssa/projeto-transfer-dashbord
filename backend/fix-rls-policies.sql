-- Script para corrigir as políticas RLS (Row Level Security)
-- Execute este script no SQL Editor do Supabase para permitir operações CRUD

-- Primeiro, remover políticas existentes que podem estar conflitando
DROP POLICY IF EXISTS "public_read_vehicles" ON vehicles;
DROP POLICY IF EXISTS "admin_manage_vehicles" ON vehicles;
DROP POLICY IF EXISTS "public_read_extras" ON extras;
DROP POLICY IF EXISTS "admin_manage_extras" ON extras;
DROP POLICY IF EXISTS "public_read_pricing" ON pricing_rules;
DROP POLICY IF EXISTS "admin_manage_pricing" ON pricing_rules;

-- Recriar as políticas corretamente

-- VEHICLES: Todos podem ler, admins podem fazer tudo
CREATE POLICY "public_read_vehicles" ON vehicles
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_vehicles" ON vehicles
  FOR ALL USING (true)
  WITH CHECK (true);

-- EXTRAS: Todos podem ler, admins podem fazer tudo  
CREATE POLICY "public_read_extras" ON extras
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_extras" ON extras  
  FOR ALL USING (true)
  WITH CHECK (true);

-- PRICING RULES: Todos podem ler, admins podem fazer tudo
CREATE POLICY "public_read_pricing" ON pricing_rules
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_pricing" ON pricing_rules
  FOR ALL USING (true) 
  WITH CHECK (true);

-- Verificar se as tabelas têm RLS habilitado
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;  
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Mostrar todas as políticas criadas para verificação
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('vehicles', 'extras', 'pricing_rules')
ORDER BY tablename, policyname; 