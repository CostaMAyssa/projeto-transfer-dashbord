"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getQuoteByReference, updateQuote } from "@/hooks/useQuotes"
import { useVehicleCategories } from "@/hooks/useVehicleCategories"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"

export default function EditQuotePage() {
  const params = useParams()
  const router = useRouter()
  const quoteId = params.id as string
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const { categories: vehicleCategories } = useVehicleCategories()

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_address: '',
    destination_address: '',
    pickup_date: '',
    pickup_time: '',
    return_date: '',
    return_time: '',
    passengers: 1,
    vehicle_category_id: '',
    base_price: 0,
    extras_price: 0,
    total_amount: 0,
    notes: '',
    flight_number: '',
    airline: '',
    quote_type: 'one-way' as 'one-way' | 'round-trip' | 'hourly',
    service_hours: 2
  })

  // Buscar dados do orçamento
  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) return
      
      try {
        setLoading(true)
        const quoteData = await getQuoteByReference(quoteId)
        
        if (quoteData) {
          setQuote(quoteData)
          setFormData({
            customer_name: quoteData.customer_name || '',
            customer_email: quoteData.customer_email || '',
            customer_phone: quoteData.customer_phone || '',
            pickup_address: quoteData.pickup_address || '',
            destination_address: quoteData.destination_address || '',
            pickup_date: quoteData.pickup_date || '',
            pickup_time: quoteData.pickup_time || '',
            return_date: quoteData.return_date || '',
            return_time: quoteData.return_time || '',
            passengers: quoteData.passengers || 1,
            vehicle_category_id: quoteData.vehicle_category_id || '',
            base_price: quoteData.base_price || 0,
            extras_price: quoteData.extras_price || 0,
            total_amount: quoteData.total_amount || 0,
            notes: quoteData.notes || '',
            flight_number: quoteData.flight_number || '',
            airline: quoteData.airline || '',
            quote_type: quoteData.quote_type || 'one-way',
            service_hours: quoteData.service_hours || 2
          })
        } else {
          console.error('Orçamento não encontrado')
          router.push('/admin/quotes')
        }
      } catch (error) {
        console.error('Erro ao buscar orçamento:', error)
        router.push('/admin/quotes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [quoteId, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    
    // Recalcular total quando preços mudam
    if (field === 'base_price' || field === 'extras_price') {
      const newBasePrice = field === 'base_price' ? Number(value) : formData.base_price
      const newExtrasPrice = field === 'extras_price' ? Number(value) : formData.extras_price
      const newTotal = newBasePrice + newExtrasPrice
      setFormData((prev: any) => ({ ...prev, total_amount: newTotal }))
    }
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Nome é obrigatório'
    if (!formData.customer_email.trim()) newErrors.customer_email = 'Email é obrigatório'
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Telefone é obrigatório'
    if (!formData.pickup_address.trim()) newErrors.pickup_address = 'Endereço de origem é obrigatório'
    if (!formData.destination_address.trim()) newErrors.destination_address = 'Endereço de destino é obrigatório'
    if (!formData.pickup_date) newErrors.pickup_date = 'Data é obrigatória'
    if (!formData.pickup_time) newErrors.pickup_time = 'Horário é obrigatório'
    if (!formData.vehicle_category_id) newErrors.vehicle_category_id = 'Categoria de veículo é obrigatória'
    if (formData.passengers < 1) newErrors.passengers = 'Número de passageiros deve ser maior que 0'
    if (formData.base_price < 0) newErrors.base_price = 'Preço base não pode ser negativo'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      alert('Por favor, corrija os erros no formulário')
      return
    }

    try {
      setSaving(true)
      
      const updateData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        pickup_address: formData.pickup_address,
        destination_address: formData.destination_address,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        return_date: formData.return_date || null,
        return_time: formData.return_time || null,
        passengers: formData.passengers,
        vehicle_category_id: formData.vehicle_category_id,
        base_price: formData.base_price,
        extras_price: formData.extras_price,
        total_amount: formData.total_amount,
        notes: formData.notes || null,
        flight_number: formData.flight_number || null,
        airline: formData.airline || null,
        quote_type: formData.quote_type,
        service_hours: formData.service_hours
      }
      
      const updatedQuote = await updateQuote(quote.id, updateData)
      
      if (updatedQuote) {
        alert('Orçamento atualizado com sucesso!')
        router.push(`/admin/quotes/${quoteId}`)
      } else {
        throw new Error('Falha ao atualizar orçamento')
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
      alert('Erro ao salvar orçamento. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/quotes" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-medium text-text-dark">Carregando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/quotes" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-medium text-text-dark">
              Editar Orçamento {quote?.booking_reference}
            </h1>
            <p className="text-text-gray text-sm mt-1">
              Modifique os dados do orçamento
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/admin/quotes/${quoteId}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-dark">Dados do Cliente</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.customer_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_name && (
                <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.customer_email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_email && (
                <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customer_phone && (
                <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>
              )}
            </div>
          </div>

          {/* Dados do Trajeto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-dark">Dados do Trajeto</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Viagem
              </label>
              <select
                value={formData.quote_type}
                onChange={(e) => handleInputChange('quote_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="one-way">Só Ida</option>
                <option value="round-trip">Ida e Volta</option>
                <option value="hourly">Por Horas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço de Origem *
              </label>
              <textarea
                value={formData.pickup_address}
                onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                rows={2}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.pickup_address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickup_address && (
                <p className="text-red-500 text-xs mt-1">{errors.pickup_address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço de Destino *
              </label>
              <textarea
                value={formData.destination_address}
                onChange={(e) => handleInputChange('destination_address', e.target.value)}
                rows={2}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.destination_address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.destination_address && (
                <p className="text-red-500 text-xs mt-1">{errors.destination_address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.pickup_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickup_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.pickup_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário *
                </label>
                <input
                  type="time"
                  value={formData.pickup_time}
                  onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.pickup_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickup_time && (
                  <p className="text-red-500 text-xs mt-1">{errors.pickup_time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dados do Veículo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-dark">Veículo e Passageiros</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria do Veículo *
              </label>
              <select
                value={formData.vehicle_category_id}
                onChange={(e) => handleInputChange('vehicle_category_id', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.vehicle_category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {vehicleCategories && vehicleCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.vehicle_category_id && (
                <p className="text-red-500 text-xs mt-1">{errors.vehicle_category_id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Passageiros *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.passengers}
                onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.passengers ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.passengers && (
                <p className="text-red-500 text-xs mt-1">{errors.passengers}</p>
              )}
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-dark">Preços</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Base (R$) *
              </label>
              <input
                type="text"
                value={formData.base_price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,]/g, '');
                  const numericValue = parseFloat(value.replace(',', '.')) || 0;
                  handleInputChange('base_price', numericValue);
                }}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.base_price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.base_price && (
                <p className="text-red-500 text-xs mt-1">{errors.base_price}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço de Extras (R$)
              </label>
              <input
                type="text"
                value={formData.extras_price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.,]/g, '');
                  const numericValue = parseFloat(value.replace(',', '.')) || 0;
                  handleInputChange('extras_price', numericValue);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total (R$)
              </label>
              <input
                type="number"
                value={formData.total_amount}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        {/* Informações Adicionais */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-text-dark">Informações Adicionais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Voo
              </label>
              <input
                type="text"
                value={formData.flight_number}
                onChange={(e) => handleInputChange('flight_number', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Companhia Aérea
              </label>
              <input
                type="text"
                value={formData.airline}
                onChange={(e) => handleInputChange('airline', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Observações adicionais sobre o orçamento..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}