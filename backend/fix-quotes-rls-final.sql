-- Script para corrigir definitivamente as políticas RLS da tabela quotes
-- Este script resolve o erro 400 ao salvar orçamentos

-- 1. Desabilitar RLS temporariamente para limpeza
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- 2. Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;
DROP POLICY IF EXISTS "Allow delete quotes" ON quotes;
DROP POLICY IF EXISTS "Allow insert quotes" ON quotes;
DROP POLICY IF EXISTS "Allow select quotes" ON quotes;
DROP POLICY IF EXISTS "Allow update quotes" ON quotes;
DROP POLICY IF EXISTS "Public can view quotes by ID" ON quotes;
DROP POLICY IF EXISTS "admin_manage_quotes" ON quotes;
DROP POLICY IF EXISTS "public_read_quotes" ON quotes;
DROP POLICY IF EXISTS "quotes_admin_policy" ON quotes;
DROP POLICY IF EXISTS "quotes_public_policy" ON quotes;

-- 3. Reabilitar RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- 4. Criar política para admins com acesso total
CREATE POLICY "admin_full_access" ON quotes
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

-- 5. Criar política para leitura pública (necessária para visualização de orçamentos)
CREATE POLICY "public_read_access" ON quotes
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- 6. Política adicional para inserção sem autenticação (para formulários públicos)
CREATE POLICY "public_insert_access" ON quotes
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- 7. Verificar se as políticas foram criadas corretamente
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
WHERE tablename = 'quotes'
ORDER BY policyname;

-- 8. Verificar se RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'quotes';

-- 9. Testar inserção básica (descomente para testar)
/*
INSERT INTO quotes (
  booking_reference,
  customer_name,
  customer_email,
  customer_phone,
  quote_type,
  pickup_address,
  pickup_date,
  pickup_time,
  destination_address,
  vehicle_category_id,
  passengers,
  base_price,
  total_amount
) VALUES (
  'TEST-' || EXTRACT(EPOCH FROM NOW())::text,
  'Teste Cliente',
  'teste@email.com',
  '+55 11 99999-9999',
  'one-way',
  'Aeroporto de Guarulhos',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00:00',
  'Hotel Copacabana',
  'business',
  2,
  250.00,
  250.00
);
*/

COMMIT;