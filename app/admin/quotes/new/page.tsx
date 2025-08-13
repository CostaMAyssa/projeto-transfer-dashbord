"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Save,
  Send,
  Calculator,
  MapPin,
  User,
  Car,
  Calendar,
  Clock,
  DollarSign
} from "lucide-react"

export default function NewQuotePage() {
  const [formData, setFormData] = useState({
    // Dados do cliente
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    
    // Dados do trajeto
    pickup_address: "",
    pickup_date: "",
    pickup_time: "",
    destination_address: "",
    
    // Dados do veículo
    vehicle_type: "",
    passengers: 1,
    luggage: 0,
    
    // Preços
    base_price: 0,
    distance_km: 0,
    price_per_km: 0,
    extras: [] as string[],
    total_amount: 0,
    
    // Configurações
    expires_days: 7,
    notes: "",
    include_return: false,
    return_date: "",
    return_time: ""
  })

  const [isCalculating, setIsCalculating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock data - será substituído por dados reais do Supabase
  const vehicleTypes = [
    { id: "standard", name: "Standard Sedan", base_price: 60, price_per_km: 2.50, capacity: 3 },
    { id: "premium", name: "Premium Sedan", base_price: 80, price_per_km: 3.20, capacity: 3 },
    { id: "suv", name: "SUV", base_price: 100, price_per_km: 4.00, capacity: 6 },
    { id: "premium-suv", name: "Premium SUV", base_price: 150, price_per_km: 5.50, capacity: 6 },
    { id: "van", name: "Van", base_price: 120, price_per_km: 4.50, capacity: 8 }
  ]

  const availableExtras = [
    { id: "child-seat", name: "Cadeira para criança", price: 15 },
    { id: "booster", name: "Assento elevatório", price: 12 },
    { id: "wifi", name: "Wi-Fi durante viagem", price: 8 },
    { id: "water", name: "Água e bebidas", price: 10 },
    { id: "meet-greet", name: "Serviço Meet & Greet", price: 25 }
  ]

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicleTypes.find(v => v.id === vehicleId)
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        vehicle_type: vehicleId,
        base_price: vehicle.base_price,
        price_per_km: vehicle.price_per_km
      }))
      calculateTotal()
    }
  }

  const calculateDistance = async () => {
    setIsCalculating(true)
    // Aqui você integraria com Google Maps API ou similar
    setTimeout(() => {
      const mockDistance = Math.floor(Math.random() * 50) + 10 // 10-60 km
      setFormData(prev => ({
        ...prev,
        distance_km: mockDistance
      }))
      calculateTotal()
      setIsCalculating(false)
    }, 1500)
  }

  const calculateTotal = () => {
    const { base_price, distance_km, price_per_km, include_return } = formData
    const extrasTotal = formData.extras.reduce((sum, extraId) => {
      const extra = availableExtras.find(e => e.id === extraId)
      return sum + (extra?.price || 0)
    }, 0)
    
    const tripCost = base_price + (distance_km * price_per_km)
    const totalCost = (include_return ? tripCost * 2 : tripCost) + extrasTotal
    
    setFormData(prev => ({
      ...prev,
      total_amount: totalCost
    }))
  }

  const handleExtraToggle = (extraId: string) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }))
    setTimeout(calculateTotal, 0)
  }

  const handleSave = async (status: 'draft' | 'sent') => {
    setIsSaving(true)
    
    // Aqui você salvaria no Supabase
    console.log('Salvando orçamento...', { ...formData, status })
    
    setTimeout(() => {
      setIsSaving(false)
      // Redirecionar para lista ou mostrar sucesso
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quotes" className="text-text-gray hover:text-text-dark">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-medium text-text-dark">Novo Orçamento</h1>
            <p className="text-text-gray text-sm mt-1">Crie um orçamento personalizado para o cliente</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="btn-secondary flex items-center text-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Rascunho
          </button>
          <button
            onClick={() => handleSave('sent')}
            disabled={isSaving || !formData.customer_email}
            className="btn-primary bg-secondary flex items-center text-sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Orçamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados do Cliente */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium text-text-dark">Dados do Cliente</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  className="input-standard w-full"
                  value={formData.customer_name}
                  onChange={(e) => setFormData(prev => ({...prev, customer_name: e.target.value}))}
                  placeholder="João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  className="input-standard w-full"
                  value={formData.customer_email}
                  onChange={(e) => setFormData(prev => ({...prev, customer_email: e.target.value}))}
                  placeholder="joao@email.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="input-standard w-full"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData(prev => ({...prev, customer_phone: e.target.value}))}
                  placeholder="(11) 99999-9999"
                />
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
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Endereço de Origem *
                </label>
                <input
                  type="text"
                  required
                  className="input-standard w-full"
                  value={formData.pickup_address}
                  onChange={(e) => setFormData(prev => ({...prev, pickup_address: e.target.value}))}
                  placeholder="Aeroporto JFK, Terminal 4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Endereço de Destino *
                </label>
                <input
                  type="text"
                  required
                  className="input-standard w-full"
                  value={formData.destination_address}
                  onChange={(e) => setFormData(prev => ({...prev, destination_address: e.target.value}))}
                  placeholder="Times Square Hotel, Manhattan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Data da Viagem *
                  </label>
                  <input
                    type="date"
                    required
                    className="input-standard w-full"
                    value={formData.pickup_date}
                    onChange={(e) => setFormData(prev => ({...prev, pickup_date: e.target.value}))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    required
                    className="input-standard w-full"
                    value={formData.pickup_time}
                    onChange={(e) => setFormData(prev => ({...prev, pickup_time: e.target.value}))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="include_return"
                  checked={formData.include_return}
                  onChange={(e) => setFormData(prev => ({...prev, include_return: e.target.checked}))}
                  className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                />
                <label htmlFor="include_return" className="text-sm font-medium text-text-dark">
                  Incluir viagem de volta
                </label>
              </div>

              {formData.include_return && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Data de Volta
                    </label>
                    <input
                      type="date"
                      className="input-standard w-full"
                      value={formData.return_date}
                      onChange={(e) => setFormData(prev => ({...prev, return_date: e.target.value}))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Horário de Volta
                    </label>
                    <input
                      type="time"
                      className="input-standard w-full"
                      value={formData.return_time}
                      onChange={(e) => setFormData(prev => ({...prev, return_time: e.target.value}))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Veículo e Extras */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium text-text-dark">Veículo e Serviços</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Tipo de Veículo *
                </label>
                <select
                  required
                  className="input-standard w-full"
                  value={formData.vehicle_type}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                >
                  <option value="">Selecione um veículo</option>
                  {vehicleTypes.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} (até {vehicle.capacity} passageiros) - ${vehicle.base_price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Número de Passageiros
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="input-standard w-full"
                    value={formData.passengers}
                    onChange={(e) => setFormData(prev => ({...prev, passengers: parseInt(e.target.value)}))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Bagagens Grandes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="input-standard w-full"
                    value={formData.luggage}
                    onChange={(e) => setFormData(prev => ({...prev, luggage: parseInt(e.target.value)}))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-3">
                  Serviços Extras
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableExtras.map(extra => (
                    <div key={extra.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={extra.id}
                        checked={formData.extras.includes(extra.id)}
                        onChange={() => handleExtraToggle(extra.id)}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                      />
                      <label htmlFor={extra.id} className="text-sm text-text-dark flex-1">
                        {extra.name} (+${extra.price})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Resumo e Configurações */}
        <div className="space-y-6">
          {/* Cálculo de Preços */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium text-text-dark">Cálculo de Preços</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  className="input-standard flex-1"
                  value={formData.distance_km}
                  onChange={(e) => setFormData(prev => ({...prev, distance_km: parseFloat(e.target.value)}))}
                  placeholder="Distância (km)"
                />
                <button
                  onClick={calculateDistance}
                  disabled={!formData.pickup_address || !formData.destination_address || isCalculating}
                  className="btn-secondary text-sm"
                >
                  {isCalculating ? "..." : "Calcular"}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-gray">Preço base:</span>
                  <span className="font-medium">${formData.base_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-gray">Distância ({formData.distance_km}km):</span>
                  <span className="font-medium">${(formData.distance_km * formData.price_per_km).toFixed(2)}</span>
                </div>
                {formData.include_return && (
                  <div className="flex justify-between">
                    <span className="text-text-gray">Viagem de volta:</span>
                    <span className="font-medium">${(formData.base_price + (formData.distance_km * formData.price_per_km)).toFixed(2)}</span>
                  </div>
                )}
                {formData.extras.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-gray">Extras:</span>
                    <span className="font-medium">
                      ${formData.extras.reduce((sum, extraId) => {
                        const extra = availableExtras.find(e => e.id === extraId)
                        return sum + (extra?.price || 0)
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-secondary">${formData.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium text-text-dark">Configurações</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Validade do Orçamento (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="input-standard w-full"
                  value={formData.expires_days}
                  onChange={(e) => setFormData(prev => ({...prev, expires_days: parseInt(e.target.value)}))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Observações
                </label>
                <textarea
                  rows={3}
                  className="input-standard w-full"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Informações adicionais para o cliente..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 