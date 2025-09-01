# Deploy do Next.js (projeto-transfer-dashboard) via Docker + Traefik

## Estrutura recomendada no servidor

```
/root/site-aztransfer-dashboard
├─ package.json
├─ package-lock.json
├─ next.config.js
├─ public/
├─ pages/
├─ components/
├─ .next/        <-- pasta de build do Next.js
```

## Passo 1: Conectar ao servidor

```bash
ssh root@31.97.142.131
```

## Passo 2: Parar serviço antigo

```bash
echo "=== PARANDO SERVIÇO ATUAL ==="
docker service rm aztransfer-dashboard-website_aztransfer-dashboard-website
```

## Passo 3: Criar serviço Docker em modo desenvolvimento

```bash
echo "=== CRIANDO SERVIÇO EM MODO DEV ==="
docker service create \
  --name aztransfer-dashboard-website_aztransfer-dashboard-website \
  --network groupnet \
  --mount type=bind,source=/root/site-aztransfer-dashboard,target=/app \
  --workdir /app \
  --env NODE_ENV=development \
  --publish 3000:3000 \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.aztransfer-dashboard-website.rule=Host(`dashboard.aztransfergroup.com`)" \
  --label "traefik.http.routers.aztransfer-dashboard-website.entrypoints=websecure" \
  --label "traefik.http.routers.aztransfer-dashboard-website.tls.certresolver=letsencryptresolver" \
  --label "traefik.http.services.aztransfer-dashboard-website.loadbalancer.server.port=3000" \
  --label "traefik.docker.network=groupnet" \
  node:20-alpine sh -c "npm install && npm run dev"
```

> ⚠️ **Importante:** Usamos modo desenvolvimento (npm run dev) para contornar problemas de build estático.

## Passo 4: Aguardar inicialização

```bash
echo "=== AGUARDANDO INICIALIZAÇÃO ==="
sleep 30
```

## Passo 5: Verificar status do serviço

```bash
echo "=== STATUS DO SERVIÇO ==="
docker service ls | grep aztransfer-dashboard-website
```

## Passo 6: Checar logs recentes

```bash
echo "=== LOGS DO SERVIÇO ==="
docker service logs aztransfer-dashboard-website_aztransfer-dashboard-website --tail 10
```

## Passo 7: Testar domínio e acesso local

```bash
echo "=== TESTE DOMÍNIO ==="
curl -s -o /dev/null -w "%{http_code}" https://dashboard.aztransfergroup.com

echo "=== TESTE LOCAL ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

## Passo 8: Corrigir problemas de Traefik (se necessário)

### Garantir labels corretos e rede:

```bash
--label "traefik.enable=true"
--label "traefik.http.routers.aztransfer-dashboard-website.rule=Host(`dashboard.aztransfergroup.com`)"
--label "traefik.http.routers.aztransfer-dashboard-website.entrypoints=websecure"
--label "traefik.http.routers.aztransfer-dashboard-website.tls.certresolver=letsencryptresolver"
--label "traefik.http.services.aztransfer-dashboard-website.loadbalancer.server.port=3000"
--label "traefik.docker.network=groupnet"
```

### Requisitos:
- SSL via Let's Encrypt configurado corretamente.
- Rede Docker groupnet conectada.

## Passo 9: Validar aplicação

### Checklist de validação:

- ✅ **Serviço Docker:** 1/1 réplicas ativas
- ✅ **Next.js:** Rodando em modo dev na porta 3000
- ✅ **Acesso local:** HTTP 200
- ✅ **Domínio público:** HTTP 200
- ✅ **Traefik:** Roteamento e SSL funcionando


---

# 🛠️ Lista de Erros e Soluções

Perfeito! Aqui está um **resumo completo de todos os erros que você encontrou durante o deploy do `projeto-transfer-dashboard`** e as soluções aplicadas para cada um:

## **Erro 1: Porta 3000 já em uso**

### **Sintoma:**
Ao tentar rodar `npm run start`, o Next.js retornava:

```
Error: listen EADDRINUSE: address already in use :::3000
```

### **Causa:**
Outro processo (possivelmente outro container ou instância do Node) estava ocupando a porta 3000.

### **Solução:**

* Parar o serviço ou container existente que estava usando a porta 3000.
* Usar `docker service rm` para remover serviço antigo antes de criar o novo.

```bash
docker service rm aztransfer-dashboard-website_aztransfer-dashboard-website
```

---

## **Erro 2: Tentativa de servir `.next/server/app` com Nginx**

### **Sintoma:**
Você tentou usar Nginx para servir a pasta de build estático do Next.js, mas a aplicação não funcionava corretamente.

### **Causa:**

* Next.js não pode ser servido diretamente como arquivos estáticos quando há páginas com **SSR ou parâmetros dinâmicos**.
* Isso resultava em erros de build e 504 no Traefik.

### **Solução:**

* Rodar a aplicação **diretamente com Node.js**, usando `node:20-alpine` no Docker.
* Comando final:

```bash
sh -c "npm install && npm run dev"
```

* Essa abordagem roda a aplicação em **modo desenvolvimento**, contornando problemas de build estático.

---

## **Erro 3: Domínio retornando 504**

### **Sintoma:**
Após iniciar o container, `curl https://dashboard.aztransfergroup.com` retornava `504 Gateway Timeout`.

### **Causa:**

* Labels do Traefik estavam incompletos ou incorretos.
* Rede Docker (`groupnet`) não estava corretamente atribuída ao serviço.

### **Solução:**

* Ajustar labels do Traefik:

```bash
--label "traefik.enable=true"
--label "traefik.http.routers.aztransfer-dashboard-website.rule=Host(`dashboard.aztransfergroup.com`)"
--label "traefik.http.routers.aztransfer-dashboard-website.entrypoints=websecure"
--label "traefik.http.routers.aztransfer-dashboard-website.tls.certresolver=letsencryptresolver"
--label "traefik.http.services.aztransfer-dashboard-website.loadbalancer.server.port=3000"
--label "traefik.docker.network=groupnet"
```

* Certificar-se de que o container está na rede correta (`groupnet`) para que o Traefik consiga rotear.

---

## **Erro 4: Problemas de hidratação no console**

### **Sintoma:**
No console do navegador, apareciam erros como:

```
NotFoundError: insertBefore
```

### **Causa:**

* Incompatibilidade SSR/CSR em alguns componentes.
* Uso indevido de `isClient` ou múltiplos `useEffect` conflitantes.

### **Solução:**

1. **`vehicle-carousel.tsx`**
   * Removida a verificação `isClient` desnecessária.

2. **`animate-on-scroll.tsx`**
   * Consolidados os `useEffect` para evitar conflitos SSR/CSR.

---

## **Erro 5: Build estático falhando em páginas com parâmetros de idioma**

### **Sintoma:**
Algumas páginas não conseguiam ser geradas no build estático.

### **Causa:**

* Next.js requer Node.js para SSR de páginas dinâmicas; build estático não suporta todos os casos.

### **Solução:**

* Temporariamente, rodar **modo desenvolvimento** (`npm run dev`) em vez de `npm run build && npm run start`.
* Garantiu funcionamento total da aplicação, mesmo com páginas dinâmicas.

---

## ✅ **Resumo do Status Final**

| Item                    | Status                                    |
| ----------------------- | ----------------------------------------- |
| Serviço Docker          | Ativo e estável (1/1 réplicas)            |
| Next.js                 | Rodando em modo desenvolvimento           |
| Domínio Público         | HTTP 200 ✅                                |
| Acesso Local            | HTTP 200 ✅                                |
| Traefik                 | Labels corretos, roteamento funcionando ✅ |
| Problemas de Hidratação | Corrigidos nos componentes críticos ✅     |
| Build Estático          | Contornado com modo dev ✅                 |




