# Esquema de Banco de Dados - Sistema de Transfer

## Visão Geral

Este documento descreve o esquema completo do banco de dados do sistema de transfer, incluindo todas as tabelas, suas colunas, tipos de dados e onde cada campo é utilizado no sistema.

## Estrutura das Tabelas

### Tabelas Principais

#### 1. Autenticação e Administração
- `admin_profiles` - Perfis de administradores

#### 2. Veículos e Motoristas
- `vehicles` - Cadastro de veículos
- `vehicle_categories` - Categorias de veículos
- `drivers` - Cadastro de motoristas

#### 3. Reservas e Orçamentos
- `bookings` - Reservas confirmadas
- `quotes` - Orçamentos/cotações
- `reservations` - Sistema de reservas administrativo

#### 4. Clientes e Relacionamento
- `clients` - Cadastro de clientes
- `client_history` - Histórico de clientes
- `client_interactions` - Interações com clientes

#### 5. Serviços e Preços
- `extras` - Serviços adicionais
- `booking_extras` - Relacionamento reservas-extras
- `pricing_rules` - Regras de precificação
- `zone_pricing` - Preços por zona
- `zones` - Definição de zonas

#### 6. Pagamentos
- `payments` - Registros de pagamentos
- `payment_installments` - Parcelas de pagamento
- `payment_transactions` - Transações de pagamento

#### 7. Tabelas do Sistema
- `spatial_ref_sys` - Sistema de referência espacial
- `geography_columns` - Colunas geográficas
- `geometry_columns` - Colunas de geometria
- `vw_bookings_full` - View completa de reservas
- `zone_pricing_bidirectional` - View de preços bidirecionais

## Lista Completa das 23 Tabelas/Views

Baseado nas imagens do Supabase Table Editor:

1. `admin_profiles` ⚠️ (Unrestricted)
2. `booking_extras`
3. `bookings`
4. `client_history` ⚠️ (Unrestricted)
5. `client_interactions` ⚠️ (Unrestricted)
6. `clients` ⚠️ (Unrestricted)
7. `drivers` ⚠️ (Unrestricted)
8. `extras`
9. `geography_columns`
10. `geometry_columns`
11. `payment_installments`
12. `payment_transactions`
13. `payments`
14. `pricing_rules`
15. `quotes`
16. `reservations` ⚠️ (Unrestricted)
17. `spatial_ref_sys` ⚠️ (Unrestricted)
18. `vehicle_categories` ⚠️ (Unrestricted)
19. `vehicles`
20. `vw_bookings_full` ⚠️ (Unrestricted)
21. `zone_pricing` ⚠️ (Unrestricted)
22. `zone_pricing_bidirectional` ⚠️ (Unrestricted)
23. `zones` ⚠️ (Unrestricted)

**Legenda:**
- ⚠️ (Unrestricted) = Tabelas sem políticas RLS ativas
- ✅ = Tabelas com políticas RLS configuradas

---

## Auditoria Detalhada das Tabelas e Colunas

### 📋 admin_profiles
**Utilização**: Controle de acesso administrativo - usado em `hooks/useAdmin.ts`, políticas RLS e autenticação

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | null | Chave primária, referência para auth.users, usado em políticas RLS |
| full_name | text | YES | null | Exibição do nome do admin na interface |
| role | text | YES | 'admin' | Controle de permissões, verificado nas políticas RLS |

create table public.admin_profiles (
  id uuid not null,
  full_name text null,
  role text null default 'admin'::text,
  constraint admin_profiles_pkey primary key (id),
  constraint admin_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

### 🔗 booking_extras
**Utilização**: Tabela de relacionamento entre reservas e extras - usada em `hooks/useBookings.ts` e cálculos de preço

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| booking_id | uuid | NO | null | FK para bookings, usado para vincular extras às reservas |
| extra_id | uuid | NO | null | FK para extras, referencia o serviço adicional |
| quantity | integer | NO | 1 | Quantidade do extra solicitado, usado em cálculos |
| price | numeric | NO | null | Preço unitário do extra no momento da reserva |

### 📅 bookings
**Utilização**: Tabela principal de reservas - usada em `hooks/useBookings.ts`, `app/admin/bookings/`, dashboard e relatórios

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | uuid_generate_v4() | Chave primária, usado em todas as referências |
| user_id | uuid | YES | null | FK para auth.users, identifica o cliente |
| pickup_location | text | NO | null | Endereço de origem, exibido na interface |
| dropoff_location | text | NO | null | Endereço de destino, exibido na interface |
| pickup_date | date | NO | null | Data da viagem, usado em filtros e ordenação |
| pickup_time | time | NO | null | Horário da viagem, exibido na interface |
| distance_km | numeric | YES | null | Distância calculada, usado em relatórios |
| duration_min | integer | YES | null | Duração estimada, usado em planejamento |
| vehicle_id | uuid | YES | null | FK para vehicles, define o veículo alocado |
| flight_number | text | YES | null | Número do voo, exibido nos detalhes |
| passengers | integer | NO | 1 | Número de passageiros, usado em validações |
| luggage | integer | NO | 0 | Quantidade de bagagem, usado em validações |
| notes | text | YES | null | Observações, exibidas nos detalhes |
| total_amount | numeric | NO | null | Valor total, usado em relatórios financeiros |
| status | text | NO | 'pending' | Status da reserva, usado em filtros e dashboard |
| payment_status | text | YES | 'unpaid' | Status do pagamento, usado em controle financeiro |
| payment_method | text | YES | null | Método de pagamento, usado em relatórios |
| created_at | timestamp | YES | now() | Data de criação, usado em ordenação |
| updated_at | timestamp | YES | now() | Data de atualização, usado em auditoria |
| booking_type | text | YES | 'one-way' | Tipo de reserva (one-way, round-trip, hourly) |
| pickup_location_json | jsonb | YES | null | Dados estruturados do local de origem |
| dropoff_location_json | jsonb | YES | null | Dados estruturados do local de destino |
| luggage_json | jsonb | YES | '{"large": 0, "small": 0}' | Detalhes estruturados da bagagem |
| vehicle_json | jsonb | YES | null | Dados do veículo no momento da reserva |
| extras | jsonb | YES | '[]' | Lista de extras selecionados |
| round_trip_data | jsonb | YES | null | Dados específicos de viagem de ida e volta |
| hourly_data | jsonb | YES | null | Dados específicos de serviço por hora |
| passenger_details | jsonb | YES | null | Detalhes dos passageiros |
| payment_details | jsonb | YES | null | Detalhes do pagamento |
| vehicle_price | numeric | YES | null | Preço do veículo no momento da reserva |
| extras_price | numeric | YES | null | Preço total dos extras |
| currency | varchar | YES | 'USD' | Moeda utilizada na transação |
| reservation_id | varchar | YES | null | ID de reserva externa |
| payment_intent_id | varchar | YES | null | ID do intent de pagamento (Stripe) |

### 📊 client_history
**Utilização**: Histórico de ações dos clientes - usado para auditoria e relatórios

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| client_id | uuid | NO | null | FK para clients, identifica o cliente |
| action_type | varchar | NO | null | Tipo de ação realizada |
| description | text | YES | null | Descrição detalhada da ação |
| metadata | jsonb | YES | null | Dados adicionais da ação |
| created_at | timestamp | YES | now() | Data da ação |
| created_by | uuid | YES | null | Usuário que registrou a ação |

### 💬 client_interactions
**Utilização**: Registro de interações com clientes - usado em `backend/create-client-interactions-table.sql` e CRM

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | serial | NO | null | Chave primária |
| client_id | integer | NO | null | FK para clients, identifica o cliente |
| interaction_type | varchar | NO | null | Tipo: 'quote', 'reservation', 'call', 'email', 'note' |
| reference_id | uuid | YES | null | ID do quote ou reserva relacionado |
| status | varchar | YES | null | Status: draft, sent, accepted, rejected |
| description | text | YES | null | Descrição da interação |
| created_at | timestamp | NO | CURRENT_TIMESTAMP | Data da interação |
| created_by | varchar | YES | null | Usuário que registrou |

### 👥 clients
**Utilização**: Cadastro de clientes - usado em `backend/create-clients-table.sql` e sistema CRM

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | uuid_generate_v4() | Chave primária |
| full_name | text | NO | null | Nome completo, exibido na interface |
| email | text | NO | null | Email do cliente, usado para comunicação |
| phone | text | NO | null | Telefone principal |
| whatsapp | text | YES | null | WhatsApp para contato |
| address | text | YES | null | Endereço residencial |
| company | text | YES | null | Empresa do cliente |
| position | text | YES | null | Cargo na empresa |
| tags | text | YES | null | Tags para categorização |
| billing_address | text | YES | null | Endereço de cobrança |
| cpf | text | YES | null | CPF ou documento |
| status | text | NO | 'lead' | Status: lead, active, inactive, prospect |
| notes | text | YES | null | Observações sobre o cliente |
| created_at | timestamp | YES | now() | Data de cadastro |
| updated_at | timestamp | YES | now() | Data de atualização |

### 🚗 drivers
**Utilização**: Cadastro de motoristas - usado em `hooks/useDrivers.ts` e alocação de veículos

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | uuid_generate_v4() | Chave primária |
| name | text | NO | null | Nome do motorista |
| email | text | NO | null | Email para comunicação |
| phone | text | NO | null | Telefone de contato |
| license_number | text | NO | null | Número da carteira de motorista |
| license_expiry | date | YES | null | Validade da carteira |
| status | text | NO | 'active' | Status: active, inactive, on_leave |
| avatar_url | text | YES | null | URL da foto do motorista |
| vehicle_id | uuid | YES | null | FK para vehicles, veículo principal |
| created_at | timestamp | YES | now() | Data de cadastro |
| updated_at | timestamp | YES | now() | Data de atualização |

### ➕ extras
**Utilização**: Serviços adicionais - usado em `hooks/useExtras.ts` e cálculo de preços

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | uuid_generate_v4() | Chave primária |
| name | text | NO | null | Nome do serviço extra |
| description | text | YES | null | Descrição detalhada |
| price | numeric | NO | null | Preço do serviço |
| is_active | boolean | YES | true | Se está disponível para seleção |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

### 🌍 geography_columns
**Utilização**: Metadados de colunas geográficas - usado pelo PostGIS

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| f_table_catalog | name | YES | null | Catálogo da tabela |
| f_table_schema | name | YES | null | Schema da tabela |
| f_table_name | name | YES | null | Nome da tabela |
| f_geography_column | name | YES | null | Nome da coluna geográfica |
| coord_dimension | integer | YES | null | Dimensão das coordenadas |
| srid | integer | YES | null | Sistema de referência espacial |
| type | text | YES | null | Tipo de geometria |

### 📐 geometry_columns
**Utilização**: Metadados de colunas de geometria - usado pelo PostGIS

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| f_table_catalog | varchar | YES | null | Catálogo da tabela |
| f_table_schema | varchar | YES | null | Schema da tabela |
| f_table_name | varchar | YES | null | Nome da tabela |
| f_geometry_column | varchar | YES | null | Nome da coluna de geometria |
| coord_dimension | integer | YES | null | Dimensão das coordenadas |
| srid | integer | YES | null | Sistema de referência espacial |
| type | varchar | YES | null | Tipo de geometria |

### 💰 payment_installments
**Utilização**: Parcelas de pagamento - usado no sistema de pagamentos parcelados

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| payment_id | uuid | NO | null | FK para payments |
| installment_number | integer | NO | null | Número da parcela |
| amount | numeric | NO | null | Valor da parcela |
| due_date | date | NO | null | Data de vencimento |
| status | varchar | YES | 'pending' | Status: pending, paid, overdue |
| paid_at | timestamp | YES | null | Data do pagamento |
| stripe_payment_intent_id | varchar | YES | null | ID do Stripe |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

### 💳 payment_transactions
**Utilização**: Transações de pagamento - usado para auditoria financeira

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| payment_id | uuid | NO | null | FK para payments |
| transaction_type | varchar | NO | null | Tipo: charge, refund, partial_refund |
| amount | numeric | NO | null | Valor da transação |
| status | varchar | NO | null | Status da transação |
| stripe_transaction_id | varchar | YES | null | ID da transação no Stripe |
| gateway_response | jsonb | YES | null | Resposta do gateway |
| failure_reason | text | YES | null | Motivo da falha |
| card_last4 | varchar | YES | null | Últimos 4 dígitos do cartão |
| card_brand | varchar | YES | null | Bandeira do cartão |
| transaction_date | timestamp | YES | null | Data da transação |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

### 💵 payments
**Utilização**: Registros de pagamentos - usado em `backend/add-customer-name-column.sql` e sistema financeiro

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| quote_id | uuid | YES | null | FK para quotes |
| stripe_payment_intent_id | varchar | YES | null | ID do intent no Stripe |
| stripe_payment_link_id | varchar | YES | null | ID do link de pagamento |
| amount | numeric | NO | null | Valor do pagamento |
| currency | varchar | YES | 'BRL' | Moeda do pagamento |
| payment_type | varchar | YES | null | Tipo de pagamento |
| installment_number | integer | YES | 1 | Número da parcela |
| total_installments | integer | YES | 1 | Total de parcelas |
| status | varchar | YES | null | Status do pagamento |
| payment_method | varchar | YES | null | Método de pagamento |
| customer_email | varchar | YES | null | Email do cliente |
| payment_link_url | text | YES | null | URL do link de pagamento |
| expires_at | timestamp | YES | null | Data de expiração |
| paid_at | timestamp | YES | null | Data do pagamento |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |
| customer_name | text | YES | null | Nome do cliente |
| customer_phone | text | YES | null | Telefone do cliente |

### 💲 pricing_rules
**Utilização**: Regras de precificação - usado em `hooks/usePricing.ts` e `app/booking/page.tsx`

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | uuid_generate_v4() | Chave primária |
| origin_city | text | YES | null | Cidade de origem (null = qualquer) |
| destination_city | text | YES | null | Cidade de destino |
| vehicle_type | text | YES | null | Tipo de veículo |
| base_price | numeric | NO | null | Preço base da regra |
| price_per_km | numeric | YES | null | Preço por quilômetro |
| currency | char | YES | 'GBP' | Moeda da regra |
| created_at | timestamp | YES | now() | Data de criação |

### 📋 quotes
**Utilização**: Orçamentos/cotações - usado em `hooks/useQuotes.ts` e `app/admin/quotes/`

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| booking_reference | varchar | NO | null | Referência única do orçamento |
| status | varchar | YES | 'draft' | Status: draft, sent, accepted, expired |
| customer_name | varchar | NO | null | Nome do cliente |
| customer_email | varchar | NO | null | Email do cliente |
| customer_phone | varchar | NO | null | Telefone do cliente |
| quote_type | varchar | NO | null | Tipo do orçamento |
| pickup_address | text | NO | null | Endereço de origem |
| pickup_coordinates | point | YES | null | Coordenadas de origem |
| pickup_zone_id | text | YES | null | ID da zona de origem |
| pickup_date | date | NO | null | Data da viagem |
| pickup_time | time | NO | null | Horário da viagem |
| destination_address | text | NO | null | Endereço de destino |
| destination_coordinates | point | YES | null | Coordenadas de destino |
| destination_zone_id | text | YES | null | ID da zona de destino |
| return_date | date | YES | null | Data de retorno |
| return_time | time | YES | null | Horário de retorno |
| return_pickup_address | text | YES | null | Endereço de origem do retorno |
| return_pickup_coordinates | point | YES | null | Coordenadas de origem do retorno |
| return_pickup_zone_id | text | YES | null | ID da zona de origem do retorno |
| return_destination_address | text | YES | null | Endereço de destino do retorno |
| return_destination_coordinates | point | YES | null | Coordenadas de destino do retorno |
| return_destination_zone_id | text | YES | null | ID da zona de destino do retorno |
| service_hours | integer | YES | 2 | Horas de serviço |
| service_type | varchar | YES | null | Tipo de serviço |
| flight_number | varchar | YES | null | Número do voo |
| airline | varchar | YES | null | Companhia aérea |
| no_flight_info | boolean | YES | false | Sem informações de voo |
| vehicle_category_id | text | NO | null | FK para vehicle_categories |
| passengers | integer | NO | 1 | Número de passageiros |
| luggage_large | integer | YES | 0 | Bagagens grandes |
| luggage_small | integer | YES | 0 | Bagagens pequenas |
| base_price | numeric | NO | 0 | **Preço base personalizado** |
| extras_price | numeric | YES | 0 | Preço dos extras |
| total_amount | numeric | NO | 0 | Valor total do orçamento |
| extras | jsonb | YES | '[]' | Lista de extras selecionados |
| expires_days | integer | YES | 7 | Dias para expiração |
| expires_at | timestamp | YES | null | Data de expiração |
| notes | text | YES | null | Observações |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |
| created_by | uuid | YES | null | Usuário que criou |

**Campos de compatibilidade (VARCHAR):**
| data_emissao | timestamp | YES | now() | Data de emissão |
| valor_total | varchar | YES | null | Valor total (formato string) |
| nome_cliente | varchar | YES | null | Nome do cliente (formato string) |
| telefone_cliente | varchar | YES | null | Telefone (formato string) |
| email_cliente | varchar | YES | null | Email (formato string) |
| qtd_passageiros | integer | YES | null | Quantidade de passageiros |
| qtd_bagagens | integer | YES | null | Quantidade total de bagagens |
| bagagens_grandes | integer | YES | null | Bagagens grandes |
| bagagens_pequenas | integer | YES | null | Bagagens pequenas |
| veiculo | varchar | YES | null | Veículo (formato string) |
| origem | text | YES | null | Origem (formato string) |
| data_ida | date | YES | null | Data de ida |
| horario | time | YES | null | Horário |
| numero_voo | varchar | YES | null | Número do voo |
| destino | text | YES | null | Destino |
| tipo_trajeto | varchar | YES | null | Tipo de trajeto |
| volta | varchar | YES | null | Informações de volta |
| preco_base | varchar | YES | null | Preço base (formato string) |
| valor_extras | varchar | YES | null | Valor dos extras (formato string) |
| validade | varchar | YES | null | Validade |

### 🏨 reservations
**Utilização**: Sistema de reservas administrativo - usado em `backend/create-reservations-table.sql`

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| booking_reference | varchar | NO | null | Referência da reserva |
| customer_name | varchar | NO | null | Nome do cliente |
| customer_email | varchar | NO | null | Email do cliente |
| customer_phone | varchar | NO | null | Telefone do cliente |
| pickup_address | text | NO | null | Endereço de origem |
| destination_address | text | NO | null | Endereço de destino |
| pickup_date | date | NO | null | Data da viagem |
| pickup_time | time | NO | null | Horário da viagem |
| return_date | date | YES | null | Data de retorno |
| return_time | time | YES | null | Horário de retorno |
| status | varchar | YES | 'draft' | Status da reserva |
| total_amount | numeric | YES | 0 | Valor total |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |
| payment_links | jsonb | YES | null | Links de pagamento |
| payment_type | varchar | YES | 'single' | Tipo: single, partial |
| payment_id | uuid | YES | null | FK para payments |
| payment_status | varchar | YES | 'unpaid' | Status do pagamento |
| reservation_number | varchar | YES | generate_az_booking_number() | Número da reserva |

### 🌐 spatial_ref_sys
**Utilização**: Sistema de referência espacial - usado pelo PostGIS

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| srid | integer | NO | null | ID do sistema de referência |
| auth_name | varchar | YES | null | Nome da autoridade |
| auth_srid | integer | YES | null | SRID da autoridade |
| srtext | varchar | YES | null | Texto WKT |
| proj4text | varchar | YES | null | Texto Proj4 |

### 🚙 vehicle_categories
**Utilização**: Categorias de veículos - usado em `lib/zone-pricing-type.ts` e sistema de preços

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | text | NO | null | Chave primária |
| name | text | NO | null | Nome da categoria (SUV, Sedan, Van) |
| capacity | integer | NO | null | Capacidade de passageiros |
| base_price | integer | NO | null | Preço base em centavos |
| description | text | YES | null | Descrição da categoria |
| features | jsonb | YES | null | Características do veículo |
| is_active | boolean | YES | true | Se está ativa |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

### 🚗 vehicles
**Utilização**: Cadastro de veículos - usado em `hooks/useVehicles.ts` e alocação

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | uuid_generate_v4() | Chave primária |
| name | text | NO | null | Nome/modelo do veículo |
| type | text | NO | null | Tipo do veículo |
| passengers | integer | NO | null | Capacidade de passageiros |
| luggage | integer | NO | null | Capacidade de bagagem |
| year | integer | YES | null | Ano do veículo |
| license_plate | text | YES | null | Placa do veículo |
| status | text | NO | null | Status: active, maintenance, inactive |
| image_url | text | YES | null | URL da imagem |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

### 📊 vw_bookings_full
**Utilização**: View completa de reservas - usado para relatórios e dashboard

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | YES | null | ID da reserva |
| user_id | uuid | YES | null | ID do usuário |
| pickup_location | text | YES | null | Local de origem |
| dropoff_location | text | YES | null | Local de destino |
| pickup_date | date | YES | null | Data da viagem |
| pickup_time | time | YES | null | Horário da viagem |
| distance_km | numeric | YES | null | Distância em km |
| duration_min | integer | YES | null | Duração em minutos |
| vehicle_id | uuid | YES | null | ID do veículo |
| flight_number | text | YES | null | Número do voo |
| passengers | integer | YES | null | Número de passageiros |
| luggage | integer | YES | null | Quantidade de bagagem |
| notes | text | YES | null | Observações |
| total_amount | numeric | YES | null | Valor total |
| status | text | YES | null | Status da reserva |
| payment_status | text | YES | null | Status do pagamento |
| payment_method | text | YES | null | Método de pagamento |
| created_at | timestamp | YES | null | Data de criação |
| updated_at | timestamp | YES | null | Data de atualização |
| vehicle_name | text | YES | null | Nome do veículo |
| driver_name | text | YES | null | Nome do motorista |

### 💰 zone_pricing
**Utilização**: Preços por zona - usado em `hooks/useZonePricing.ts` e `lib/zone-pricing.ts`

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | uuid | NO | gen_random_uuid() | Chave primária |
| origin_zone_id | text | NO | null | FK para zones (origem) |
| destination_zone_id | text | NO | null | FK para zones (destino) |
| vehicle_category_id | text | NO | null | FK para vehicle_categories |
| price | integer | NO | null | Preço em centavos |
| is_active | boolean | YES | true | Se está ativo |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

### 📊 zone_pricing_bidirectional
**Utilização**: View de preços bidirecionais - usado para consultas de preço

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| origin_zone_id | text | YES | null | ID da zona de origem |
| destination_zone_id | text | YES | null | ID da zona de destino |
| vehicle_category_id | text | YES | null | ID da categoria do veículo |
| price | integer | YES | null | Preço em centavos |
| is_active | boolean | YES | null | Se está ativo |
| direction | text | YES | null | Direção da viagem |

### 🗺️ zones
**Utilização**: Definição de zonas geográficas - usado em `lib/zone-pricing-type.ts` e cálculo de preços

| Coluna | Tipo | Nulável | Padrão | Onde é usado |
|--------|------|---------|--------|--------------|
| id | text | NO | null | Chave primária |
| name | text | NO | null | Nome da zona |
| description | text | YES | null | Descrição da zona |
| type | text | NO | null | Tipo: circular, polygonal |
| center_lat | numeric | YES | null | Latitude do centro |
| center_lng | numeric | YES | null | Longitude do centro |
| radius_meters | integer | YES | null | Raio em metros |
| geojson | jsonb | YES | null | Dados GeoJSON |
| coverage_area | text | NO | null | Área de cobertura (NY, NJ, PA, CT) |
| is_active | boolean | YES | true | Se está ativa |
| created_at | timestamp | YES | now() | Data de criação |
| updated_at | timestamp | YES | now() | Data de atualização |

---

