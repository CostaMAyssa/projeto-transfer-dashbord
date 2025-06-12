# Plano de Backend – AZ Transfer Booking

## 1. Visão Geral
O backend será **serverless** baseado em:

* Supabase (PostgreSQL + Auth + Storage + Edge Functions)
* Next.js 14 (API Routes/Route Handlers) utilizando Vercel Functions
* `@supabase/supabase-js` como client universal
* SWR/React Query no front para consumo

Benefícios:
1. Escalabilidade automática (model *pay-as-you-go*)
2. Menor latência para o usuário (edge + CDN)
3. Segurança centralizada via RLS
4. Menor _Time-to-Market_ (infra gerenciada)

---

## 2. Variáveis de Ambiente (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://micpkdvtewsbtbrptuoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-key>   # Apenas usado em scripts seguros (CI/crons)
BOOKING_WEBHOOK_SECRET=<uuid-v4>
```

---

## 3. Esquema do Banco (SQL)
```sql
-- Arquivo: supabase/schema.sql
create extension if not exists "uuid-ossp";

-- 3.1 TABELAS PRINCIPAIS -------------------------------------
create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null,
  passengers int not null,
  luggage int not null,
  year int,
  license_plate text unique,
  status text not null check (status in ('active','maintenance','inactive')),
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table drivers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text,
  email text,
  license_number text,
  status text default 'active',
  avatar_url text,
  vehicle_id uuid references vehicles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table extras (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  pickup_location text not null,
  dropoff_location text not null,
  pickup_date date not null,
  pickup_time time not null,
  distance_km numeric(10,2),
  duration_min int,
  vehicle_id uuid references vehicles(id) on delete set null,
  flight_number text,
  passengers int not null default 1,
  luggage int not null default 0,
  notes text,
  total_amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','scheduled','in_progress','completed','cancelled')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  payment_method text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table booking_extras (
  booking_id uuid references bookings(id) on delete cascade,
  extra_id uuid references extras(id) on delete cascade,
  quantity int not null default 1,
  price numeric(10,2) not null,
  primary key (booking_id, extra_id)
);

create table pricing_rules (
  id uuid primary key default uuid_generate_v4(),
  origin_city text,
  destination_city text,
  vehicle_type text,
  base_price numeric(10,2) not null,
  price_per_km numeric(10,2),
  currency char(3) default 'GBP',
  created_at timestamptz default now()
);

create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'admin'
);

-- 3.2 VIEWS ---------------------------------------------------
create or replace view vw_bookings_full as
select b.*, v.name as vehicle_name, d.full_name as driver_name
from bookings b
left join vehicles v on v.id = b.vehicle_id
left join drivers d on d.vehicle_id = v.id;

-- 3.3 RLS POLICIES -------------------------------------------
alter table vehicles enable row level security;
alter table extras enable row level security;
alter table pricing_rules enable row level security;
alter table bookings enable row level security;
alter table booking_extras enable row level security;

-- Público lê veículos/extras
create policy "public_read_vehicles" on vehicles
  for select using ( true );
create policy "public_read_extras" on extras
  for select using ( true );
create policy "public_read_pricing" on pricing_rules
  for select using ( true );

-- Reservas: usuário vê/aplica apenas as suas
create policy "bookings_by_owner" on bookings
  for all using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- Booking_extras segue bookings
create policy "booking_extras_by_owner" on booking_extras
  for all using (
    exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid())
  );

-- Admin role tem acesso total (via JWT custom claim "role = admin")
```

---

## 4. Funções RPC (Edge Functions)
```sql
-- Função para criar reserva + extras de forma atômica
create or replace function create_booking(
  p_pickup_location text,
  p_dropoff_location text,
  p_pickup_date date,
  p_pickup_time time,
  p_vehicle_id uuid,
  p_passengers int,
  p_luggage int,
  p_flight_number text,
  p_notes text,
  p_extras jsonb
) returns uuid as $$
declare new_booking_id uuid;
begin
  insert into bookings(user_id, pickup_location, dropoff_location, pickup_date, pickup_time, vehicle_id, passengers, luggage, flight_number, notes, total_amount)
  values (auth.uid(), p_pickup_location, p_dropoff_location, p_pickup_date, p_pickup_time, p_vehicle_id, p_passengers, p_luggage, p_flight_number, p_notes, 0)
  returning id into new_booking_id;

  -- insere extras
  insert into booking_extras(booking_id, extra_id, quantity, price)
  select new_booking_id, (item->>'id')::uuid, (item->>'quantity')::int, (item->>'price')::numeric
  from jsonb_array_elements(p_extras) as item;

  return new_booking_id;
end;$$ language plpgsql security definer;
```

Edge Function TypeScript (exemplo): `supabase/functions/webhook-booking.ts` – recebe webhooks de pagamento, marca pagamento como `paid`.

---

## 5. APIs (Next.js Route Handlers)
* `POST /api/auth/login` → redirect para Supabase OAuth ou email-link
* `POST /api/bookings` → chama `create_booking`
* `GET  /api/bookings` → passa JWT; retorna lista paginada
* `GET  /api/bookings/:id`
* `PATCH /api/bookings/:id/status` → admin only
* `GET  /api/vehicles` / `GET /api/extras` (público cacheado no ISR)

Todas as rotas usam o wrapper `supabaseAdmin` (service role) apenas quando necessário (admin e webhooks).

---

## 6. Estrutura de Pastas Next
```
│
├─ lib/
│  ├─ supabase.ts          # cliente público (anon key)
│  └─ supabaseAdmin.ts     # service-role, só em backend
│
├─ app/
│  └─ api/
│     ├─ bookings/route.ts   # GET, POST
│     └─ bookings/[id]/route.ts  # GET, PATCH
│
├─ supabase/
│  ├─ schema.sql
│  └─ functions/
│     └─ webhook-booking.ts
│
└─ docs/
    └─ plano-backend.md   # ESTE DOCUMENTO
```

---

## 7. CI/CD
* **GitHub Actions**
  * Lint + Teste → `pnpm lint && pnpm test`
  * `supabase db diff` para detectar migrações → `supabase db push`
  * Deploy Vercel após sucesso.

* **Previews de DB**: cada PR executa `supabase db reset --linked` gerando banco isolado.

---

## 8. Segurança & Boas Práticas
1. **RLS sempre ativado**.
2. Service role key guardada só em `Vercel > Environment Variables (Encrypted)`.
3. Logs de acesso via Supabase Studio (Audit).
4. Webhook de pagamento assinado com `BOOKING_WEBHOOK_SECRET`.
5. Política CORS restrita aos domínios da AZ Transfer.

---

## 9. Roadmap Futuro
* Integração Stripe (checkout.session.completed → update bookings)
* Notificações em tempo real com Supabase Realtime → painel admin live
* Cache CDN para `/api/vehicles` e `/api/extras` (stale-while-revalidate)
* Internacionalização de currency/locale no pricing_rules
* Worker de tarifa dinâmica (combustível, distância, surge)

---

> Qualquer dúvida ou sugestão, abra uma *issue* ou fale com a equipe de backend. 