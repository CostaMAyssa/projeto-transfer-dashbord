# Correção do Erro de Coluna Inexistente

## Problema
Erro ao buscar orçamentos: `column vehicle_categories_1.type does not exist`

## Solução
Modificado o arquivo `hooks/useQuotes.ts` para remover a referência à coluna inexistente:

```diff
.select(`
  *,
- vehicle_categories(name, type)
+ vehicle_categories(name)
`)
```

A tabela `vehicle_categories` não possui a coluna `type`, apenas as colunas: id, name, description, base_price, is_active, created_at e updated_at.