import ClientQuotePage from "./ClientQuotePage"

export const dynamic = "error"
export const dynamicParams = false

export async function generateStaticParams() {
  return [{ id: 'preview' }]
}

export default function Page() {
  return <ClientQuotePage />
} 