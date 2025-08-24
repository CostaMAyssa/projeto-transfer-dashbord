"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getQuoteByReference } from "@/hooks/useQuotes"
import { 
  ArrowLeft,
  MapPin,
  User,
  Car,
  Calendar,
  Clock,
  DollarSign,
  Send,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

export default function QuoteDetailPage() {
  const params = useParams()
  const quoteId = params.id as string
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Buscar dados reais do orçamento
  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) return
      
      try {
        setLoading(true)
        const quoteData = await getQuoteByReference(quoteId)
        
        if (quoteData) {
          setQuote(quoteData)
        } else {
          console.error('Orçamento não encontrado')
        }
      } catch (error) {
        console.error('Erro ao buscar orçamento:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [quoteId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "sent": return "text-blue-600 bg-blue-50 border-blue-200"
      case "accepted": return "text-green-600 bg-green-50 border-green-200"
      case "expired": return "text-red-600 bg-red-50 border-red-200"
      case "cancelled": return "text-gray-600 bg-gray-50 border-gray-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4" />
      case "sent": return <Send className="h-4 w-4" />
      case "accepted": return <CheckCircle className="h-4 w-4" />
      case "expired": return <XCircle className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Pendente"
      case "sent": return "Enviado"
      case "accepted": return "Aceito"
      case "expired": return "Expirado"
      case "cancelled": return "Cancelado"
      default: return status
    }
  }

  const getQuoteTypeLabel = (type: string) => {
    switch (type) {
      case "one-way": return "Ida"
      case "round-trip": return "Ida e Volta"
      case "hourly": return "Por Hora"
      default: return type
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aqui você pode adicionar uma notificação de sucesso
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-4">Orçamento não encontrado</h1>
          <Link href="/admin/quotes" className="text-secondary hover:underline">
            Voltar para orçamentos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/admin/quotes"
            className="flex items-center gap-2 text-text-gray hover:text-text-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold text-text-dark">Orçamento {quote.booking_reference}</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(quote.status)}`}>
            {getStatusIcon(quote.status)}
            <span className="text-sm font-medium">{getStatusLabel(quote.status)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Cliente */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-medium text-text-dark">Dados do Cliente</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Nome</label>
                  <p className="text-text-dark">{quote.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Email</label>
                  <p className="text-text-dark">{quote.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Telefone</label>
                  <p className="text-text-dark">{quote.customer_phone}</p>
                </div>
              </div>
            </div>

            {/* Dados do Trajeto */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-medium text-text-dark">Trajeto</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Tipo de Orçamento</label>
                  <p className="text-text-dark font-medium">{getQuoteTypeLabel(quote.quote_type)}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-gray mb-1">Origem</label>
                    <p className="text-text-dark">{quote.pickup_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-gray mb-1">Destino</label>
                    <p className="text-text-dark">{quote.destination_address}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-gray mb-1">Data</label>
                    <p className="text-text-dark">{new Date(quote.pickup_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-gray mb-1">Horário</label>
                    <p className="text-text-dark">{quote.pickup_time}</p>
                  </div>
                </div>

                {quote.quote_type === "round-trip" && quote.return_date && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-sm font-medium text-text-gray mb-1">Data de Volta</label>
                      <p className="text-text-dark">{new Date(quote.return_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-gray mb-1">Horário de Volta</label>
                      <p className="text-text-dark">{quote.return_time}</p>
                    </div>
                  </div>
                )}

                {quote.quote_type === "hourly" && (
                  <div>
                    <label className="block text-sm font-medium text-text-gray mb-1">Duração</label>
                    <p className="text-text-dark">{quote.service_hours} hora(s)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Veículo e Passageiros */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-medium text-text-dark">Veículo e Passageiros</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Tipo de Veículo</label>
                  <p className="text-text-dark">{(quote as any).vehicle_categories?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Passageiros</label>
                  <p className="text-text-dark">{quote.passengers}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Bagagens</label>
                  <p className="text-text-dark">{quote.luggage_large}G + {quote.luggage_small}P</p>
                </div>
              </div>

              {(quote.airline || quote.flight_number) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  {quote.airline && (
                    <div>
                      <label className="block text-sm font-medium text-text-gray mb-1">Companhia Aérea</label>
                      <p className="text-text-dark">{quote.airline}</p>
                    </div>
                  )}
                  {quote.flight_number && (
                    <div>
                      <label className="block text-sm font-medium text-text-gray mb-1">Número do Voo</label>
                      <p className="text-text-dark">{quote.flight_number}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Observações */}
            {quote.notes && (
              <div className="bg-white rounded-lg p-6 border border-border">
                <h2 className="text-lg font-medium text-text-dark mb-4">Observações</h2>
                <p className="text-text-gray">{quote.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo Financeiro */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-medium text-text-dark">Resumo Financeiro</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-gray">Preço Base:</span>
                  <span className="font-medium">${quote.base_price?.toFixed(2) || '0.00'}</span>
                </div>
                
                {quote.extras && Array.isArray(quote.extras) && quote.extras.map((extra: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-text-gray">{extra.name} (x{extra.quantity || 1}):</span>
                    <span className="font-medium">${((extra.price || 0) * (extra.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-text-dark">Total:</span>
                    <span className="text-lg font-bold text-secondary">${quote.total_amount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Orçamento */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-medium text-text-dark">Informações</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Criado em</label>
                  <p className="text-text-dark">{new Date(quote.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-gray mb-1">Expira em</label>
                  <p className="text-text-dark">{new Date(quote.expires_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <h2 className="text-lg font-medium text-text-dark mb-4">Ações</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => copyToClipboard(`${window.location.origin}/quote/${quote.booking_reference}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90"
                >
                  <Copy className="h-4 w-4" />
                  Copiar Link
                </button>
                
                <a 
                  href={`${window.location.origin}/quote/${quote.booking_reference}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border text-text-dark rounded-md hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver Página Pública
                </a>
                
                {quote.status === "pending" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                    Enviar Orçamento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}