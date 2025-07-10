"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, DollarSign } from "lucide-react"
import { usePricingRules, createPricingRule, updatePricingRule, deletePricingRule } from "@/hooks/usePricing"
import { useExtras, createExtra, updateExtra, deleteExtra } from "@/hooks/useExtras"
import { mutate } from "swr"

export default function PricingPage() {
  const { data: pricing, error: pricingError, isLoading: pricingLoading } = usePricingRules()
  const { data: extraServices, error: extrasError, isLoading: extrasLoading } = useExtras()
  
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [showAddPriceModal, setShowAddPriceModal] = useState(false)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [editedPrice, setEditedPrice] = useState({
    origin_city: "",
    destination_city: "",
    vehicle_type: "",
    base_price: 0,
    price_per_km: 0,
    currency: "USD",
  })
  
  const [editedService, setEditedService] = useState({
    name: "",
    price: 0,
    description: "",
    name_en: "",
    name_es: "",
    description_en: "",
    description_es: "",
  })

  if (pricingLoading || extrasLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando preços...</p>
        </div>
      </div>
    )
  }

  if (pricingError || extrasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados</p>
          <button 
            onClick={() => {
              mutate('pricing_rules')
              mutate('extras')
            }}
            className="btn-primary bg-secondary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const handleEditPrice = (price: any) => {
    setEditingPriceId(price.id)
    setEditedPrice({
      origin_city: price.origin_city || "",
      destination_city: price.destination_city || "",
      vehicle_type: price.vehicle_type || "",
      base_price: price.base_price,
      price_per_km: price.price_per_km || 0,
      currency: price.currency,
    })
  }

  const handleSavePrice = async (id: string) => {
    setIsSubmitting(true)
    try {
      await updatePricingRule(id, editedPrice)
      mutate('pricing_rules')
      setEditingPriceId(null)
    } catch (error) {
      console.error('Erro ao atualizar preço:', error)
      alert('Erro ao atualizar preço')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditService = (service: any) => {
    setEditingServiceId(service.id)
    setEditedService({
      name: service.name,
      price: service.price,
      description: service.description || "",
      name_en: service.name_en || "",
      name_es: service.name_es || "",
      description_en: service.description_en || "",
      description_es: service.description_es || "",
    })
  }

  const handleSaveService = async (id: string) => {
    setIsSubmitting(true)
    try {
      await updateExtra(id, editedService)
      mutate('extras')
      setEditingServiceId(null)
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error)
      alert('Erro ao atualizar serviço')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePrice = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este preço?')) {
      try {
        await deletePricingRule(id)
        mutate('pricing_rules')
      } catch (error) {
        console.error('Erro ao deletar preço:', error)
        alert('Erro ao deletar preço')
      }
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deleteExtra(id)
        mutate('extras')
      } catch (error) {
        console.error('Erro ao deletar serviço:', error)
        alert('Erro ao deletar serviço')
      }
    }
  }

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createPricingRule(editedPrice)
      mutate('pricing_rules')
      setShowAddPriceModal(false)
      setEditedPrice({
        origin_city: "",
        destination_city: "",
        vehicle_type: "",
        base_price: 0,
        price_per_km: 0,
        currency: "USD",
      })
    } catch (error) {
      console.error('Erro ao criar preço:', error)
      alert('Erro ao criar preço')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createExtra(editedService)
      mutate('extras')
      setShowAddServiceModal(false)
      setEditedService({
        name: "",
        price: 0,
        description: "",
        name_en: "",
        name_es: "",
        description_en: "",
        description_es: "",
      })
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      alert('Erro ao criar serviço')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Preços e Serviços</h1>
      </div>

      {/* Pricing Rules Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Regras de Preço</h2>
            <button
              onClick={() => setShowAddPriceModal(true)}
              className="btn-primary bg-secondary flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Preço
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Veículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço/km</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pricing?.map((price) => (
                <tr key={price.id}>
                  <td className="px-6 py-4">
                    {editingPriceId === price.id ? (
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        value={editedPrice.origin_city}
                        onChange={(e) => setEditedPrice({ ...editedPrice, origin_city: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm">{price.origin_city || 'Qualquer'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === price.id ? (
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        value={editedPrice.destination_city}
                        onChange={(e) => setEditedPrice({ ...editedPrice, destination_city: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm">{price.destination_city || 'Qualquer'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === price.id ? (
                      <select
                        className="w-full px-2 py-1 border rounded"
                        value={editedPrice.vehicle_type}
                        onChange={(e) => setEditedPrice({ ...editedPrice, vehicle_type: e.target.value })}
                      >
                        <option value="">Qualquer</option>
                        <option value="Business Class">Business Class</option>
                        <option value="First Class">First Class</option>
                        <option value="Business Van/SUV">Business Van/SUV</option>
                      </select>
                    ) : (
                      <span className="text-sm">{price.vehicle_type || 'Qualquer'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === price.id ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-2 py-1 border rounded"
                        value={editedPrice.base_price}
                        onChange={(e) => setEditedPrice({ ...editedPrice, base_price: parseFloat(e.target.value) })}
                      />
                    ) : (
                      <span className="text-sm">{price.currency} {price.base_price.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingPriceId === price.id ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-2 py-1 border rounded"
                        value={editedPrice.price_per_km}
                        onChange={(e) => setEditedPrice({ ...editedPrice, price_per_km: parseFloat(e.target.value) })}
                      />
                    ) : (
                      <span className="text-sm">{price.currency} {(price.price_per_km || 0).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {editingPriceId === price.id ? (
                        <>
                          <button
                            onClick={() => handleSavePrice(price.id)}
                            disabled={isSubmitting}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditPrice(price)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePrice(price.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra Services Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Serviços Extras</h2>
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="btn-primary bg-secondary flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {extraServices?.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                {editingServiceId === service.id ? (
                  <input
                    type="text"
                    className="font-medium text-lg border-b border-gray-300 bg-transparent"
                    value={editedService.name}
                    onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                  />
                ) : (
                  <h3 className="font-medium text-lg">{service.name}</h3>
                )}
                <div className="flex items-center space-x-1">
                  {editingServiceId === service.id ? (
                    <>
                      <button
                        onClick={() => handleSaveService(service.id)}
                        disabled={isSubmitting}
                        className="text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingServiceId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingServiceId === service.id ? (
                <textarea
                  className="w-full text-sm text-gray-600 border rounded p-2 mb-3"
                  rows={3}
                  value={editedService.description}
                  onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  {editingServiceId === service.id ? (
                    <input
                      type="number"
                      step="0.01"
                      className="text-lg font-bold text-[#E95440] border-b border-gray-300 bg-transparent w-20"
                      value={editedService.price}
                      onChange={(e) => setEditedService({ ...editedService, price: parseFloat(e.target.value) })}
                    />
                  ) : (
                    <span className="text-lg font-bold text-[#E95440]">${service.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Price Modal */}
      {showAddPriceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Adicionar Regra de Preço</h2>
              <form onSubmit={handleAddPrice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade de Origem</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={editedPrice.origin_city}
                    onChange={(e) => setEditedPrice({ ...editedPrice, origin_city: e.target.value })}
                    placeholder="Deixe vazio para qualquer origem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade de Destino</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={editedPrice.destination_city}
                    onChange={(e) => setEditedPrice({ ...editedPrice, destination_city: e.target.value })}
                    placeholder="Deixe vazio para qualquer destino"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Veículo</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={editedPrice.vehicle_type}
                    onChange={(e) => setEditedPrice({ ...editedPrice, vehicle_type: e.target.value })}
                  >
                    <option value="">Qualquer tipo</option>
                    <option value="Business Class">Business Class</option>
                    <option value="First Class">First Class</option>
                    <option value="Business Van/SUV">Business Van/SUV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preço Base ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={editedPrice.base_price}
                    onChange={(e) => setEditedPrice({ ...editedPrice, base_price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preço por km ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                    value={editedPrice.price_per_km}
                    onChange={(e) => setEditedPrice({ ...editedPrice, price_per_km: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPriceModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#E95440] text-white rounded-lg hover:bg-[#d63d2a] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Adicionar Serviço Extra</h2>
              <form onSubmit={handleAddService} className="space-y-4">
                {/* Campos obrigatórios em Português */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Informações Principais (Português)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome do Serviço *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                        value={editedService.name}
                        onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                        placeholder="Nome do Serviço"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição *</label>
                      <textarea
                        rows={3}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                        value={editedService.description}
                        onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                        placeholder="Descrição"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Preço ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                        value={editedService.price}
                        onChange={(e) => setEditedService({ ...editedService, price: parseFloat(e.target.value) })}
                        placeholder="Preço ($)"
                      />
                    </div>
                  </div>
                </div>

                {/* Campos opcionais de tradução */}
                <div className="p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Traduções</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Inglês */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Inglês</h4>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome em Inglês</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                          value={editedService.name_en}
                          onChange={(e) => setEditedService({ ...editedService, name_en: e.target.value })}
                          placeholder="Nome em Inglês (opcional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição em Inglês</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                          value={editedService.description_en}
                          onChange={(e) => setEditedService({ ...editedService, description_en: e.target.value })}
                          placeholder="Descrição em Inglês (opcional)"
                        />
                      </div>
                    </div>

                    {/* Espanhol */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Espanhol</h4>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome em Espanhol</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                          value={editedService.name_es}
                          onChange={(e) => setEditedService({ ...editedService, name_es: e.target.value })}
                          placeholder="Nome em Espanhol (opcional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Descrição em Espanhol</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440]"
                          value={editedService.description_es}
                          onChange={(e) => setEditedService({ ...editedService, description_es: e.target.value })}
                          placeholder="Descrição em Espanhol (opcional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#E95440] text-white rounded-lg hover:bg-[#d63d2a] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
