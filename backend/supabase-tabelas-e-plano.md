# Documentação de Tabelas e Plano de Migração – AZ Transfer

> Ambiente Supabase já provisionado em https://micpkdvtewsbtbrptuoj.supabase.co
>
> Chave `anon`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTc3MzksImV4cCI6MjA2NTMzMzczOX0.ZT-ahqgL0Zc1GxAzUEYCL-uFMecnWy0L3ZBIROamtwA

---

## 1. Dicionário de Dados

### 1.1 vehicles
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | uuid | PK, default uuid_generate_v4() | Identificador único do veículo |
| name | text | not null | Modelo + marca exibido ao cliente |
| type | text | not null | Business Class, First Class, Van/SUV... |
| passengers | int | not null | Nº máximo de passageiros |
| luggage | int | not null | Nº máximo de malas |
| year | int | – | Ano de fabricação |
| license_plate | text | unique | Placa para controle interno |
| status | text | check(active\|maintenance\|inactive) | Situação operacional |
| image_url | text | – | URL de imagem (Storage) |
| created_at | timestamptz | default now() | Timestamp criação |
| updated_at | timestamptz | default now() | Timestamp update |

### 1.2 drivers
| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | uuid | PK | Identificador |
| full_name | text | not null |
| phone | text | – |
| email | text | – |
| license_number | text | – |
| status | text | default 'active' |
| avatar_url | text | – |
| vehicle_id | uuid | FK → vehicles(id) | Veículo principal alocado |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 1.3 extras (serviços adicionais)
| Coluna | Tipo | | |
| id | uuid PK | … |
| name | text not null |
| description | text |
| price | numeric(10,2) not null |
| created_at | timestamptz default now() |

### 1.4 pricing_rules
| origin_city | text | null = qualquer origem |
| destination_city | text |
| vehicle_type | text |
| base_price | numeric(10,2) |
| price_per_km | numeric(10,2) |
| currency | char(3) default 'GBP' |
| created_at | timestamptz |

### 1.5 bookings
| Field | Tipo | Comentário |
| id | uuid PK |
| user_id | uuid FK → auth.users(id) |
| pickup_location / dropoff_location | text |
| pickup_date / time | date / time |
| distance_km / duration_min | numeric / int |
| vehicle_id | uuid FK |
| flight_number | text |
| passengers / luggage | int |
| notes | text |
| total_amount | numeric(10,2) |
| status | text('pending','scheduled','in_progress','completed','cancelled') |
| payment_status | text('unpaid','paid','refunded') |
| payment_method | text |
| created_at / updated_at | timestamptz |

### 1.6 booking_extras (tabela ponte)
| booking_id | uuid PK part 1 |
| extra_id   | uuid PK part 2 |
| quantity   | int |
| price      | numeric(10,2) valor unitário no ato |

### 1.7 admin_profiles
| id | uuid PK = auth.users.id |
| full_name | text |
| role | text default 'admin' |

---

## 2. Relacionamentos (ERD simplificado)

```
users ─┬─< bookings >─┬─ vehicles
       │             └─< booking_extras >─ extras
       └─ admin_profiles

vehicles ─< drivers (opcional 1-para-N)
```

Legenda: `─<` (1-para-N) / `─┬─` (pivot).

---

## 3. Políticas RLS
1. Tabelas `vehicles`, `extras`, `pricing_rules` – leitura pública.
2. `bookings` e `booking_extras` – somente dono (`auth.uid()`).
3. Usuário com claim `role = admin` ignora políticas via `supabaseAdmin`.

---

## 4. Plano de Migração do Front-end (Mock → Dados Reais)

| Fase | Descrição | Arquivos Impactados |
|------|-----------|---------------------|
| 1 | Criar cliente Supabase compartilhado em `lib/supabase.ts` | Novo arquivo |
| 2 | Refatorar *hooks* de dados (SWR/React Query): `useVehicles`, `useDrivers`, `useBookings`, `usePricing`, `useExtras` | `hooks/` (novo) |
| 3 | Substituir `mock*` nos componentes/páginas admin por consultas | `app/admin/**/page.tsx` |
| 4 | Implementar formulários **Add/Edit/Delete** utilizando Mutations (RLS valida) | Mesmos arquivos |
| 5 | Criar páginas públicas que consomem `/api/vehicles` + `/api/extras` (ISR 60s) | `app/**` |
| 6 | Ajustar deploy ENV vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) no Vercel | – |
| 7 | QA completo com seed real | — |

### 4.1 Exemplo de Hook
```ts
// lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// hooks/useVehicles.ts
import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
export function useVehicles() {
  return useSWR('vehicles', async () => {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;
    return data;
  });
}
```

---

## 5. Próximos Passos
1. **Gerar seeds** para `vehicles`, `drivers`, `extras`, `pricing_rules` via CSV e `supabase import`.
2. Configurar **Edge Function** `stripe-webhook` para marcar `payment_status`.
3. Implementar **Realtime** (canal `bookings`) para atualizar painel admin sem refresh.
4. Criar **tests e2e** (Playwright) simulando reserva.

---

## 6. Referência Rápida de Comandos
```bash
# Migração local
supabase db push

# Importação CSV
supabase db import ./seed/vehicles.csv --table vehicles

# Deploy Edge Functions
supabase functions deploy webhook-booking --import-map
```

---

Caso algo não esteja claro, abrir *issue* ou chamar @backend-team no Slack. 