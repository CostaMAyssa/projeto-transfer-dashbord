"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye, MapPin, Calendar, Clock, User, Car, CreditCard, Copy, Check, Trash2, Edit, Search } from "lucide-react"
import { useReservations, updateReservationStatus, deleteReservation, Reservation } from "@/hooks/useReservations"
import { mutate } from "swr"
import ReservationDetailsPopup from "@/components/ReservationDetailsPopup"

export default function ReservationsPage() {
  const { data: reservations, error, isLoading } = useReservations()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage] = useState(5)
  const [activeTab, setActiveTab] = useState("All")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [copiedLinks, setCopiedLinks] = useState<{[key: string]: string}>({})
  const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean, reservationId: string | null}>({isOpen: false, reservationId: null})
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingReservation, setEditingReservation] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando reservas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar reservas</p>
          <button 
            onClick={() => mutate('reservations')}
            className="btn-primary bg-secondary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Filter reservations based on status and search term
  const filteredReservations = reservations?.filter(
    (reservation) => {
      const matchesStatus = statusFilter === "All" || reservation.status === statusFilter.toLowerCase()
      const matchesSearch = searchTerm === "" || 
        reservation.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.reservation_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.destination_address?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesStatus && matchesSearch
    },
  ) || []

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentReservations = filteredReservations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      await updateReservationStatus(reservationId, newStatus as any)
      mutate('reservations')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status da reserva')
    }
  }

  // Função para formatar data
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Função para formatar hora
  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove segundos
  }

  // Função para formatar moeda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'confirmed':
        return 'Confirmada'
      case 'in_progress':
        return 'Em Andamento'
      case 'completed':
        return 'Concluída'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  // Função para obter cor do status de pagamento
  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800'
      case 'unpaid':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  // Função para obter texto do status de pagamento
  const getPaymentStatusText = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'Pago'
      case 'partial':
        return 'Parcial'
      case 'unpaid':
        return 'Não Pago'
      case 'refunded':
        return 'Reembolsado'
      default:
        return 'N/A'
    }
  }

  // Função para copiar link de pagamento
  const copyPaymentLink = async (link: string, linkType: string, reservationId: string) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLinks(prev => ({ ...prev, [`${reservationId}-${linkType}`]: linkType }))
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newState = { ...prev }
          delete newState[`${reservationId}-${linkType}`]
          return newState
        })
      }, 2000)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
    }
  }

  // Função para confirmar exclusão
  const handleDeleteClick = (reservationId: string) => {
    setDeleteConfirmation({ isOpen: true, reservationId })
  }

  // Função para excluir reserva
  const handleDeleteReservation = async () => {
    if (!deleteConfirmation.reservationId) return
    
    setIsDeleting(true)
    try {
      await deleteReservation(deleteConfirmation.reservationId)
      mutate('reservations')
      setDeleteConfirmation({ isOpen: false, reservationId: null })
    } catch (error) {
      console.error('Erro ao excluir reserva:', error)
      alert('Erro ao excluir reserva. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Função para cancelar exclusão
  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, reservationId: null })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium">Reservas</h1>
            <p className="text-gray-600 mt-2">Gerencie todas as reservas de transfer</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="scheduled">Agendado</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Pesquisar por cliente, reserva, endereço..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440] w-full sm:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden flex-1">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Reserva
                </th>
                <th className="hidden md:table-cell px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Rota
                </th>
                <th className="hidden sm:table-cell px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="hidden lg:table-cell px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Veículo
                </th>
                <th className="px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden xl:table-cell px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Pag.
                </th>
                <th className="hidden xl:table-cell px-1 py-1 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Links
                </th>
                <th className="px-1 py-1 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-1 py-1 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-normal align-top">
                    <div className="flex items-start">
                      <div>
                        <div className="text-xs md:text-sm font-medium text-gray-900">
                          {reservation.reservation_number || reservation.booking_reference || `#${reservation.id.slice(0, 8)}`}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Cliente: {reservation.customer_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-2 py-2 align-top">
                    <div className="flex items-start text-xs md:text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                      <div>
                        <div className="text-gray-900 break-words">{reservation.pickup_address}</div>
                        <div className="text-gray-500 break-words">→ {reservation.destination_address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-2 py-2 whitespace-normal align-top">
                    <div className="flex items-start text-xs md:text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                      <div>
                        <div className="text-gray-900">{formatDate(reservation.pickup_date)}</div>
                        <div className="text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(reservation.pickup_time)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-2 py-2 whitespace-normal align-top">
                    <div className="flex items-center text-sm text-gray-500">
                      <Car className="h-4 w-4 mr-1" />
                      <span>A definir</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <select
                      className={`px-2 py-1 rounded-full text-[11px] md:text-xs font-medium border-0 ${getStatusColor(reservation.status)}`}
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmada</option>
                      <option value="in_progress">Em Andamento</option>
                      <option value="completed">Concluída</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                  <td className="hidden xl:table-cell px-2 py-2 align-top">
                    <span className={`px-2 py-1 rounded-full text-[11px] md:text-xs font-medium ${
                      reservation.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      reservation.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.payment_status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getPaymentStatusText(reservation.payment_status)}
                    </span>
                  </td>
                  <td className="hidden xl:table-cell px-2 py-2 align-top">
                    {reservation.payment_links ? (
                      <div className="space-y-1">
                        {reservation.payment_type === 'single' ? (
                          <button
                            onClick={() => copyPaymentLink(
                              typeof reservation.payment_links === 'string' 
                                ? JSON.parse(reservation.payment_links).link 
                                : reservation.payment_links.link,
                              'single',
                              reservation.id
                            )}
                            className="flex items-center text-[11px] md:text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 transition-colors"
                          >
                            {copiedLinks[`${reservation.id}-single`] ? (
                              <><Check className="h-3 w-3 mr-1" /> Copiado!</>
                            ) : (
                              <><Copy className="h-3 w-3 mr-1" /> Link Pagamento</>
                            )}
                          </button>
                        ) : (
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                const links = typeof reservation.payment_links === 'string' 
                                  ? JSON.parse(reservation.payment_links) 
                                  : reservation.payment_links
                                copyPaymentLink(links.first_installment, '1st', reservation.id)
                              }}
                              className="flex items-center text-[11px] md:text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 transition-colors w-full"
                            >
                              {copiedLinks[`${reservation.id}-1st`] ? (
                                <><Check className="h-3 w-3 mr-1" /> Copiado!</>
                              ) : (
                                <><Copy className="h-3 w-3 mr-1" /> 1ª Parcela</>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                const links = typeof reservation.payment_links === 'string' 
                                  ? JSON.parse(reservation.payment_links) 
                                  : reservation.payment_links
                                copyPaymentLink(links.second_installment, '2nd', reservation.id)
                              }}
                              className="flex items-center text-[11px] md:text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200 transition-colors w-full"
                            >
                              {copiedLinks[`${reservation.id}-2nd`] ? (
                                <><Check className="h-3 w-3 mr-1" /> Copiado!</>
                              ) : (
                                <><Copy className="h-3 w-3 mr-1" /> 2ª Parcela</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-500">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <span>Sem links</span>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 text-right align-top">
                    {formatCurrency(reservation.total_amount)}
                  </td>
                  <td className="px-2 py-2 text-right text-sm font-medium align-top">
                    <div className="flex items-center justify-end space-x-1 md:space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setIsPopupOpen(true)
                        }}
                        className="text-[#E95440] hover:text-[#d63d2a] flex items-center px-1 md:px-2 py-1 rounded transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link 
                        href={`/admin/bookings/${reservation.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 flex items-center px-1 md:px-2 py-1 rounded transition-colors hover:bg-blue-50"
                        title="Editar reserva"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(reservation.id)}
                        className="text-red-600 hover:text-red-800 flex items-center px-1 md:px-2 py-1 rounded transition-colors hover:bg-red-50"
                        title="Excluir reserva"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredReservations.length)}</span> de{" "}
                  <span className="font-medium">{filteredReservations.length}</span> reservas
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-[#E95440] border-[#E95440] text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup de Detalhes da Reserva */}
      {selectedReservation && (
        <ReservationDetailsPopup
          reservation={selectedReservation}
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false)
            setSelectedReservation(null)
          }}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirmar Exclusão
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E95440] disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteReservation}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
