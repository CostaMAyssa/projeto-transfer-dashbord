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