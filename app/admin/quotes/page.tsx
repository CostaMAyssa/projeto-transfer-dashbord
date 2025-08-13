"use client"

import { useState } from "react"
import Link from "next/link"
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
  ExternalLink
} from "lucide-react"

export default function QuotesPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - será substituído por dados reais do Supabase
  const quoteStats = {
    pending: { count: 8, value: 12400.00 },
    sent: { count: 15, value: 28500.00 },
    accepted: { count: 12, value: 22800.00 },
    expired: { count: 5, value: 7300.00 }
  }

  const quotes = [
    {
      id: "QT001",
      customer_name: "João Silva",
      customer_email: "joao@email.com",
      origin: "Aeroporto JFK",
      destination: "Manhattan Hotel",
      vehicle_type: "Premium Sedan",
      total_amount: 150.00,
      status: "sent",
      created_at: "2025-01-10T14:30:00",
      expires_at: "2025-01-17T14:30:00",
      public_url: "https://site.com/quote/QT001"
    },
    {
      id: "QT002", 
      customer_name: "Maria Santos",
      customer_email: "maria@email.com",
      origin: "Times Square",
      destination: "Brooklyn Heights",
      vehicle_type: "Standard",
      total_amount: 85.00,
      status: "accepted",
      created_at: "2025-01-09T10:15:00",
      expires_at: "2025-01-16T10:15:00",
      public_url: "https://site.com/quote/QT002"
    },
    {
      id: "QT003",
      customer_name: "Carlos Oliveira", 
      customer_email: "carlos@email.com",
      origin: "Central Park",
      destination: "LaGuardia Airport",
      vehicle_type: "SUV",
      total_amount: 120.00,
      status: "pending",
      created_at: "2025-01-11T09:00:00",
      expires_at: "2025-01-18T09:00:00",
      public_url: "https://site.com/quote/QT003"
    },
    {
      id: "QT004",
      customer_name: "Ana Costa",
      customer_email: "ana@email.com", 
      origin: "Wall Street",
      destination: "Newark Airport",
      vehicle_type: "Premium SUV",
      total_amount: 180.00,
      status: "expired",
      created_at: "2025-01-05T16:45:00",
      expires_at: "2025-01-12T16:45:00",
      public_url: "https://site.com/quote/QT004"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-50"
      case "sent": return "text-blue-600 bg-blue-50"
      case "accepted": return "text-green-600 bg-green-50"
      case "expired": return "text-red-600 bg-red-50"
      case "cancelled": return "text-gray-600 bg-gray-50"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-text-dark">Orçamentos</h1>
          <p className="text-text-gray text-sm mt-1">Gerencie orçamentos e propostas para clientes</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center text-sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <Link href="/admin/quotes/new" className="btn-primary bg-secondary flex items-center text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Rascunhos</p>
              <p className="text-2xl font-medium text-text-dark">{quoteStats.pending.count}</p>
              <p className="text-yellow-600 text-sm font-medium">${quoteStats.pending.value.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Enviados</p>
              <p className="text-2xl font-medium text-text-dark">{quoteStats.sent.count}</p>
              <p className="text-blue-600 text-sm font-medium">${quoteStats.sent.value.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Aceitos</p>
              <p className="text-2xl font-medium text-text-dark">{quoteStats.accepted.count}</p>
              <p className="text-green-600 text-sm font-medium">${quoteStats.accepted.value.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Expirados</p>
              <p className="text-2xl font-medium text-text-dark">{quoteStats.expired.count}</p>
              <p className="text-red-600 text-sm font-medium">${quoteStats.expired.value.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg p-4 border border-border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-text-gray" />
            <input
              type="text"
              placeholder="Buscar por cliente ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-standard text-sm min-w-[200px]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-gray" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="input-standard text-sm min-w-[120px]"
            >
              <option value="all">Todos</option>
              <option value="pending">Rascunhos</option>
              <option value="sent">Enviados</option>
              <option value="accepted">Aceitos</option>
              <option value="expired">Expirados</option>
            </select>
          </div>

          <button className="btn-secondary flex items-center text-sm ml-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
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
                  ID / Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-text-dark">{quote.id}</div>
                      <div className="text-sm text-text-gray">{quote.customer_name}</div>
                      <div className="text-xs text-text-gray">{quote.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-dark">
                      <div className="font-medium">{quote.origin}</div>
                      <div className="text-text-gray">→ {quote.destination}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-text-dark">{quote.vehicle_type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-text-dark">${quote.total_amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      {getStatusText(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-gray">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(quote.public_url)}
                        className="text-text-gray hover:text-text-dark"
                        title="Copiar link público"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      <a
                        href={quote.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver página pública"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      <Link 
                        href={`/admin/quotes/${quote.id}`}
                        className="text-text-gray hover:text-text-dark"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link 
                        href={`/admin/quotes/${quote.id}/edit`}
                        className="text-secondary hover:text-secondary/80"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      {quote.status === "accepted" && (
                        <Link 
                          href={`/admin/bookings/new?from_quote=${quote.id}`}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          title="Converter em reserva"
                        >
                          Converter
                        </Link>
                      )}

                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 