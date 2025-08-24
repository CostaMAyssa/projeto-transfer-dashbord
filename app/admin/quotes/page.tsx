"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuotes } from "@/hooks/useQuotes"
import { 
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Copy,
  ExternalLink,
  MapPin,
  Users,
  Luggage
} from "lucide-react"

export default function QuotesPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { quotes, loading, error, refetch } = useQuotes()

  // Função para formatar trajeto completo baseado no tipo
  const formatTrajectory = (quote: any) => {
    const formatDate = (date: string) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('pt-BR')
    }
    
    const formatTime = (time: string) => {
      if (!time) return ''
      return time.substring(0, 5)
    }

    switch (quote.quote_type) {
      case 'one-way':
        return {
          type: 'One-way',
          route: `${quote.pickup_address} → ${quote.destination_address}`,
          datetime: `${formatDate(quote.pickup_date)} ${formatTime(quote.pickup_time)}`,
          flight: quote.flight_number ? `Voo: ${quote.flight_number}` : ''
        }
      
      case 'round-trip':
        return {
          type: 'Round-trip',
          route: `Ida: ${quote.pickup_address} → ${quote.destination_address}\nVolta: ${quote.return_pickup_address || quote.destination_address} → ${quote.return_destination_address || quote.pickup_address}`,
          datetime: `Ida: ${formatDate(quote.pickup_date)} ${formatTime(quote.pickup_time)}\nVolta: ${formatDate(quote.return_date)} ${formatTime(quote.return_time)}`,
          flight: quote.flight_number ? `Voo: ${quote.flight_number}` : ''
        }
      
      case 'hourly':
        return {
          type: 'Hourly',
          route: `Base: ${quote.pickup_address}`,
          datetime: `${formatDate(quote.pickup_date)} ${formatTime(quote.pickup_time)}\nDuração: ${quote.service_hours}h`,
          flight: ''
        }
      
      default:
        return {
          type: quote.quote_type || 'N/A',
          route: `${quote.pickup_address} → ${quote.destination_address}`,
          datetime: `${formatDate(quote.pickup_date)} ${formatTime(quote.pickup_time)}`,
          flight: ''
        }
    }
  }

  // Calcular estatísticas dos orçamentos
  const quoteStats = {
    pending: { 
      count: quotes.filter(q => q.status === 'draft').length, 
      value: quotes.filter(q => q.status === 'draft').reduce((sum, q) => sum + q.total_amount, 0)
    },
    sent: { 
      count: quotes.filter(q => q.status === 'sent').length, 
      value: quotes.filter(q => q.status === 'sent').reduce((sum, q) => sum + q.total_amount, 0)
    },
    accepted: { 
      count: quotes.filter(q => q.status === 'accepted').length, 
      value: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total_amount, 0)
    },
    expired: { 
      count: quotes.filter(q => q.status === 'expired').length, 
      value: quotes.filter(q => q.status === 'expired').reduce((sum, q) => sum + q.total_amount, 0)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "text-yellow-600 bg-yellow-50"
      case "sent": return "text-blue-600 bg-blue-50"
      case "accepted": return "text-green-600 bg-green-50"
      case "expired": return "text-red-600 bg-red-50"
      case "rejected": return "text-gray-600 bg-gray-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Rascunho"
      case "sent": return "Enviado"
      case "accepted": return "Aceito"
      case "expired": return "Expirado"
      case "cancelled": return "Cancelado"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "sent": return <Send className="h-4 w-4" />
      case "accepted": return <CheckCircle className="h-4 w-4" />
      case "expired": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aqui você pode adicionar uma notificação de sucesso
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesFilter = filter === "all" || quote.status === filter
    const matchesSearch = quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Exibir mensagem de erro se houver problemas ao carregar os orçamentos
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-text-dark">Orçamentos</h1>
            <p className="text-text-gray text-sm mt-1">Gerencie orçamentos e propostas para clientes</p>
          </div>
          <Link href="/admin/quotes/new" className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Orçamento
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          <p className="font-medium">Erro ao carregar orçamentos</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-xs mt-2 text-red-600">
            Se o erro persistir, verifique se você está autenticado corretamente. 
            Tente fazer logout e login novamente.
          </p>
          <div className="flex gap-3 mt-3">
            <button 
              onClick={() => refetch()} 
              className="flex items-center gap-1 text-sm bg-red-100 px-3 py-1 rounded-md text-red-700 hover:bg-red-200"
            >
              <RefreshCw className="h-4 w-4" /> Tentar novamente
            </button>
            <Link 
              href="/admin/login" 
              className="flex items-center gap-1 text-sm bg-blue-100 px-3 py-1 rounded-md text-blue-700 hover:bg-blue-200"
            >
              Ir para login
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-text-dark">Orçamentos</h1>
          <p className="text-text-gray text-sm mt-1">Gerencie orçamentos e propostas para clientes</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/quotes/new" className="btn-primary bg-secondary flex items-center text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Link>
        </div>
      </div>





      {/* Quotes Table */}
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium text-text-dark">
            Orçamentos ({filteredQuotes.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Referência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo & Trajeto Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veículo / Passageiros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor / Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data / Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => {
                const trajectory = formatTrajectory(quote)
                return (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    {/* Cliente / Referência */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {quote.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          #{quote.id} • {quote.customer_email}
                        </div>
                        {quote.customer_phone && (
                          <div className="text-xs text-gray-500">
                            📞 {quote.customer_phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Tipo & Trajeto Completo */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            quote.quote_type === 'one-way' ? 'bg-blue-100 text-blue-800' :
                            quote.quote_type === 'round-trip' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {trajectory.type}
                          </span>
                          {trajectory.flight && (
                            <span className="text-xs text-gray-500">
                              {trajectory.flight}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-900">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          <span className="whitespace-pre-line">{trajectory.route}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          <span className="whitespace-pre-line">{trajectory.datetime}</span>
                        </div>
                      </div>
                    </td>

                    {/* Veículo / Passageiros */}
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex flex-col">
                         <div className="text-sm font-medium text-gray-900">
                           <Luggage className="inline h-4 w-4 mr-1" />
                           {(quote as any).vehicle_categories?.name || 'N/A'}
                         </div>
                         <div className="text-xs text-gray-500">
                           <Users className="inline h-3 w-3 mr-1" />
                           {quote.passengers || 1} passageiro{(quote.passengers || 1) > 1 ? 's' : ''}
                         </div>
                         {(quote as any).vehicle_categories?.capacity && (
                           <div className="text-xs text-gray-400">
                             Capacidade: {(quote as any).vehicle_categories.capacity}
                           </div>
                         )}
                       </div>
                     </td>

                    {/* Valor / Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          R$ {quote.total_amount?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {quote.status === 'draft' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Rascunho
                            </span>
                          )}
                          {quote.status === 'sent' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              <Send className="h-3 w-3 mr-1" />
                              Enviado
                            </span>
                          )}
                          {quote.status === 'accepted' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Aceito
                            </span>
                          )}
                          {quote.status === 'expired' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Expirado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Data / Ações */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="text-xs text-gray-500">
                          {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/quotes/${quote.booking_reference}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button className="text-red-600 hover:text-red-900" title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}