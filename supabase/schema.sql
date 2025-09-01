-- Esquema do Banco de Dados - AZ Transfer Booking
-- Arquivo: supabase/schema.sql

create extension if not exists "uuid-ossp";

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de veículos
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

-- Tabela de motoristas
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

-- Tabela de extras
create table extras (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- =====================================================
-- NOVA TABELA: DADOS DE VOOS
-- =====================================================

-- Tabela para armazenar dados de voos da API FlightAware
create table flight_data (
  id uuid primary key default uuid_generate_v4(),
  flight_number varchar(10) not null,
  airline_code varchar(3) not null,
  airline_name text,
  origin_airport varchar(4) not null,
  destination_airport varchar(4) not null,
  scheduled_departure timestamptz,
  actual_departure timestamptz,
  scheduled_arrival timestamptz,
  actual_arrival timestamptz,
  estimated_arrival timestamptz,
  flight_status varchar(20) check (flight_status in ('scheduled', 'active', 'landed', 'cancelled', 'delayed')),
  gate varchar(10),
  terminal varchar(10),
  aircraft_type varchar(20),
  -- Dados adicionais para cálculo de pickup
  is_domestic boolean default true,
  suggested_pickup_time timestamptz,
  service_type varchar(10) check (service_type in ('arrival', 'departure')),
  -- Metadados
  api_last_updated timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para performance
create index idx_flight_data_flight_number on flight_data(flight_number);
create index idx_flight_data_status on flight_data(flight_status);
create index idx_flight_data_airports on flight_data(origin_airport, destination_airport);

-- =====================================================
-- TABELA DE RESERVAS (MODIFICADA)
-- =====================================================

-- Tabela principal de reservas
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
  driver_id uuid references drivers(id) on delete set null,
  passengers int not null default 1,
  luggage int default 0,
  -- NOVOS CAMPOS PARA INTEGRAÇÃO COM VOOS
  flight_data_id uuid references flight_data(id) on delete set null,
  flight_number varchar(10),
  is_flight_monitored boolean default false,
  original_pickup_time time, -- horário original antes da sugestão
  pickup_time_source varchar(20) default 'manual' check (pickup_time_source in ('manual', 'flight_suggested', 'flight_auto')),
  -- Campos existentes
  notes text,
  status text default 'pending' check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  total_amount numeric(10,2) default 0,
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de extras por reserva
create table booking_extras (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade,
  extra_id uuid references extras(id) on delete cascade,
  quantity int default 1,
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Índices para performance
create index idx_bookings_user_id on bookings(user_id);
create index idx_bookings_flight_data on bookings(flight_data_id);
create index idx_bookings_flight_number on bookings(flight_number);
create index idx_bookings_status on bookings(status);
create index idx_bookings_date on bookings(pickup_date);

-- =====================================================
-- FUNÇÕES RPC
-- =====================================================

-- Função para criar reserva com dados de voo
create or replace function create_booking_with_flight(
  p_pickup_location text,
  p_dropoff_location text,
  p_pickup_date date,
  p_pickup_time time,
  p_vehicle_id uuid,
  p_passengers int,
  p_luggage int,
  p_flight_number text default null,
  p_flight_data_id uuid default null,
  p_notes text default null,
  p_extras jsonb default '[]'::jsonb
) returns uuid as $$
declare 
  new_booking_id uuid;
  suggested_time time;
begin
  -- Se há dados de voo, usar o horário sugerido
  if p_flight_data_id is not null then
    select 
      case 
        when service_type = 'arrival' then suggested_pickup_time::time
        else p_pickup_time
      end
    into suggested_time
    from flight_data 
    where id = p_flight_data_id;
    
    if suggested_time is not null then
      p_pickup_time := suggested_time;
    end if;
  end if;

  -- Criar a reserva
  insert into bookings(
    user_id, pickup_location, dropoff_location, pickup_date, pickup_time, 
    vehicle_id, passengers, luggage, flight_number, flight_data_id,
    is_flight_monitored, pickup_time_source, notes, total_amount
  )
  values (
    auth.uid(), p_pickup_location, p_dropoff_location, p_pickup_date, p_pickup_time,
    p_vehicle_id, p_passengers, p_luggage, p_flight_number, p_flight_data_id,
    (p_flight_data_id is not null), 
    case when p_flight_data_id is not null then 'flight_suggested' else 'manual' end,
    p_notes, 0
  )
  returning id into new_booking_id;

  -- Inserir extras se fornecidos
  if jsonb_array_length(p_extras) > 0 then
    insert into booking_extras(booking_id, extra_id, quantity, price)
    select 
      new_booking_id, 
      (item->>'id')::uuid, 
      (item->>'quantity')::int, 
      (item->>'price')::numeric
    from jsonb_array_elements(p_extras) as item;
  end if;

  return new_booking_id;
end;
$$ language plpgsql security definer;

-- Função para atualizar dados de voo
create or replace function update_flight_data(
  p_flight_data_id uuid,
  p_flight_status text,
  p_actual_departure timestamptz default null,
  p_actual_arrival timestamptz default null,
  p_estimated_arrival timestamptz default null,
  p_gate text default null,
  p_terminal text default null
) returns boolean as $$
begin
  update flight_data set
    flight_status = p_flight_status,
    actual_departure = coalesce(p_actual_departure, actual_departure),
    actual_arrival = coalesce(p_actual_arrival, actual_arrival),
    estimated_arrival = coalesce(p_estimated_arrival, estimated_arrival),
    gate = coalesce(p_gate, gate),
    terminal = coalesce(p_terminal, terminal),
    api_last_updated = now(),
    updated_at = now()
  where id = p_flight_data_id;
  
  return found;
end;
$$ language plpgsql security definer;

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
alter table flight_data enable row level security;
alter table bookings enable row level security;
alter table booking_extras enable row level security;
alter table vehicles enable row level security;
alter table drivers enable row level security;
alter table extras enable row level security;

-- Políticas para flight_data
create policy "flight_data_select_all" on flight_data for select using (true);
create policy "flight_data_insert_authenticated" on flight_data for insert with check (auth.role() = 'authenticated');
create policy "flight_data_update_service_role" on flight_data for update using (auth.role() = 'service_role');

-- Políticas para bookings
create policy "bookings_select_own" on bookings for select using (auth.uid() = user_id);
create policy "bookings_insert_own" on bookings for insert with check (auth.uid() = user_id);
create policy "bookings_update_own" on bookings for update using (auth.uid() = user_id);

-- Políticas para booking_extras
create policy "booking_extras_select_own" on booking_extras for select using (
  exists (select 1 from bookings where bookings.id = booking_extras.booking_id and bookings.user_id = auth.uid())
);
create policy "booking_extras_insert_own" on booking_extras for insert with check (
  exists (select 1 from bookings where bookings.id = booking_extras.booking_id and bookings.user_id = auth.uid())
);

-- Políticas para dados públicos (vehicles, drivers, extras)
create policy "vehicles_select_all" on vehicles for select using (true);
create policy "drivers_select_all" on drivers for select using (true);
create policy "extras_select_all" on extras for select using (true);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_flight_data_updated_at before update on flight_data
  for each row execute function update_updated_at_column();

create trigger update_bookings_updated_at before update on bookings
  for each row execute function update_updated_at_column();

create trigger update_vehicles_updated_at before update on vehicles
  for each row execute function update_updated_at_column();

create trigger update_drivers_updated_at before update on drivers
  for each row execute function update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir alguns veículos de exemplo
insert into vehicles (name, type, passengers, luggage, status) values
  ('Mercedes Sprinter', 'minivan', 8, 8, 'active'),
  ('Toyota Hiace', 'van', 12, 10, 'active'),
  ('BMW X5', 'suv', 4, 4, 'active'),
  ('Audi A6', 'sedan', 3, 3, 'active');

-- Inserir alguns extras de exemplo
insert into extras (name, description, price) values
  ('Cadeirinha Infantil', 'Cadeirinha de segurança para crianças', 15.00),
  ('WiFi Premium', 'Internet de alta velocidade durante a viagem', 10.00),
  ('Água e Snacks', 'Kit de cortesia com água e petiscos', 8.00),
  ('Parada Extra', 'Parada adicional durante o trajeto', 25.00);