import ClientQuotePage from "../../../quote/[id]/ClientQuotePage"

// Permitir parâmetros dinâmicos para aceitar qualquer ID de orçamento
export const dynamic = "force-dynamic"
export const dynamicParams = true

export default function Page() {
  return <ClientQuotePage />
}