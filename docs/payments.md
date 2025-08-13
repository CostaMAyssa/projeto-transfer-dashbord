Claro! Vou primeiro criar o plano detalhado antes de implementar. Baseado nas suas necessidades, vou elaborar um plano de ação abrangente:

## 📋 PLANO DE AÇÃO: Sistema de Divisão de Pagamentos

### 🎯 **FASE 0 - Modelo de Dados (Supabase)**

**Novas Tabelas:**
```sql
-- Clientes Stripe
customers (
  id, user_id, stripe_customer_id, 
  created_at, updated_at
)

-- Pagamentos individuais 
payments (
  id, booking_id, stripe_payment_intent_id,
  amount, currency, status, method,
  created_at, updated_at
)

-- Cronograma de parcelas
payment_schedules (
  id, booking_id, installment_number,
  amount, due_date, status, payment_id,
  created_at, updated_at
)
```

**Ajustes em tabelas existentes:**
- `bookings`: adicionar colunas `payment_status`, `total_amount`, `payment_method`

---

### 🎯 **FASE 1 - Nova Seção "Pagamentos" no Menu Admin**

**Localização:** Entre "Pricing" e "Reports"

**Subpáginas da seção:**
1. **`/admin/payments`** - Dashboard geral de pagamentos
2. **`/admin/payments/schedules`** - Cronograma de parcelas 
3. **`/admin/payments/settings`** - Configurações de divisão

**Conteúdo de cada página:**

**1) `/admin/payments` (Dashboard)**
- Cards resumo: Pendentes, Pagos, Falharam, Total do mês
- Tabela filtrada: reservas por status de pagamento
- Ações rápidas: "Cobrar saldo", "Gerar link", "Reembolsar"

**2) `/admin/payments/schedules` (Cronograma)**
- Calendário visual de vencimentos
- Lista de parcelas por data
- Botões: "Processar hoje", "Reagendar", "Marcar como pago"

**3) `/admin/payments/settings` (Configurações)**
- Templates de divisão (20/80, 0/100, 100/0, Custom)
- Configurações de retry (tentativas, intervalos)
- Políticas de reembolso

---

### 🎯 **FASE 2 - UI do Operador (Divisão de Pagamentos)**

**Modificações em `/admin/bookings`:**

**Nova seção "Configurar Pagamento" ao criar/editar reserva:**
```
┌─────────────────────────────────────┐
│ 💳 Configurar Pagamento            │
├─────────────────────────────────────┤
│ ○ Pagamento à vista (100%)         │
│ ● Pagamento dividido               │
│                                     │
│ Entrada: R$ [200,00] (20%)         │ 
│ Saldo: R$ [800,00] (80%)           │
│ Data do saldo: [15/08/2025]        │
│                                     │
│ ☑ Autorizo guardar cartão para     │
│   cobrança automática do saldo     │
│                                     │
│ [Processar Entrada] [Salvar]       │
└─────────────────────────────────────┘
```

**Página de detalhes da reserva - nova aba "Pagamentos":**
- Histórico de transações
- Status de cada parcela
- Ações: "Cobrar agora", "Reagendar", "Reembolsar"

---

### 🎯 **FASE 3 - Integração Stripe**

**Componentes a criar:**
1. **`PaymentSplitForm.tsx`** - Formulário de divisão
2. **`hooks/usePaymentSplit.ts`** - Lógica de divisão
3. **Edge Functions:**
   - `create-setup-intent` - Salvar cartão
   - `process-split-payment` - Cobrar entrada + agendar saldo
   - `charge-balance` - Cobrar saldo off-session

**Fluxo técnico:**
1. Operador define divisão (20% entrada + 80% saldo)
2. Sistema cria SetupIntent + PaymentIntent para entrada
3. Cliente paga entrada e autoriza salvar cartão
4. Sistema agenda cobrança do saldo para data especificada
5. No dia: cobrança automática off-session do saldo

---

### 🎯 **FASE 4 - Webhooks Stripe**

**Endpoint:** `/api/webhooks/stripe`

**Eventos tratados:**
- `payment_intent.succeeded` → atualizar status pagamento
- `payment_intent.payment_failed` → marcar falha, enviar notificação
- `setup_intent.succeeded` → confirmar cartão salvo
- `charge.dispute.created` → alertar disputa

---

### 🎯 **FASE 5 - Jobs de Cobrança**

**Opções de implementação:**
- **Manual:** Botão "Processar cobranças de hoje" no dashboard
- **Automático:** Cron job que roda de hora em hora

**Lógica do job:**
1. Buscar parcelas vencidas hoje
2. Tentar cobrança off-session
3. Se falhar: retry em 4h, 24h, 72h
4. Após 3 falhas: enviar link manual + notificar operador

---

### 🎯 **FASE 6 - Políticas e Segurança**

**Reembolsos:**
- Reembolso total: estornar todas as parcelas pagas
- Reembolso parcial: apenas entrada (com/sem multa)
- Interface para operador escolher tipo de reembolso

**Segurança:**
- Consentimento explícito para salvar cartão
- Logs de auditoria para todas as operações
- Idempotência em todas as chamadas Stripe
- Criptografia de dados sensíveis

---

## 🔧 **Variáveis de Ambiente Necessárias**

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Notificações  
SENDGRID_API_KEY=SG...
```

---

## 📈 **Cronograma Estimado**

- **Fase 0** (Schema): 1 dia
- **Fase 1** (Menu/UI): 2 dias  
- **Fase 2** (Operador UI): 3 dias
- **Fase 3** (Stripe): 3 dias
- **Fase 4** (Webhooks): 1 dia
- **Fase 5** (Jobs): 2 dias
- **Fase 6** (Políticas): 2 dias

**Total: ~14 dias de desenvolvimento**

---

**Posso começar a implementação pela Fase 0 (Schema do banco) ou você quer ajustar algo no plano primeiro?** 🚀
