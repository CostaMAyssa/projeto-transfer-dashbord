-- Tabela para armazenar tokens do Google Calendar por usuário admin (opcionalmente global)
create table if not exists integrations_google (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  access_token text not null,
  refresh_token text null,
  expiry_date timestamptz null,
  scope text null,
  token_type text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índice único por usuário (permite apenas uma conexão por usuário)
create unique index if not exists integrations_google_user_unique on integrations_google(user_id);

-- Políticas RLS (ajuste conforme necessidade)
alter table integrations_google enable row level security;

-- Permitir que apenas o service role (backend) acesse os tokens
-- No Supabase, você deve criar uma policy que bloqueie todos os selects para anon/authenticated
-- e somente funções seguras do backend (service role) manipulem esses dados.