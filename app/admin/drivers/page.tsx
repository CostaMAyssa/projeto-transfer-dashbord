"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import { useDrivers, createDriver, updateDriver, deleteDriver } from "@/hooks/useDrivers"
import { useVehicles } from "@/hooks/useVehicles"
import { mutate } from "swr"

export default function DriversPage() {
  const { data: drivers, error, isLoading } = useDrivers()
  const { data: vehicles } = useVehicles()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for add/edit
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    license_number: "",
    status: "active",
    avatar_url: "",
    vehicle_id: "",
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando motoristas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar motoristas</p>
          <button 
            onClick={() => mutate('drivers')}
            className="btn-primary bg-secondary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Filter drivers based on search term
  const filteredDrivers = drivers?.filter(
    (driver) =>
      driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.email && driver.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.phone && driver.phone.toLowerCase().includes(searchTerm.toLowerCase())),
  ) || []

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedDriver(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (selectedDriver) {
      try {
        await deleteDriver(selectedDriver)
        mutate('drivers')
        setShowDeleteModal(false)
        setSelectedDriver(null)
      } catch (error) {
        console.error('Erro ao deletar motorista:', error)
        alert('Erro ao deletar motorista')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createDriver({
        ...formData,
        vehicle_id: formData.vehicle_id || null,
      })
      mutate('drivers')
      setShowAddModal(false)
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        license_number: "",
        status: "active",
        avatar_url: "",
        vehicle_id: "",
      })
    } catch (error) {
      console.error('Erro ao criar motorista:', error)
      alert('Erro ao criar motorista')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800"
      case 'on_leave':
        return "bg-yellow-100 text-yellow-800"
      case 'inactive':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return "Ativo"
      case 'on_leave':
        return "De Licença"
      case 'inactive':
        return "Inativo"
      default:
        return status
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Motoristas</h1>
        <button className="btn-primary bg-secondary flex items-center text-sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Motorista
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar motoristas..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#E95440] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filtrar
            </button>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2 text-gray-500" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {driver.avatar_url ? (
                      <img src={driver.avatar_url} alt={driver.full_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {driver.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{driver.full_name}</h3>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {getStatusText(driver.status)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => handleDeleteClick(driver.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {driver.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {driver.phone}
                  </div>
                )}
                {driver.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {driver.email}
                  </div>
                )}
                {driver.license_number && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">CNH:</span>
                    {driver.license_number}
                  </div>
                )}
                {driver.vehicles && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Veículo:</span>
                    {driver.vehicles.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredDrivers.length)} de{" "}
            {filteredDrivers.length} motoristas
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 border rounded-lg ${
                  currentPage === page
                    ? "bg-[#E95440] text-white border-[#E95440]"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Adicionar Motorista</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número da CNH</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Veículo</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                  >
                    <option value="">Selecionar veículo</option>
                    {vehicles?.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - {vehicle.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL do Avatar</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Ativo</option>
                    <option value="on_leave">De Licença</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E95440] text-white rounded-lg hover:bg-[#d63d2a] disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir este motorista? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
