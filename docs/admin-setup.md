# Configuração do Usuário Admin - AZ Transfer Dashboard

## Problema Identificado

O dashboard está acessível diretamente sem autenticação porque:
1. O layout do admin não verifica autenticação
2. Não há usuário admin criado no Supabase
3. O middleware não protege as rotas `/admin`

## Solução Implementada

### 1. Proteção de Rotas
- ✅ Layout do admin agora verifica autenticação
- ✅ Redirecionamento automático para `/admin/login` se não autenticado
- ✅ Componente AdminDashboard atualizado para usar logout do Supabase

### 2. Configuração do Supabase

#### Variáveis de Ambiente Necessárias
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://micpkdvtewsbtbrptuoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

#### Criar Usuário Admin

1. Acesse o painel do Supabase: https://micpkdvtewsbtbrptuoj.supabase.co
2. Vá para **Authentication > Users**
3. Clique em **"Add User"**
4. Preencha:
   - **Email**: admin@aztransfer.com
   - **Password**: admin123456 (ou uma senha segura)
   - **Email Confirm**: ✅ (marcar como confirmado)

#### Configurar Perfil Admin

Execute no SQL Editor do Supabase:

```sql
-- Criar perfil admin para o usuário
INSERT INTO admin_profiles (id, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@aztransfer.com'),
  'Administrador AZ Transfer',
  'admin'
);
```

### 3. Teste da Autenticação

1. Acesse: https://dashboard.aztransfergroup.com/admin
2. Deve redirecionar para: https://dashboard.aztransfergroup.com/admin/login
3. Faça login com:
   - Email: admin@aztransfer.com
   - Senha: admin123456
4. Deve redirecionar para o dashboard

### 4. Funcionalidades Implementadas

- ✅ Verificação de autenticação no layout
- ✅ Redirecionamento automático para login
- ✅ Logout funcional via Supabase
- ✅ Proteção de todas as rotas `/admin/*`
- ✅ Loading states durante verificação

### 5. Próximos Passos

1. Criar o usuário admin no Supabase
2. Configurar as variáveis de ambiente
3. Testar o fluxo de autenticação
4. Deploy das alterações para produção

## Comandos para Deploy

```bash
# Build do projeto
npm run build

# Deploy para VPS
# (usar o script de deploy existente)
```

## Troubleshooting

### Erro de Conexão com Supabase
- Verificar se as variáveis de ambiente estão corretas
- Confirmar se o projeto Supabase está ativo

### Usuário não consegue fazer login
- Verificar se o email está confirmado no Supabase
- Confirmar se a senha está correta
- Verificar se o perfil admin foi criado

### Dashboard ainda acessível sem login
- Verificar se o build foi atualizado
- Confirmar se as alterações foram deployadas
- Limpar cache do navegador 

Excelente pergunta! Você está certo, preciso mapear **como essas funcionalidades se conectam** para decidir se ficam na mesma área ou separadas. Deixe-me analisar o fluxo completo:

## 🔄 **FLUXO COMPLETO DE NEGÓCIO:**

```
1. CONTATO → 2. ORÇAMENTO → 3. ACEITE → 4. RESERVA → 5. PAGAMENTO → 6. VOUCHER
```

### **Análise da Conectividade:**

1. **Orçamentos** → Geram **Reservas**
2. **Reservas** → Geram **Pagamentos**  
3. **Pagamentos** → Geram **Vouchers**

**Tudo está conectado!** 🎯

---

## 💡 **RECOMENDAÇÃO: 2 Áreas Distintas**

### 🎯 **ÁREA 1: "Orçamentos" (Nova seção no menu)**
**Localização:** Entre "Drivers" e "Pricing"
- **Subpáginas:**
  - `/admin/quotes` - Lista de orçamentos
  - `/admin/quotes/new` - Criar orçamento
  - `/admin/quotes/[id]` - Detalhes/Editar

### 💳 **ÁREA 2: "Pagamentos" (Já criada)**
**Localização:** Entre "Pricing" e "Reports"
- **Subpáginas já criadas:**
  - `/admin/payments` - Dashboard
  - `/admin/payments/schedules` - Cronograma  
  - `/admin/payments/settings` - Configurações

### 📋 **ÁREA 3: "Trips/Bookings" (Existing - expandir)**
**Localização:** Já existe
- **Adicionar:** Aba "Pagamentos" nos detalhes da reserva
- **Adicionar:** Aba "Voucher" nos detalhes da reserva

---

## 🔗 **COMO ELAS SE CONECTAM:**

### **1. Na área Orçamentos:**
```typescript
// Botão "Converter em Reserva" → Redireciona para /admin/bookings/new
// com dados do orçamento pré-preenchidos
```

### **2. Na área Trips/Bookings:**
```typescript
// Nova aba "Pagamentos" → Mostra divisão de parcelas
// Nova aba "Voucher" → Geração/download do voucher
// Link para origem: "Criado a partir do orçamento #123"
```

### **3. Na área Pagamentos:**
```typescript
// Tabela mostra: booking_id com link para /admin/bookings/[id]
// Filtro: "Ver apenas de orçamentos aceitos"
```

---

## 📍 **PLANO REVISADO:**

### **FASE 1 - Sistema de Orçamentos (3 dias)**
- ✅ Nova seção "Orçamentos" no menu
- ✅ CRUD de orçamentos
- ✅ Páginas públicas `/quote/[id]`
- ✅ Conversão Orçamento → Reserva

### **FASE 2 - Páginas Públicas de Reservas (1 dia)**  
- ✅ Páginas públicas `/booking/[id]`
- ✅ Status em tempo real

### **FASE 3 - Integração Pagamentos + Vouchers (3 dias)**
- ✅ Sistema de pagamentos divididos (já planejado)
- ✅ Geração automática de vouchers
- ✅ Conexão entre todas as áreas

**Total: 7 dias úteis**

---

## 🎯 **ESTRUTURA FINAL DO MENU:**

```
📍 Home
📅 Trips (expandido com abas Pagamentos/Voucher)
🚗 Cars  
👥 Drivers
💰 Orçamentos (NOVO)
💲 Pricing
💳 Pagamentos (já criado)
📊 Reports
⚙️  Settings
```

**Essa estrutura faz sentido para você?** As áreas ficam organizadas mas conectadas pelo fluxo de negócio! 🚀
