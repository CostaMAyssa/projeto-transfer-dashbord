# API de Pagamentos - Dashboard AZ Transfer

## Visão Geral

A API de pagamentos foi implementada como uma Edge Function no Supabase, permitindo a integração com o Stripe para processar pagamentos tanto integrais quanto parcelados.

## Estrutura da API

### Edge Function
- **Localização**: `/app/supabase/functions/payments/index.ts`
- **Endpoint**: Acessível via proxy em `/api/supabase/functions/payments`

### Credenciais Necessárias

As seguintes variáveis de ambiente devem estar configuradas no Supabase:

```
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

## Endpoints

### POST /api/supabase/functions/payments

Cria um novo pagamento (integral ou parcelado).

#### Request Body
```json
{
  "quoteId": "string",
  "paymentType": "full" | "partial",
  "firstInstallmentPercentage": 50, // Opcional, padrão 50%
  "customerInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

#### Response - Pagamento Integral
```json
{
  "success": true,
  "paymentIntentId": "pi_...",
  "clientSecret": "pi_..._secret_..."
}
```

#### Response - Pagamento Parcelado
```json
{
  "success": true,
  "paymentLinks": {
    "firstInstallment": "https://buy.stripe.com/...",
    "secondInstallment": "https://buy.stripe.com/..."
  }
}
```

### GET /api/supabase/functions/payments?quoteId=123

Retorna informações sobre um pagamento existente.

#### Response
```json
{
  "success": true,
  "payment": {
    "id": "uuid",
    "quote_id": "string",
    "amount": 100.00,
    "currency": "EUR",
    "status": "pending",
    "payment_type": "partial",
    "payment_installments": [
      {
        "installment_number": 1,
        "amount": 50.00,
        "due_date": "2024-01-15",
        "status": "pending",
        "stripe_payment_link_url": "https://buy.stripe.com/..."
      }
    ]
  }
}
```

## Funcionalidades

### Pagamento Integral
- Cria um PaymentIntent no Stripe
- Salva registro na tabela `payments`
- Retorna client_secret para checkout

### Pagamento Parcelado
- Cria dois Payment Links no Stripe
- Primeira parcela: data atual
- Segunda parcela: data do serviço (pickup_date)
- Salva registros nas tabelas `payments` e `payment_installments`
- Percentual configurável (10% a 90%)

### Tabelas do Banco de Dados

#### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) DEFAULT 'pending',
  payment_type VARCHAR(10) NOT NULL, -- 'full' or 'partial'
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### payment_installments
```sql
CREATE TABLE payment_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  installment_number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_link_id TEXT,
  stripe_payment_link_url TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Políticas RLS

As políticas de Row Level Security foram configuradas para permitir:
- Leitura: Todos os usuários autenticados
- Escrita/Edição/Exclusão: Apenas administradores

## Integração no Frontend

A página de pagamentos (`/app/admin/payments/page.tsx`) integra com a API através do proxy Next.js, permitindo:

1. Busca de orçamentos
2. Seleção do tipo de pagamento
3. Configuração de percentuais para pagamento parcelado
4. Geração de links de pagamento
5. Visualização de detalhes das parcelas

## Próximos Passos

1. **Webhooks**: Implementar webhooks do Stripe para atualizar status dos pagamentos
2. **Notificações**: Sistema de notificações por email/SMS
3. **Relatórios**: Dashboard de acompanhamento de pagamentos
4. **Cobrança Automática**: Jobs para cobrança de parcelas em atraso

## Segurança

- Todas as operações são autenticadas via Supabase Auth
- Chaves do Stripe são armazenadas como variáveis de ambiente
- Políticas RLS protegem acesso aos dados
- Validação de dados no backend