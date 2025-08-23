// Este arquivo contém uma função para corrigir o redirecionamento após salvar um orçamento
// Substitua o uso de window.location.href por router.push do Next.js

/**
 * Função para redirecionar após salvar um orçamento
 * 
 * @param {string} status - Status do orçamento (draft ou sent)
 * @param {object} voucherData - Dados do orçamento para preview (opcional)
 */
export function redirectAfterSave(router, status, voucherData = null) {
  if (status === 'sent' && voucherData) {
    // Redirecionar para preview com dados do orçamento
    const encoded = encodeURIComponent(JSON.stringify(voucherData))
    router.push(`/quote/preview?data=${encoded}`)
  } else {
    // Rascunho salvo, redirecionar para lista
    router.push('/admin/quotes')
  }
}