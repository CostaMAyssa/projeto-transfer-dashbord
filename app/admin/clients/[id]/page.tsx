"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Mail, Phone, Building, Calendar, User } from "lucide-react"
import { useClients, type Client } from "@/hooks/useClients"
import ClientHistoryPopup from "@/components/ClientHistoryPopup"

export default function ClientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { clients, isLoading } = useClients()
  const [client, setClient] = useState<Client | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    if (clients && params.id) {
      const foundClient = clients.find(c => c.id.toString() === params.id)
      if (foundClient) {
        setClient(foundClient)
      }
    }
  }, [clients, params.id])

  const getStatusBadge = (status?: string) => {
    const colors = {
      'Ativo': 'bg-green-100 text-green-800',
      'Inativo': 'bg-gray-100 text-gray-800',
      'Lead': 'bg-blue-100 text-blue-800'
    }
    
    const statusText = status || 'Lead'
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[statusText as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {statusText}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cliente não encontrado</h3>
          <p className="text-gray-600 mb-4">O cliente solicitado não existe ou foi removido.</p>
          <Link
            href="/admin/clients"
            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Clientes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/clients"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.full_name}</h1>
            <p className="text-gray-600">Detalhes do cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Histórico
          </button>
          <Link
            href={`/admin/clients/${client.id}/edit`}
            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* Client Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Básicas
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome Completo</label>
              <p className="text-gray-900 font-medium">{client.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                {getStatusBadge(client.status)}
              </div>
            </div>
            {client.company && (
              <div>
                <label className="text-sm font-medium text-gray-500">Empresa</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  {client.company}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contato</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${client.email}`} className="hover:text-secondary transition-colors">
                  {client.email}
                </a>
              </p>
            </div>
            {client.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${client.phone}`} className="hover:text-secondary transition-colors">
                    {client.phone}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Cliente desde</label>
              <p className="text-gray-900 font-medium">{formatDate(client.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Última atualização</label>
              <p className="text-gray-900 font-medium">{formatDate(client.updated_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Última interação</label>
              <p className="text-gray-900 font-medium">{formatDate(client.last_interaction || client.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client History Popup */}
      {isHistoryOpen && client && (
        <ClientHistoryPopup
          client={{
            id: client.id,
            full_name: client.full_name,
            email: client.email,
            phone: client.phone || '',
            last_interaction: client.last_interaction || client.updated_at
          }}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  )
}