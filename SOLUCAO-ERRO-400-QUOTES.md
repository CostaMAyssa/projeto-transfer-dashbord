# 🔧 Solução para Erro 400 ao Salvar Orçamentos

## 🚨 Problema Identificado

O erro 400 que está ocorrendo ao salvar orçamentos é causado pelas **políticas RLS (Row Level Security)** da tabela `quotes` no Supabase. As políticas estão muito restritivas e impedem a inserção de dados.

### Logs de Erro Observados:
```
micpkdvtewsbtbrptuoj…1/quotes?select=*:1 
Failed to load resource: the server responded with a status of 400 ()
🚨 ERRO SUPABASE: Object
🚨 DETALHES DO ERRO: Object
❌ Erro ao criar orçamento: Object
Erro ao salvar orçamento: Object
```

## 🛠️ Solução Implementada

### 1. Logs de Depuração Adicionados

✅ **Arquivo `hooks/useQuotes.ts`** - Logs detalhados na função `createQuote`:
- Dados de entrada completos
- Dados processados para inserção
- Tipos de campos críticos
- Erros detalhados do Supabase

✅ **Arquivo `app/admin/quotes/new/page.tsx`** - Logs antes da chamada:
- Dados completos do formulário
- Dados preparados para o orçamento
- Validação de campos obrigatórios

### 2. Script de Correção das Políticas RLS

✅ **Criado:** `backend/fix-quotes-rls-final.sql`

Este script:
- Remove todas as políticas RLS conflitantes
- Cria políticas corretas para admins e acesso público
- Permite inserção de orçamentos sem autenticação (necessário para formulários públicos)
- Inclui verificações e testes

## 📋 Passos para Resolver

### Passo 1: Executar Script no Supabase

1. Acesse o **SQL Editor** do Supabase: https://micpkdvtewsbtbrptuoj.supabase.co
2. Copie todo o conteúdo do arquivo `backend/fix-quotes-rls-final.sql`
3. Cole no SQL Editor
4. Execute o script
5. Verifique se não há erros na execução

### Passo 2: Verificar Políticas Criadas

Após executar o script, você deve ver 3 políticas na tabela `quotes`:
- `admin_full_access` - Acesso total para admins
- `public_read_access` - Leitura pública
- `public_insert_access` - Inserção pública (para formulários)

### Passo 3: Testar Criação de Orçamento

1. Acesse: http://localhost:3001/admin/quotes/new
2. Preencha um orçamento com preço personalizado
3. Salve o orçamento
4. Verifique o console do navegador para logs detalhados

## 🔍 Campos Obrigatórios da Tabela Quotes

Segundo o esquema do banco, estes campos são **obrigatórios**:

- `booking_reference` (VARCHAR(50) UNIQUE NOT NULL)
- `customer_name` (VARCHAR(255) NOT NULL)
- `customer_email` (VARCHAR(255) NOT NULL)
- `customer_phone` (VARCHAR(50) NOT NULL)
- `quote_type` (VARCHAR(20) NOT NULL)
- `pickup_address` (TEXT NOT NULL)
- `pickup_date` (DATE NOT NULL)
- `pickup_time` (TIME NOT NULL)
- `destination_address` (TEXT NOT NULL)
- `vehicle_category_id` (TEXT NOT NULL)
- `passengers` (INTEGER NOT NULL DEFAULT 1)
- `base_price` (DECIMAL(10,2) NOT NULL DEFAULT 0)
- `total_amount` (DECIMAL(10,2) NOT NULL DEFAULT 0)

## 🎯 Resultado Esperado

Após executar o script de correção:

✅ Orçamentos devem ser salvos sem erro 400
✅ Preços personalizados devem funcionar corretamente
✅ Logs detalhados devem mostrar o processo completo
✅ Sistema deve funcionar tanto para admins quanto para acesso público

## 🔧 Arquivos Modificados

1. **`hooks/useQuotes.ts`** - Logs de depuração adicionados
2. **`app/admin/quotes/new/page.tsx`** - Logs de depuração adicionados
3. **`backend/fix-quotes-rls-final.sql`** - Script de correção criado

## 📞 Próximos Passos

1. Execute o script SQL no Supabase
2. Teste a criação de orçamentos
3. Verifique os logs no console do navegador
4. Confirme que o erro 400 foi resolvido

---

**Nota:** O servidor está rodando em `http://localhost:3001` para testes imediatos após a correção das políticas RLS.