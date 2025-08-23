# Correção do Erro de Relacionamento entre Tabelas

## Problema Identificado

Foi identificado um erro ao tentar buscar orçamentos com informações de categorias de veículos:

```
GET https://micpkdvtewsbtbrptuoj.supabase.co/rest/v1/quotes?select=*%2Cvehicle_categories%28name%2Ctype%29&order=created_at.desc 400 (Bad Request)

Erro do Supabase ao buscar orçamentos:
{code: 'PGRST200', details: "Searched for a foreign key relationship between 'quotes' and 'vehicle_categories' in the schema 'public', but no matches were found.", hint: null, message: "Could not find a relationship between 'quotes' and 'vehicle_categories' in the schema cache"}
```

## Causa do Problema

O erro ocorre porque, embora ambas as tabelas existam no banco de dados:

1. A tabela `quotes` possui uma coluna `vehicle_category_id` que deveria referenciar a tabela `vehicle_categories`
2. A tabela `vehicle_categories` existe e possui uma coluna `id` como chave primária
3. No entanto, **não foi criada a chave estrangeira (foreign key)** que estabelece o relacionamento entre essas tabelas

## Solução Implementada

Foi criado um script SQL para adicionar a chave estrangeira necessária entre as tabelas:

```sql
-- Script para adicionar a chave estrangeira entre quotes e vehicle_categories
ALTER TABLE quotes
DROP CONSTRAINT IF EXISTS quotes_vehicle_category_id_fkey;

ALTER TABLE quotes
ADD CONSTRAINT quotes_vehicle_category_id_fkey
FOREIGN KEY (vehicle_category_id)
REFERENCES vehicle_categories(id);
```

O script completo está disponível em: `/backend/fix-vehicle-categories-foreign-key.sql`

## Como Aplicar a Correção

1. Acesse o painel do Supabase do projeto
2. Vá para a seção "SQL Editor"
3. Cole o conteúdo do arquivo `fix-vehicle-categories-foreign-key.sql`
4. Execute o script
5. Verifique se a chave estrangeira foi criada corretamente

## Verificação

Após aplicar a correção, a consulta que estava falhando deve funcionar corretamente:

```javascript
const { data, error } = await supabase
  .from('quotes')
  .select(`
    *,
    vehicle_categories(name, type)
  `)
  .order('created_at', { ascending: false })
```

## Observações Adicionais

- Este problema é diferente do erro 400 de autenticação que foi corrigido anteriormente
- A correção atual foca especificamente no relacionamento entre tabelas
- Certifique-se de que as políticas RLS (Row Level Security) estejam configuradas corretamente para ambas as tabelas