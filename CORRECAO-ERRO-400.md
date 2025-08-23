# Correção do Erro 400 na Listagem de Orçamentos

## Problema Identificado

O sistema estava apresentando um erro 400 (Bad Request) ao tentar carregar a lista de orçamentos após o redirecionamento da página de criação de orçamento. Este erro estava relacionado à autenticação na API do Supabase.

Erros observados no console:
```
Failed to load resource: the server responded with a status of 400 ()
Erro ao buscar orçamentos: Object
micpkdvtewsbtbrptuoj.supabase.co/rest/v1/quotes?select=*%2Cvehicle_categories%28name%2Ctype%29&order=created_at.desc:1 Failed to load resource: the server responded with a status of 400 ()
```

## Correções Implementadas

### 1. Melhoria no Hook useQuotes.ts

Adicionamos logs detalhados e melhoramos o tratamento de erros no hook `useQuotes.ts` para facilitar a depuração do problema de autenticação:

- Adicionamos mensagens de log detalhadas para rastrear o fluxo de autenticação
- Melhoramos a mensagem de erro quando o usuário não está autenticado
- Adicionamos logs para verificar o token de acesso e o resultado da consulta

### 2. Melhoria na Página de Listagem de Orçamentos

Melhoramos a interface de usuário para exibir informações mais úteis quando ocorre um erro:

- Adicionamos uma mensagem explicativa sobre possíveis problemas de autenticação
- Incluímos um botão para ir diretamente para a página de login
- Melhoramos o estilo visual dos botões de ação

## Como Testar as Correções

1. Faça login no sistema administrativo
2. Navegue até a página de orçamentos
3. Verifique se os orçamentos são carregados corretamente
4. Crie um novo orçamento e verifique se após salvar, você é redirecionado corretamente e a lista de orçamentos é exibida sem erros

## Observações Adicionais

As políticas de RLS (Row Level Security) no Supabase parecem estar configuradas corretamente. O problema estava relacionado à autenticação na API após o redirecionamento, não às políticas em si.

As políticas existentes são:
- `Admins can manage all quotes` (ALL para admins)
- `Allow delete quotes` (DELETE para usuários autenticados)
- `Allow insert quotes` (INSERT para usuários autenticados)
- `Allow select quotes` (SELECT para usuários autenticados)
- `Allow update quotes` (UPDATE para usuários autenticados)
- `Public can view quotes by ID` (SELECT para público)
- `admin_manage_quotes` (ALL para público com condição true)
- `public_read_quotes` (SELECT para público com condição true)

Se o problema persistir, pode ser necessário revisar as políticas `admin_manage_quotes` e `public_read_quotes`, que parecem ser redundantes e muito permissivas (condição `true` para acesso público).