"use client"

import { useState } from "react"
import { X, MapPin, Calendar, Clock, User, Phone, Mail, CreditCard, FileText } from "lucide-react"
import { Reservation } from "@/hooks/useReservations"

interface ReservationDetailsPopupProps {
  reservation: Reservation
  isOpen: boolean
  onClose: () => void
}

export default function ReservationDetailsPopup({ reservation, isOpen, onClose }: ReservationDetailsPopupProps) {
  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelada'
      case 'completed':
        return 'Concluída'
      case 'in_progress':
        return 'Em Andamento'
      default:
        return status
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalhes da Reserva
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Referência da Reserva</label>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">
                  {reservation.booking_reference || `#${reservation.id.slice(0, 8)}`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{reservation.customer_name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{reservation.customer_email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{reservation.customer_phone || 'Não informado'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações da Viagem */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Viagem</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Endereço de Origem</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-gray-900">{reservation.pickup_address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Endereço de Destino</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-gray-900">{reservation.destination_address}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Data de Partida</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{formatDate(reservation.pickup_date)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Horário de Partida</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{reservation.pickup_time}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Valor Total</label>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-semibold">{formatCurrency(reservation.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Viagem de Retorno (se existir) */}
              {reservation.return_date && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Data de Retorno</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{formatDate(reservation.return_date)}</span>
                    </div>
                  </div>

                  {reservation.return_time && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Horário de Retorno</label>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{reservation.return_time}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                <span className="text-gray-900">{formatDate(reservation.created_at)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Última Atualização</label>
                <span className="text-gray-900">{formatDate(reservation.updated_at)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">ID da Reserva</label>
                <span className="text-gray-900 font-mono text-sm">{reservation.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}