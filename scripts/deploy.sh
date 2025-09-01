#!/bin/bash

# Script de Deploy para VPS
# Uso: ./scripts/deploy.sh [IP_VPS] [USUARIO]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para exibir mensagens
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar se os parâmetros foram fornecidos
if [ $# -lt 2 ]; then
    error "Uso: $0 <IP_VPS> <USUARIO>"
    error "Exemplo: $0 192.168.1.100 root"
    exit 1
fi

VPS_IP=$1
VPS_USER=$2
BUILD_FILE="build-deploy-latest.tar.gz"
REMOTE_DIR="/root/site-aztransfer-dashboard"
BACKUP_DIR="/root/backup-site-aztransfer-dashboard"

log "Iniciando deploy para VPS: $VPS_USER@$VPS_IP"

# Verificar se o arquivo de build existe
if [ ! -f "$BUILD_FILE" ]; then
    error "Arquivo de build não encontrado: $BUILD_FILE"
    error "Execute 'npm run build' primeiro"
    exit 1
fi

log "Arquivo de build encontrado: $BUILD_FILE"

# Criar backup da versão atual
log "Criando backup da versão atual..."
ssh $VPS_USER@$VPS_IP "mkdir -p $BACKUP_DIR && if [ -d $REMOTE_DIR ]; then tar -czf $BACKUP_DIR/backup-\$(date +%Y%m%d-%H%M%S).tar.gz -C $REMOTE_DIR .; fi"

# Fazer upload do arquivo de build
log "Fazendo upload do arquivo de build..."
scp $BUILD_FILE $VPS_USER@$VPS_IP:/tmp/

# Extrair e instalar a nova versão
log "Instalando nova versão..."
ssh $VPS_USER@$VPS_IP << EOF
    # Limpar diretório atual
    rm -rf $REMOTE_DIR/*
    
    # Extrair nova versão
    tar -xzf /tmp/$BUILD_FILE -C $REMOTE_DIR/
    
    # Ajustar permissões
    chown -R root:root $REMOTE_DIR/
    chmod -R 755 $REMOTE_DIR/
    
    # Limpar arquivo temporário
    rm /tmp/$BUILD_FILE
EOF

log "Deploy concluído com sucesso!"
log "URL: http://$VPS_IP"
log "Backup salvo em: $BACKUP_DIR/"

# Verificar se o site está funcionando
log "Verificando se o site está funcionando..."
sleep 3
if curl -s -o /dev/null -w "%{http_code}" "http://$VPS_IP" | grep -q "200\|301\|302"; then
    log "✅ Site está funcionando corretamente!"
else
    warn "⚠️  Site pode não estar funcionando. Verifique manualmente."
fi 