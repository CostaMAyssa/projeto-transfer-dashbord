# Credenciais e Integrações

> **Atenção:** proteja este arquivo (criptografia/safe). Rotacione as senhas periodicamente e nunca publique em repositórios públicos.

## Contas Principais

- **Google / Supabase (DB)**
  - Email: `aztransfergroup@gmail.com`
  - Senha: `Aztransfer14*`

- **GitHub**
  - Email: `aztransfergroup@gmail.com`
  - Senha: `Az2025transfer*`

- **Dashboard**
  - Senha global: `nexlink`

## Infraestrutura

- **VPS**
  - Host: `ssh root@31.97.142.131`
  - Senha: `NexAZR3w7xTransfer#9`

- **Portainer**
  - Usuário: `Admin`
  - Senha: `@123456Group`

## APIs e Serviços

- **Conta Google (APIs de Voos e Calendar)**
  - Email: `hello@nexlink.ai`
  - Senha: `Dgp9f2dryr#9`

- **Stripe (Secret Key)**
  - `STRIPE_LIVE_KEY` (guardar no cofre seguro `Vault/AZTransfer/Stripe`). Solicite acesso ao admin quando precisar.

- **Google Maps Backend Key**
  - `GOOGLE_MAPS_BACKEND_KEY` (armazenada no mesmo cofre acima; nunca versionar a chave real)

- **Supabase Edge Function (API Voos)**
  ```
  curl -H "Authorization: Bearer <SUPABASE_SERVICE_ROLE_TOKEN>" \
       -H "apikey: <SUPABASE_ANON_KEY>" \
       "https://micpkdvtewsbtbrptuoj.supabase.co/functions/v1/flight-data?flight=AF8754&date=2025-01-15"
  ```

## Status de Implementações

### 1. Área de Orçamento

- Erros de voucher ✅
- Recalcular soma ao mudar tipo ✅
- Reset de cache ao trocar formulário ✅
- Status enviado/rascunho ✅
- Permitir editar valores ✅
- Ajuste de horário EUA ✅
- Autocomplete da volta ✅
- Persistir valores fora da cobertura ✅
- Status funcional até envio pagamento ✅
- Nome do voucher ✅
- Barra de pesquisa ✅
- Renomear para MINIVAN ✅

### 2. Área de Pagamentos

- Datas e horas corretas ✅
- Segunda parcela automática ✅
- API de pagamentos ✅
- Orçamento automático ✅

### 3. Área de Contatos

- Histórico por cliente ✅
- Ações editar/visualizar/excluir ✅

### 4. Reservas

- Ações ✅
- Título ✅
- Integração com orçamento ✅
- Link + tipo de pagamento ✅
- ID padrão `AZ0005000NYC` incremental ✅
- Botões excluir/visualizar ✅

### Entregáveis

- Vídeo para cliente ✅
- Build enviada ao Fausto ✅

## Notificações Internas (Dashboard)

- Novas reservas
- Escassez de motoristas
- Atualização de preços
- Manutenções agendadas
- Pagamentos pendentes

## Integração Google Calendar

- API conectada ✅
- Projeto/API criado ✅
- Banco configurado ✅
- Visualizar reservas ✅
- Criação automática de eventos ✅
- Atualização ao vivo ⏳
- Atualizar `client_secret`, `calendar_api_key`, `client_id` ⏳


## Stack de Deploy (Docker + Nginx + Traefik)

```
version: "3.7"

services:
  aztransfer-dashboard-website:
    image: nginx:latest
    container_name: aztransfer-dashboard-website
    restart: always
    volumes:
      - /root/site-aztransfer-dashboard:/usr/share/nginx/html:ro
      - /root/nginx-conf/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - groupnet
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.aztransfer-dashboard-website.rule=Host(dashboard.aztransfergroup.com)
        - traefik.http.routers.aztransfer-dashboard-website.entrypoints=websecure
        - traefik.http.routers.aztransfer-dashboard-website.tls.certresolver=letsencryptresolver
        - traefik.http.services.aztransfer-dashboard-website.loadbalancer.server.port=80

networks:
  groupnet:
    external: true
    name: groupnet
```

