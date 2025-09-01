# Migração Van → Minivan - Documentação

## 📋 Resumo

Este documento descreve a migração segura de todas as referências de "Van" para "Minivan" no sistema de transfer, garantindo que não haja quebras no funcionamento.

## 🎯 Objetivo

Atualizar todas as referências de "Van" para "Minivan" no banco de dados e sistema, mantendo a consistência e funcionalidade.

## 🔍 Análise Realizada

### Locais onde "Van" foi encontrado:

#### 1. **Banco de Dados**
- **Tabela `vehicles`**: Campo `type` com valores como "Business Van/SUV"
- **Tabela `quotes`**: Campo `vehicle_category_id` com valor "van"
- **Tabela `zone_pricing`**: Campo `vehicle_category_id` com valor "van"
- **Tabela `vehicle_categories`**: Campo `name` e `id` com "van"

#### 2. **Frontend/Código**
- **`lib/zone-pricing.ts`**: Mapeamento `'VAN': 'minivan'` (já correto)
- **`lib/zone-pricing-type.ts`**: Definições de tipos já usam "Minivan"
- **Arquivos de dicionário**: Já usam "Mini Van" como título
- **Scripts SQL**: Vários scripts de teste e configuração

## 🛠️ Solução Implementada

### 1. **Script de Migração Principal**
**Arquivo**: `backend/migrate-van-to-minivan.sql`

**Funcionalidades**:
- ✅ Diagnóstico completo do estado atual
- ✅ Backup automático dos dados
- ✅ Migração segura com transações
- ✅ Verificação pós-migração
- ✅ Instruções de rollback

**Mudanças realizadas**:
- `Business Van/SUV` → `Business Minivan/SUV`
- `Van` → `Minivan`
- `vehicle_category_id = 'van'` → `'minivan'`
- Atualização de nomes de veículos

### 2. **Script de Verificação**
**Arquivo**: `backend/verify-van-migration.sql`

**Funcionalidades**:
- ✅ Verificação de dados migrados
- ✅ Teste de integridade referencial
- ✅ Validação de funcionalidades
- ✅ Verificação de preços
- ✅ Status do backup
- ✅ Relatório final

## 🔄 Frontend - Compatibilidade

### Mapeamento Existente
O frontend já possui mapeamento correto em `lib/zone-pricing.ts`:
```typescript
const vehicleMap: Record<string, string> = {
  'SEDAN': 'sedan',
  'SUV': 'suv', 
  'MINIVAN': 'minivan',
  'VAN': 'minivan',        // ← Já mapeia VAN para minivan
  'LUXURY': 'minivan'
};
```

### Configuração de Preços
A matriz de preços já usa `MINIVAN`:
```typescript
export const ZONE_PRICING_MATRIX = {
  'EWR-MAN': { SEDAN: 140, SUV: 170, MINIVAN: 160 },
  // ... todas as rotas já usam MINIVAN
};
```

## 📊 Impacto da Migração

### ✅ **Sem Impacto Negativo**
- Frontend continua funcionando normalmente
- Mapeamento `VAN → minivan` já existe
- Preços já configurados para `MINIVAN`
- Backup automático criado

### 🔄 **Mudanças Positivas**
- Consistência terminológica
- Banco de dados padronizado
- Melhor organização dos dados

## 🚀 Como Executar a Migração

### Passo 1: Executar Migração
```sql
-- No SQL Editor do Supabase
-- Execute o arquivo: backend/migrate-van-to-minivan.sql
```

### Passo 2: Verificar Resultado
```sql
-- Execute o arquivo: backend/verify-van-migration.sql
```

### Passo 3: Confirmar Funcionamento
- Teste criação de quotes com "minivan"
- Verifique cálculo de preços
- Confirme que não há erros no frontend

## 🔙 Rollback (se necessário)

Caso algo dê errado, execute:
```sql
-- Restaurar do backup
UPDATE vehicles 
SET 
  name = backup.name,
  type = backup.type,
  updated_at = backup.updated_at
FROM vehicles_backup_van_migration backup
WHERE vehicles.id = backup.id;

-- Restaurar quotes
UPDATE quotes 
SET vehicle_category_id = 'van'
WHERE vehicle_category_id = 'minivan';
```

## 📋 Checklist Pós-Migração

- [ ] Script de migração executado sem erros
- [ ] Script de verificação mostra "SUCESSO"
- [ ] Frontend carrega sem erros
- [ ] Criação de quotes funciona
- [ ] Cálculo de preços funciona
- [ ] Backup foi criado
- [ ] Não há referências "van" restantes

## 🔍 Monitoramento

### Comandos Úteis
```sql
-- Ver todos os tipos de veículos
SELECT DISTINCT type FROM vehicles ORDER BY type;

-- Ver categorias de veículos
SELECT * FROM vehicle_categories ORDER BY name;

-- Verificar quotes
SELECT vehicle_category_id, COUNT(*) 
FROM quotes 
GROUP BY vehicle_category_id;
```

## 📞 Suporte

Em caso de problemas:
1. Execute o script de verificação
2. Verifique os logs do Supabase
3. Use os comandos de troubleshooting
4. Se necessário, execute o rollback

## 📝 Notas Importantes

- ⚠️ **Sempre execute em ambiente de teste primeiro**
- ✅ **Backup é criado automaticamente**
- 🔄 **Frontend já é compatível com a mudança**
- 📊 **Preços já estão configurados para MINIVAN**
- 🛡️ **Migração é reversível**

---

**Data da Migração**: _A ser preenchida quando executada_  
**Executado por**: _A ser preenchido_  
**Status**: _A ser preenchido_