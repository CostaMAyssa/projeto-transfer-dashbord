# Solução Conservadora para Políticas RLS da Tabela Quotes

## Problema Identificado

O erro 400 ao salvar orçamentos é causado por **políticas RLS duplicadas e conflitantes** na tabela `quotes`. Você está correto ao mencionar que a tabela tem relacionamentos com outras tabelas que não podem ser quebrados.

## Relacionamentos da Tabela Quotes

A tabela `quotes` possui os seguintes relacionamentos importantes:

### Foreign Keys (Chaves Estrangeiras)
- `pickup_zone_id` → `zones(id)`
- `destination_zone_id` → `zones(id)` 
- `return_pickup_zone_id` → `zones(id)`
- `return_destination_zone_id` → `zones(id)`
- `vehicle_category_id` → `vehicle_categories(id)`
- `created_by` → `auth.users(id)` (implícito)

### Políticas Atuais (Conflitantes)
```sql
-- DUPLICADAS - CAUSAM CONFLITO:
1. admin_manage_quotes (ALL para public)
2. Admins can manage all quotes (ALL para public)
3. public_read_quotes (SELECT para public)
4. Public can view quotes by ID (SELECT para public)

-- FUNCIONAIS - MANTER:
5. Allow delete quotes (DELETE para authenticated)
6. Allow insert quotes (INSERT para authenticated)
7. Allow select quotes (SELECT para authenticated)
8. Allow update quotes (UPDATE para authenticated)
```

## Solução Conservadora

O script `backend/fix-quotes-rls-conservative.sql` implementa uma abordagem conservadora que:

### ✅ O que FAZ:
1. **Remove apenas as políticas duplicadas** que causam conflito
2. **Mantém as políticas authenticated** que funcionam
3. **Preserva todos os relacionamentos** com outras tabelas
4. **Cria políticas simplificadas** sem conflitos

### ❌ O que NÃO FAZ:
1. **Não remove** as políticas `Allow insert/select/update/delete quotes`
2. **Não quebra** relacionamentos com `zones` e `vehicle_categories`
3. **Não desabilita** o RLS da tabela
4. **Não afeta** outras tabelas do sistema

## Políticas Após Correção

Após executar o script, a tabela terá:

```sql
-- Políticas mantidas (funcionais):
1. Allow delete quotes (DELETE para authenticated)
2. Allow insert quotes (INSERT para authenticated) ← PERMITE SALVAR
3. Allow select quotes (SELECT para authenticated)
4. Allow update quotes (UPDATE para authenticated)

-- Políticas novas (sem conflito):
5. quotes_admin_full_access (ALL para authenticated com perfil admin)
6. quotes_public_read_only (SELECT para anon)
```

## Como Executar

1. **Abra o SQL Editor no Supabase**
2. **Cole o conteúdo** do arquivo `backend/fix-quotes-rls-conservative.sql`
3. **Execute o script**
4. **Verifique** se não há erros
5. **Teste** a criação de orçamentos na interface

## Resultado Esperado

- ✅ **Orçamentos podem ser salvos** (política `Allow insert quotes` mantida)
- ✅ **Relacionamentos preservados** com zones e vehicle_categories
- ✅ **Admins têm acesso total** via nova política simplificada
- ✅ **Leitura pública funciona** sem conflitos
- ✅ **Sistema continua funcionando** normalmente

## Arquivos Relacionados

- `backend/fix-quotes-rls-conservative.sql` - Script de correção conservadora
- `backend/create-quotes-table.sql` - Estrutura original da tabela
- `hooks/useQuotes.ts` - Hook com logs de depuração
- `app/admin/quotes/new/page.tsx` - Página com logs adicionados

## Próximos Passos

1. **Execute** o script `fix-quotes-rls-conservative.sql` no Supabase
2. **Teste** a criação de orçamentos na interface
3. **Verifique** se os logs mostram sucesso na operação
4. **Confirme** que os relacionamentos continuam funcionando

Esta abordagem conservadora resolve o problema mantendo a integridade do sistema e todos os relacionamentos existentes.