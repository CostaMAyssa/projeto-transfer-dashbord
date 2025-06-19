create table public.admin_profiles (
  id uuid not null,
  full_name text null,
  role text null default 'admin'::text,
  constraint admin_profiles_pkey primary key (id),
  constraint admin_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.booking_extras (
  booking_id uuid not null,
  extra_id uuid not null,
  quantity integer not null default 1,
  price numeric(10, 2) not null,
  constraint booking_extras_pkey primary key (booking_id, extra_id),
  constraint booking_extras_booking_id_fkey foreign KEY (booking_id) references bookings (id) on delete CASCADE,
  constraint booking_extras_extra_id_fkey foreign KEY (extra_id) references extras (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.bookings (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  pickup_location text not null,
  dropoff_location text not null,
  pickup_date date not null,
  pickup_time time without time zone not null,
  distance_km numeric(10, 2) null,
  duration_min integer null,
  vehicle_id uuid null,
  flight_number text null,
  passengers integer not null default 1,
  luggage integer not null default 0,
  notes text null,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending'::text,
  payment_status text null default 'unpaid'::text,
  payment_method text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint bookings_pkey primary key (id),
  constraint bookings_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint bookings_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete set null,
  constraint bookings_payment_status_check check (
    (
      payment_status = any (
        array['unpaid'::text, 'paid'::text, 'refunded'::text]
      )
    )
  ),
  constraint bookings_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'scheduled'::text,
          'in_progress'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.bookings (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  pickup_location text not null,
  dropoff_location text not null,
  pickup_date date not null,
  pickup_time time without time zone not null,
  distance_km numeric(10, 2) null,
  duration_min integer null,
  vehicle_id uuid null,
  flight_number text null,
  passengers integer not null default 1,
  luggage integer not null default 0,
  notes text null,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending'::text,
  payment_status text null default 'unpaid'::text,
  payment_method text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint bookings_pkey primary key (id),
  constraint bookings_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint bookings_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete set null,
  constraint bookings_payment_status_check check (
    (
      payment_status = any (
        array['unpaid'::text, 'paid'::text, 'refunded'::text]
      )
    )
  ),
  constraint bookings_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'scheduled'::text,
          'in_progress'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.bookings (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  pickup_location text not null,
  dropoff_location text not null,
  pickup_date date not null,
  pickup_time time without time zone not null,
  distance_km numeric(10, 2) null,
  duration_min integer null,
  vehicle_id uuid null,
  flight_number text null,
  passengers integer not null default 1,
  luggage integer not null default 0,
  notes text null,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending'::text,
  payment_status text null default 'unpaid'::text,
  payment_method text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint bookings_pkey primary key (id),
  constraint bookings_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint bookings_vehicle_id_fkey foreign KEY (vehicle_id) references vehicles (id) on delete set null,
  constraint bookings_payment_status_check check (
    (
      payment_status = any (
        array['unpaid'::text, 'paid'::text, 'refunded'::text]
      )
    )
  ),
  constraint bookings_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'scheduled'::text,
          'in_progress'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

view geography_columns

view geometry_columns

create table public.pricing_rules (
  id uuid not null default extensions.uuid_generate_v4 (),
  origin_city text null,
  destination_city text null,
  vehicle_type text null,
  base_price numeric(10, 2) not null,
  price_per_km numeric(10, 2) null,
  currency character(3) null default 'GBP'::bpchar,
  created_at timestamp with time zone null default now(),
  constraint pricing_rules_pkey primary key (id)
) TABLESPACE pg_default;

create table public.pricing_rules (
  id uuid not null default extensions.uuid_generate_v4 (),
  origin_city text null,
  destination_city text null,
  vehicle_type text null,
  base_price numeric(10, 2) not null,
  price_per_km numeric(10, 2) null,
  currency character(3) null default 'GBP'::bpchar,
  created_at timestamp with time zone null default now(),
  constraint pricing_rules_pkey primary key (id)
) TABLESPACE pg_default;

create table public.pricing_rules (
  id uuid not null default extensions.uuid_generate_v4 (),
  origin_city text null,
  destination_city text null,
  vehicle_type text null,
  base_price numeric(10, 2) not null,
  price_per_km numeric(10, 2) null,
  currency character(3) null default 'GBP'::bpchar,
  created_at timestamp with time zone null default now(),
  constraint pricing_rules_pkey primary key (id)
) TABLESPACE pg_default;

create table public.pricing_rules (
  id uuid not null default extensions.uuid_generate_v4 (),
  origin_city text null,
  destination_city text null,
  vehicle_type text null,
  base_price numeric(10, 2) not null,
  price_per_km numeric(10, 2) null,
  currency character(3) null default 'GBP'::bpchar,
  created_at timestamp with time zone null default now(),
  constraint pricing_rules_pkey primary key (id)
) TABLESPACE pg_default;

view vw_bookings_full

create table public.zone_pricing (
  id uuid not null default gen_random_uuid (),
  origin_zone_id text not null,
  destination_zone_id text not null,
  vehicle_category_id text not null,
  price integer not null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint zone_pricing_pkey primary key (id),
  constraint zone_pricing_origin_zone_id_destination_zone_id_vehicle_cat_key unique (
    origin_zone_id,
    destination_zone_id,
    vehicle_category_id
  ),
  constraint zone_pricing_destination_zone_id_fkey foreign KEY (destination_zone_id) references zones (id),
  constraint zone_pricing_origin_zone_id_fkey foreign KEY (origin_zone_id) references zones (id),
  constraint zone_pricing_vehicle_category_id_fkey foreign KEY (vehicle_category_id) references vehicle_categories (id)
) TABLESPACE pg_default;

create index IF not exists idx_zone_pricing_origin on public.zone_pricing using btree (origin_zone_id) TABLESPACE pg_default;

create index IF not exists idx_zone_pricing_destination on public.zone_pricing using btree (destination_zone_id) TABLESPACE pg_default;

create index IF not exists idx_zone_pricing_vehicle on public.zone_pricing using btree (vehicle_category_id) TABLESPACE pg_default;

create index IF not exists idx_zone_pricing_active on public.zone_pricing using btree (is_active) TABLESPACE pg_default;

create trigger update_zone_pricing_updated_at BEFORE
update on zone_pricing for EACH row
execute FUNCTION update_updated_at_column ();

create table public.zones (
  id text not null,
  name text not null,
  description text null,
  type text not null,
  center_lat numeric(10, 8) null,
  center_lng numeric(11, 8) null,
  radius_meters integer null,
  geojson jsonb null,
  coverage_area text not null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint zones_pkey primary key (id),
  constraint zones_type_check check (
    (
      type = any (array['circular'::text, 'polygonal'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_zones_type on public.zones using btree (type) TABLESPACE pg_default;

create index IF not exists idx_zones_coverage_area on public.zones using btree (coverage_area) TABLESPACE pg_default;

create index IF not exists idx_zones_active on public.zones using btree (is_active) TABLESPACE pg_default;

create trigger update_zones_updated_at BEFORE
update on zones for EACH row
execute FUNCTION update_updated_at_column ();