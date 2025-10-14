"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useZones } from "@/hooks/useZones"
import { useVehicleCategories } from "@/hooks/useVehicleCategories"
import { useZonePricing } from "@/hooks/useZonePricing"
import { useExtras } from "@/hooks/useExtras"
import { createQuote } from "@/hooks/useQuotes"
import { AddressAutocomplete } from "@/components/AddressAutocomplete"
import { detectZone } from "@/lib/zone-pricing"
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete"
import { useFlightData } from "@/hooks/useFlightData"
import { redirectAfterSave } from "./fix-redirect"
import { supabase } from '@/lib/supabase'
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
  DollarSign,
  Plus,
  Minus,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function NewQuotePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Dados do cliente
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_cpf: "",
    
    // Dados do trajeto
    quote_type: "one-way" as "one-way" | "round-trip" | "hourly",
    pickup_zone_id: "",
    pickup_address: "",
    pickup_coordinates: null as [number, number] | null,
    pickup_date: "",
    pickup_time: "",
    destination_zone_id: "",
    destination_address: "",
    destination_coordinates: null as [number, number] | null,
    // Round-trip
    return_date: "",
    return_time: "",
    trip_duration_days: 0,
    return_pickup_address: "",
    return_pickup_coordinates: null as [number, number] | null,
    return_pickup_zone_id: "",
    return_destination_address: "",
    return_destination_coordinates: null as [number, number] | null,
    return_destination_zone_id: "",
    // Hourly
    service_hours: 2,
    airport_destination: "",
    airport_destination_coordinates: null as [number, number] | null,
    service_type: "" as "airport-dropoff" | "airport-pickup" | "",
    airline: "",
    flight_number: "",
    no_flight_info: false,
    
    // Dados do veículo
    vehicle_category_id: "",
    passengers: 1,
    luggage_large: 0,
    luggage_small: 0,
    
    // Preços
    base_price: 0,
    extras: {} as Record<string, number>, // { extraId: quantity }
    total_amount: 0,
    
    // Configurações
    expires_days: 7,
    notes: "",

  })
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [clientSearchResults, setClientSearchResults] = useState<any[]>([])
  const [isSearchingClient, setIsSearchingClient] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  
  // Hook para buscar dados de voo
  const { flightData, loading: isLoadingFlight, error: flightError, searchFlight } = useFlightData()
  
  // Componente para exibir erro de campo
  const FieldError = ({ fieldName }: { fieldName: string }) => {
    if (!validationErrors[fieldName]) return null
    return (
      <p className="text-red-500 text-sm mt-1">
        {validationErrors[fieldName]}
      </p>
    )
  }

  const [isSaving, setIsSaving] = useState(false)

  // Hooks do Supabase
  const { zones, loading: zonesLoading } = useZones()
  const { categories, loading: categoriesLoading } = useVehicleCategories()
  
  // Função para buscar cliente por CPF
  const searchClientByCPF = async (cpf: string) => {
    if (!cpf || cpf.length < 11) {
      setClientSearchResults([])
      return
    }
    
    setIsSearchingClient(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('customer_cpf', cpf.replace(/\D/g, '')) // Remove caracteres não numéricos
        .limit(5)
      
      if (error) {
        console.error('Erro ao buscar cliente:', error)
        setClientSearchResults([])
      } else {
        setClientSearchResults(data || [])
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      setClientSearchResults([])
    } finally {
      setIsSearchingClient(false)
    }
  }
  
  // Função para selecionar cliente encontrado
  const selectClient = (client: any) => {
    setSelectedClient(client)
    setFormData(prev => ({
      ...prev,
      customer_name: client.full_name,
      customer_email: client.email,
      customer_phone: client.phone,
      customer_cpf: client.customer_cpf
    }))
    setClientSearchResults([])
  }
  
  // Função para buscar informações de voo e ajustar data/hora automaticamente
  const handleFlightSearch = async () => {
    if (!formData.flight_number) {
      return
    }
    
    try {
      // API agora espera apenas o número do voo (sem prefixo IATA)
      const flightNumber = formData.flight_number
      // Usar a data do formulário formatada para YYYY-MM-DD
      const searchDate = formData.pickup_date ? 
        new Date(formData.pickup_date).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0]
      
      console.log('🔍 Buscando informações do voo:', {
        flightNumber,
        searchDate,
        formDataPickupDate: formData.pickup_date,
        timestamp: new Date().toISOString()
      })
      
      const flightInfo = await searchFlight(flightNumber, searchDate)
      
      if (flightInfo) {
        // Apenas exibir as informações do voo encontrado
        console.log('Informações de voo encontradas:', flightInfo)
        // Os dados do voo serão exibidos através dos indicadores visuais já implementados
      }
    } catch (error) {
      console.error('Erro ao buscar informações de voo:', error)
    }
  }
  
  // Função para limpar seleção de cliente
  const clearClientSelection = () => {
    setSelectedClient(null)
    setFormData(prev => ({
      ...prev,
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      customer_cpf: ''
    }))
    setClientSearchResults([])
  }
  
  // useEffect para buscar informações de voo automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.flight_number && formData.flight_number.length >= 3) {
        handleFlightSearch()
      }
    }, 1000) // Debounce de 1 segundo
    
    return () => clearTimeout(timer)
  }, [formData.flight_number])
  
  const { getPrice, loading: pricingLoading } = useZonePricing()
  const { data: availableExtras, isLoading: extrasLoading } = useExtras()

  // Função para detectar zona baseada nas coordenadas
  const detectZoneFromCoordinates = async (lat: number, lng: number) => {
    try {
      const zoneResult = await detectZone(lat, lng)
      return zoneResult.zone_id
    } catch (error) {
      console.error('Erro ao detectar zona:', error)
      return null
    }
  }

  // Função para buscar preço baseado nas zonas selecionadas
  const getRouteBasePrice = (vehicleCategoryId: string, pickupZoneId: string, destinationZoneId: string) => {
    console.log('🔍 getRouteBasePrice chamada:', {
      vehicleCategoryId,
      pickupZoneId,
      destinationZoneId
    })
    
    if (!pickupZoneId || !destinationZoneId || !vehicleCategoryId) {
      console.log('❌ Parâmetros faltando:', { pickupZoneId, destinationZoneId, vehicleCategoryId })
      return 0
    }
    
    const price = getPrice(pickupZoneId, destinationZoneId, vehicleCategoryId)
    console.log('💰 Preço da matriz:', price)
    
    if (price !== null) {
      return price
    }
    
    // Fallback para preço base da categoria
    const category = categories.find(c => c.id === vehicleCategoryId)
    const fallbackPrice = category?.base_price || 0
    console.log('🔄 Fallback para categoria:', { category: category?.name, fallbackPrice })
    
    return fallbackPrice
  }

  const handleVehicleChange = (vehicleCategoryId: string) => {
    const category = categories.find(c => c.id === vehicleCategoryId)
    if (category) {
      setFormData(prev => ({
        ...prev,
        vehicle_category_id: vehicleCategoryId
      }))
      calculateTotal()
    }
  }

  // Função para calcular duração em dias
  const calculateTripDuration = (pickupDate: string, returnDate: string) => {
    if (!pickupDate || !returnDate) return 0
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    const diffTime = Math.abs(returnD.getTime() - pickup.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Handler para aeroporto de destino na modalidade Hourly
  const handleAirportDestinationPlaceSelect = async (place: any) => {
    try {
      // Garantir que temos lat/lng através do details
      const details = await getAddressDetails(place.place_id)
      const lat = details?.geometry?.location?.lat
      const lng = details?.geometry?.location?.lng
      
      if (lat && lng) {
        const zoneId = await detectZoneFromCoordinates(lat, lng)
        setFormData(prev => ({
          ...prev,
          airport_destination: place.description,
          airport_destination_coordinates: [lng, lat],
          destination_zone_id: zoneId || ""
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          airport_destination: place.description,
          destination_zone_id: ""
        }))
      }
    } catch (error) {
      console.error('Erro ao processar endereço do aeroporto:', error)
      setFormData(prev => ({
        ...prev,
        airport_destination: place.description,
        destination_zone_id: ""
      }))
    }
  }

  // Função para lidar com seleção de endereço de origem da volta
  const handleReturnPickupPlaceSelect = async (place: any) => {
    try {
      const details = await getAddressDetails(place.place_id)
      const lat = details?.geometry?.location?.lat
      const lng = details?.geometry?.location?.lng
      
      if (lat && lng) {
        const zoneId = await detectZoneFromCoordinates(lat, lng)
        setFormData(prev => ({
          ...prev,
          return_pickup_address: place.description,
          return_pickup_coordinates: [lng, lat],
          return_pickup_zone_id: zoneId || ""
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          return_pickup_address: place.description,
          return_pickup_zone_id: ""
        }))
      }
    } catch (error) {
      console.error('Erro ao processar endereço de origem da volta:', error)
      setFormData(prev => ({
        ...prev,
        return_pickup_address: place.description,
        return_pickup_zone_id: ""
      }))
    }
  }

  // Função para lidar com seleção de endereço de destino da volta
  const handleReturnDestinationPlaceSelect = async (place: any) => {
    try {
      const details = await getAddressDetails(place.place_id)
      const lat = details?.geometry?.location?.lat
      const lng = details?.geometry?.location?.lng
      
      if (lat && lng) {
        const zoneId = await detectZoneFromCoordinates(lat, lng)
        setFormData(prev => ({
          ...prev,
          return_destination_address: place.description,
          return_destination_coordinates: [lng, lat],
          return_destination_zone_id: zoneId || ""
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          return_destination_address: place.description,
          return_destination_zone_id: ""
        }))
      }
    } catch (error) {
      console.error('Erro ao processar endereço de destino da volta:', error)
      setFormData(prev => ({
        ...prev,
        return_destination_address: place.description,
        return_destination_zone_id: ""
      }))
    }
  }

  const calculateTotal = () => {
    const { quote_type, service_hours, vehicle_category_id, pickup_zone_id, destination_zone_id } = formData
    
    console.log('🔄 Calculando total:', {
      quote_type,
      vehicle_category_id,
      pickup_zone_id,
      destination_zone_id,
      service_hours,
      formDataExtras: formData.extras
    })
    
    const extrasTotal = Object.entries(formData.extras).reduce((sum: number, [extraId, quantity]: [string, number]) => {
      const extra = availableExtras?.find(e => e.id === extraId)
      const extraPrice = (extra?.price || 0) * quantity
      console.log(`Extra ${extra?.name}: $${extra?.price} x ${quantity} = $${extraPrice}`)
      return sum + extraPrice
    }, 0)
    
    console.log('💰 Extras total:', extrasTotal)
    
    let totalCost = 0
    let basePrice = 0
    
    // Verificar se há localizações fora de cobertura
    const hasOutOfCoverage = (
      (formData.pickup_address && !formData.pickup_zone_id) ||
      (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
      (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
      (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
      (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip")
    )
    
    if (hasOutOfCoverage && formData.base_price > 0) {
      // Usar preço personalizado quando há localizações fora de cobertura
      basePrice = formData.base_price
      totalCost = basePrice + extrasTotal
      console.log('🎯 Using custom price for out of coverage:', { basePrice, extrasTotal, totalCost })
    } else if (quote_type === "hourly") {
      // Lógica correta: 1-2h = $100/h, 3+h = $80/h
      if (service_hours <= 2) {
        basePrice = 100 * Math.max(1, service_hours)
      } else {
        basePrice = 80 * Math.max(1, service_hours)
      }
      totalCost = basePrice + extrasTotal
      console.log('⏰ Hourly calculation:', { basePrice, extrasTotal, totalCost })
    } else {
      // One-way ou Round-trip por matriz de rota
      basePrice = getRouteBasePrice(vehicle_category_id, pickup_zone_id, destination_zone_id)
      
      // Se não conseguiu obter preço da rota, usar preço padrão
      if (basePrice === 0 && vehicle_category_id) {
        const category = categories.find(c => c.id === vehicle_category_id)
        basePrice = category?.base_price || 130 // Preço padrão se não encontrar
        console.log('🔄 Usando preço padrão da categoria:', basePrice)
      }
      
      const multiplier = quote_type === "round-trip" ? 2 : 1
      const routeTotal = basePrice * multiplier
      totalCost = routeTotal + extrasTotal
      
      console.log('🚗 Route calculation:', {
        basePrice,
        multiplier,
        routeTotal,
        extrasTotal,
        totalCost
      })
    }
    
    console.log('📊 Final calculation:', { basePrice, extrasTotal, totalCost })
    
    setFormData(prev => {
      // Preservar o preço personalizado se estiver em modo de ajuste manual
      const finalBasePrice = hasOutOfCoverage && prev.base_price > 0 ? prev.base_price : basePrice
      const finalTotalCost = hasOutOfCoverage && prev.base_price > 0 ? prev.base_price + extrasTotal : totalCost
      
      console.log('🔧 CÁLCULO DE TOTAL - DETALHES:')
      console.log('  - hasOutOfCoverage:', hasOutOfCoverage)
      console.log('  - prev.base_price:', prev.base_price, '(tipo:', typeof prev.base_price, ')')
      console.log('  - basePrice calculado:', basePrice, '(tipo:', typeof basePrice, ')')
      console.log('  - extrasTotal:', extrasTotal, '(tipo:', typeof extrasTotal, ')')
      console.log('  - totalCost calculado:', totalCost, '(tipo:', typeof totalCost, ')')
      console.log('  - finalBasePrice (resultado):', finalBasePrice, '(tipo:', typeof finalBasePrice, ')')
      console.log('  - finalTotalCost (resultado):', finalTotalCost, '(tipo:', typeof finalTotalCost, ')')
      
      return {
        ...prev,
        base_price: finalBasePrice,
        total_amount: finalTotalCost
      }
    })
  }

  const handleExtraQuantityChange = (extraId: string, change: number) => {
    console.log('🎯 MUDANÇA DE EXTRA:')
    console.log('  - Extra ID:', extraId)
    console.log('  - Mudança:', change)
    
    setFormData(prev => {
      const currentQuantity = prev.extras[extraId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      
      // Encontrar dados do extra
      const extraData = availableExtras?.find(e => e.id === extraId)
      
      console.log('  - Extra nome:', extraData?.name || 'Desconhecido')
      console.log('  - Extra preço unitário:', extraData?.price || 0)
      console.log('  - Quantidade anterior:', currentQuantity)
      console.log('  - Nova quantidade:', newQuantity)
      console.log('  - Valor total deste extra:', (extraData?.price || 0) * newQuantity)
      
      const newExtras = { ...prev.extras }
      if (newQuantity === 0) {
        delete newExtras[extraId]
        console.log('  - Extra removido dos extras')
      } else {
        newExtras[extraId] = newQuantity
        console.log('  - Extra atualizado nos extras')
      }
      
      // Calcular novo total de extras
      const newExtrasTotal = Object.entries(newExtras).reduce((sum: number, [id, quantity]: [string, number]) => {
        const extra = availableExtras?.find(e => e.id === id)
        const extraPrice = (extra?.price || 0) * quantity
        return sum + extraPrice
      }, 0)
      
      console.log('  - Novo total de extras:', newExtrasTotal)
      console.log('  - Base price atual:', prev.base_price)
      console.log('  - Novo total geral será:', prev.base_price + newExtrasTotal)
      
      return {
        ...prev,
        extras: newExtras
      }
    })
    // Só recalcular se não estiver em modo de ajuste manual
    setTimeout(() => {
      const hasOutOfCoverage = (
        (formData.pickup_address && !formData.pickup_zone_id) ||
        (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
        (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
        (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
        (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip")
      )
      if (!(hasOutOfCoverage && formData.base_price > 0)) {
        calculateTotal()
      }
    }, 0)
  }

  // Recalcular total quando zonas ou veículo mudarem (exceto em modo de ajuste manual)
  useEffect(() => {
    const hasOutOfCoverage = (
      (formData.pickup_address && !formData.pickup_zone_id) ||
      (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
      (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
      (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
      (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip")
    )
    
    // Só recalcular automaticamente se não estiver em modo de ajuste manual ou se não há preço personalizado
    if (formData.vehicle_category_id && formData.pickup_zone_id && formData.destination_zone_id && !(hasOutOfCoverage && formData.base_price > 0)) {
      calculateTotal()
    }
  }, [formData.vehicle_category_id, formData.pickup_zone_id, formData.destination_zone_id, formData.quote_type, formData.service_hours, formData.extras])

  // Recalcular quando os dados de preços carregarem (exceto em modo de ajuste manual)
  useEffect(() => {
    const hasOutOfCoverage = (
      (formData.pickup_address && !formData.pickup_zone_id) ||
      (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
      (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
      (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
      (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip")
    )
    
    if (!pricingLoading && !categoriesLoading && !extrasLoading && formData.vehicle_category_id && formData.pickup_zone_id && formData.destination_zone_id && !(hasOutOfCoverage && formData.base_price > 0)) {
      calculateTotal()
    }
  }, [pricingLoading, categoriesLoading, extrasLoading, formData.vehicle_category_id, formData.pickup_zone_id, formData.destination_zone_id])

  // Função para lidar com seleção de endereço de origem
  const { getAddressDetails } = useAddressAutocomplete()

  const handlePickupPlaceSelect = async (place: any) => {
    try {
      // Garantir que temos lat/lng através do details
      const details = await getAddressDetails(place.place_id)
      const lat = details?.geometry?.location?.lat
      const lng = details?.geometry?.location?.lng
      
      if (lat && lng) {
        const zoneId = await detectZoneFromCoordinates(lat, lng)
        setFormData(prev => ({
          ...prev,
          pickup_address: place.description,
          pickup_coordinates: [lng, lat],
          pickup_zone_id: zoneId || ""
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          pickup_address: place.description,
          pickup_zone_id: ""
        }))
      }
    } catch (error) {
      console.error('Erro ao processar endereço de origem:', error)
      setFormData(prev => ({
        ...prev,
        pickup_address: place.description,
        pickup_zone_id: ""
      }))
    }
  }

  // Função para lidar com seleção de endereço de destino
  const handleDestinationPlaceSelect = async (place: any) => {
    try {
      // Garantir que temos lat/lng através do details
      const details = await getAddressDetails(place.place_id)
      const lat = details?.geometry?.location?.lat
      const lng = details?.geometry?.location?.lng
      
      if (lat && lng) {
        const zoneId = await detectZoneFromCoordinates(lat, lng)
        setFormData(prev => ({
          ...prev,
          destination_address: place.description,
          destination_coordinates: [lng, lat],
          destination_zone_id: zoneId || ""
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          destination_address: place.description,
          destination_zone_id: ""
        }))
      }
    } catch (error) {
      console.error('Erro ao processar endereço de destino:', error)
      setFormData(prev => ({
        ...prev,
        destination_address: place.description,
        destination_zone_id: ""
      }))
    }
  }

  // Função para validar campos obrigatórios
  const validateRequiredFields = () => {
    const errors: Record<string, string> = {}
    
    // Campos obrigatórios do cliente
    if (!formData.customer_name.trim()) {
      errors.customer_name = 'Nome completo é obrigatório'
    }
    if (!formData.customer_email.trim()) {
      errors.customer_email = 'E-mail é obrigatório'
    }
    if (!formData.customer_phone.trim()) {
      errors.customer_phone = 'Telefone é obrigatório'
    }
    
    // Campos obrigatórios do trajeto
    if (!formData.pickup_address.trim()) {
      errors.pickup_address = 'Endereço de origem é obrigatório'
    }
    if (!formData.pickup_date) {
      errors.pickup_date = 'Data da viagem é obrigatória'
    }
    if (!formData.pickup_time) {
      errors.pickup_time = 'Horário é obrigatório'
    }
    
    // Validar destino baseado no tipo de viagem
    if (formData.quote_type === 'hourly') {
      if (!formData.airport_destination.trim()) {
        errors.airport_destination = 'Endereço de destino é obrigatório'
      }
    } else {
      if (!formData.destination_address.trim()) {
        errors.destination_address = 'Endereço de destino é obrigatório'
      }
    }
    
    // Campos obrigatórios do veículo
    if (!formData.vehicle_category_id) {
      errors.vehicle_category_id = 'Tipo de veículo é obrigatório'
    }
    if (formData.passengers < 1) {
      errors.passengers = 'Número de passageiros deve ser pelo menos 1'
    }
    
    return errors
  }

  const handleSave = async (status: 'draft' | 'sent') => {
    // Validar campos obrigatórios
    const errors = validateRequiredFields()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsSaving(false)
      return
    }
    
    // Limpar erros se validação passou
    setValidationErrors({})
    setIsSaving(true)
    
    try {
      // Calcular preços dos extras
      const extrasTotal = Object.entries(formData.extras || {}).reduce((sum, [id, qty]) => {
        const extra = (availableExtras || []).find((e: any) => e.id === id)
        return sum + (extra ? Number(extra.price || 0) * Number(qty as number) : 0)
      }, 0)

      // Preparar dados para salvar no banco
      const quoteData = {
        booking_reference: `QT${Date.now().toString().slice(-6)}`,
        status,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_cpf: formData.customer_cpf || null,
        quote_type: formData.quote_type,
        pickup_address: formData.pickup_address,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        destination_address: formData.quote_type === 'hourly' ? formData.airport_destination : formData.destination_address,
        return_date: formData.quote_type === 'round-trip' ? formData.return_date : null,
        return_time: formData.quote_type === 'round-trip' ? formData.return_time : null,
        service_hours: formData.quote_type === 'hourly' ? formData.service_hours : null,
        service_type: formData.quote_type === 'hourly' ? (formData.service_type || null) : null,
        flight_number: formData.no_flight_info ? null : formData.flight_number,
        airline: formData.no_flight_info ? null : formData.airline,
        vehicle_category_id: formData.vehicle_category_id,
        passengers: formData.passengers || 1,
        luggage_large: formData.luggage_large || 0,
        luggage_small: formData.luggage_small || 0,
        base_price: Number(formData.base_price || 0),
        extras_price: extrasTotal,
        total_amount: Number(formData.total_amount || 0),
        extras: Object.keys(formData.extras || {}).length > 0 ? formData.extras : null,
        expires_days: formData.expires_days || 7,
        notes: formData.notes || null
      }

      // Debug: Análise completa dos dados antes de salvar
      console.log('\n=== 📋 ANÁLISE FRONTEND - PREPARAÇÃO DE DADOS ===')
      console.log('📝 FORMDATA ORIGINAL (do formulário):')
      console.log('  - customer_name:', formData.customer_name, '(tipo:', typeof formData.customer_name, ')')
      console.log('  - customer_email:', formData.customer_email, '(tipo:', typeof formData.customer_email, ')')
      console.log('  - customer_phone:', formData.customer_phone, '(tipo:', typeof formData.customer_phone, ')')
      console.log('  - vehicle_category_id:', formData.vehicle_category_id, '(tipo:', typeof formData.vehicle_category_id, ')')
      console.log('  - base_price:', formData.base_price, '(tipo:', typeof formData.base_price, ')')
      console.log('  - total_amount:', formData.total_amount, '(tipo:', typeof formData.total_amount, ')')
      console.log('  - quote_type:', formData.quote_type, '(tipo:', typeof formData.quote_type, ')')
      console.log('  - pickup_address:', formData.pickup_address, '(comprimento:', formData.pickup_address?.length, ')')
      console.log('  - destination_address:', formData.destination_address, '(comprimento:', formData.destination_address?.length, ')')
      console.log('  - pickup_date:', formData.pickup_date, '(tipo:', typeof formData.pickup_date, ')')
      console.log('  - pickup_time:', formData.pickup_time, '(tipo:', typeof formData.pickup_time, ')')
      console.log('  - passengers:', formData.passengers, '(tipo:', typeof formData.passengers, ')')
      console.log('  - status:', status, '(tipo:', typeof status, ')')
      
      console.log('\n🔄 QUOTEDATA PROCESSADO (para envio):')
      console.log('  - customer_name:', quoteData.customer_name, '(tipo:', typeof quoteData.customer_name, ')')
      console.log('  - customer_email:', quoteData.customer_email, '(tipo:', typeof quoteData.customer_email, ')')
      console.log('  - customer_phone:', quoteData.customer_phone, '(tipo:', typeof quoteData.customer_phone, ')')
      console.log('  - vehicle_category_id:', quoteData.vehicle_category_id, '(tipo:', typeof quoteData.vehicle_category_id, ')')
      console.log('  - base_price:', quoteData.base_price, '(tipo:', typeof quoteData.base_price, ', Number():', Number(quoteData.base_price), ')')
      console.log('  - total_amount:', quoteData.total_amount, '(tipo:', typeof quoteData.total_amount, ', Number():', Number(quoteData.total_amount), ')')
      console.log('  - quote_type:', quoteData.quote_type, '(tipo:', typeof quoteData.quote_type, ')')
      console.log('  - pickup_address:', quoteData.pickup_address, '(comprimento:', quoteData.pickup_address?.length, ')')
      console.log('  - destination_address:', quoteData.destination_address, '(comprimento:', quoteData.destination_address?.length, ')')
      console.log('  - pickup_date:', quoteData.pickup_date, '(tipo:', typeof quoteData.pickup_date, ')')
      console.log('  - pickup_time:', quoteData.pickup_time, '(tipo:', typeof quoteData.pickup_time, ')')
      console.log('  - passengers:', quoteData.passengers, '(tipo:', typeof quoteData.passengers, ')')
      console.log('  - status:', quoteData.status, '(tipo:', typeof quoteData.status, ')')
      
      console.log('\n🔍 COMPARAÇÃO PREÇOS (ANTES vs DEPOIS):')
      console.log('  ANTES - formData.base_price:', formData.base_price, '(', typeof formData.base_price, ')')
      console.log('  DEPOIS - quoteData.base_price:', quoteData.base_price, '(', typeof quoteData.base_price, ')')
      console.log('  ANTES - formData.total_amount:', formData.total_amount, '(', typeof formData.total_amount, ')')
      console.log('  DEPOIS - quoteData.total_amount:', quoteData.total_amount, '(', typeof quoteData.total_amount, ')')
      
      console.log('\n✅ VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS:')
      const validationResults = {
        customer_name: !!quoteData.customer_name,
        customer_email: !!quoteData.customer_email,
        customer_phone: !!quoteData.customer_phone,
        pickup_address: !!quoteData.pickup_address,
        destination_address: !!quoteData.destination_address,
        pickup_date: !!quoteData.pickup_date,
        pickup_time: !!quoteData.pickup_time,
        vehicle_category_id: !!quoteData.vehicle_category_id,
        base_price: quoteData.base_price !== null && quoteData.base_price !== undefined,
        total_amount: quoteData.total_amount !== null && quoteData.total_amount !== undefined
      }
      
      Object.entries(validationResults).forEach(([field, isValid]) => {
        console.log(`  ${field}: ${isValid ? '✅ OK' : '❌ FALTANDO'}`)
      })
      
      const missingFields = Object.entries(validationResults)
        .filter(([, isValid]) => !isValid)
        .map(([field]) => field)
      
      if (missingFields.length > 0) {
        console.error('🚨 CAMPOS OBRIGATÓRIOS FALTANDO NO FRONTEND:', missingFields)
      }
      
      console.log('\n🎯 DADOS COMPLETOS ENVIADOS PARA createQuote:', JSON.stringify(quoteData, null, 2))
      console.log('=== FIM DA ANÁLISE FRONTEND ===\n')
      
      // Salvar no banco de dados
      console.log('🚀 INICIANDO SALVAMENTO DO ORÇAMENTO...')
      console.log('📤 DADOS FINAIS SENDO ENVIADOS:')
      console.log('  - base_price final:', quoteData.base_price, '(tipo:', typeof quoteData.base_price, ')')
      console.log('  - total_amount final:', quoteData.total_amount, '(tipo:', typeof quoteData.total_amount, ')')
      console.log('  - extras enviados:', quoteData.extras)
      
      const savedQuote = await createQuote(quoteData)
      
      if (!savedQuote) {
        throw new Error('Erro ao salvar orçamento')
      }

      console.log('✅ ORÇAMENTO SALVO COM SUCESSO:')
      console.log('  - ID salvo:', savedQuote.id)
      console.log('  - base_price salvo:', savedQuote.base_price, '(tipo:', typeof savedQuote.base_price, ')')
      console.log('  - total_amount salvo:', savedQuote.total_amount, '(tipo:', typeof savedQuote.total_amount, ')')
      console.log('  - extras salvos:', savedQuote.extras)
      console.log('  - Dados completos salvos:', savedQuote)
      
      // Se um cliente foi selecionado, criar automaticamente a client_interaction
      if (selectedClient && selectedClient.id) {
        try {
          console.log('🔗 CRIANDO VINCULAÇÃO AUTOMÁTICA COM CLIENTE:', selectedClient.full_name)
          
          const { error: interactionError } = await supabase
            .from('client_interactions')
            .insert({
              client_id: selectedClient.id,
              interaction_type: 'quote',
              reference_id: savedQuote.id,
              notes: `Orçamento criado automaticamente - ${savedQuote.booking_reference}`
            })
          
          if (interactionError) {
            console.error('❌ Erro ao criar client_interaction:', interactionError)
            // Não falha o processo, apenas loga o erro
          } else {
            console.log('✅ CLIENT_INTERACTION CRIADA COM SUCESSO')
          }
        } catch (error) {
          console.error('❌ Erro inesperado ao criar client_interaction:', error)
          // Não falha o processo, apenas loga o erro
        }
      }

      if (status === 'sent') {
        // Gerar dados do voucher para preview
        const category = categories.find(c => c.id === formData.vehicle_category_id)
        const extrasList = Object.entries(formData.extras || {})
          .filter(([, q]) => Number(q as number) > 0)
          .map(([id, qty]) => {
            const extra = (availableExtras || []).find((e: any) => e.id === id)
            return `${extra?.name || 'Extra'} x${qty}`
          })

        const precoBaseFmt = `$${Number(formData.base_price || 0).toFixed(2)}`
        const extrasFmt = `$${Number(extrasTotal).toFixed(2)}`
        const totalFmt = `$${Number(formData.total_amount || 0).toFixed(2)}`
        const validadeFmt = `${formData.expires_days || 7} dia${(formData.expires_days || 7) === 1 ? '' : 's'}`
        const tipoTrajeto = formData.quote_type === 'one-way' ? 'One-way' : formData.quote_type === 'round-trip' ? 'Round-trip' : 'Hourly'

        const voucherData = {
          id: savedQuote.id,
          booking_reference: savedQuote.booking_reference,
          data_emissao: new Date().toLocaleDateString('pt-BR'),
          nome_cliente: formData.customer_name || '-',
          email_cliente: formData.customer_email || '-',
          telefone_cliente: formData.customer_phone || '-',
          tipo_trajeto: tipoTrajeto,
          origem: formData.pickup_address || '-',
          destino: formData.quote_type === 'hourly' ? (formData.airport_destination || '-') : (formData.destination_address || '-'),
          data_ida: formData.pickup_date || '-',
          hora_ida: formData.pickup_time || '-',
          numero_voo: formData.no_flight_info ? '-' : (formData.flight_number || '-'),
          volta: formData.quote_type === 'round-trip' ? `${formData.return_date || '-'} ${formData.return_time || ''}`.trim() : '—',
          veiculo: category?.name || '-',
          qtd_passageiros: String(formData.passengers || 0),
          qtd_bagagens: String((formData.luggage_large || 0) + (formData.luggage_small || 0)),
          extras: extrasList.length > 0 ? extrasList.join(', ') : 'Nenhum',
          preco_base: precoBaseFmt,
          valor_extras: extrasFmt,
          valor_total: totalFmt,
          validade: validadeFmt,
        }

        // Usar a função de redirecionamento com router
        redirectAfterSave(router, status, voucherData)
      } else {
        // Rascunho salvo, redirecionar para lista
        alert('Rascunho salvo com sucesso!')
        // Usar a função de redirecionamento com router
        redirectAfterSave(router, status)
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
      alert('Erro ao salvar orçamento. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
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
            
            {selectedClient && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-800">
                      Cliente vinculado: {selectedClient.full_name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearClientSelection}
                    className="text-green-600 hover:text-green-800 text-sm underline"
                  >
                    Desvincular
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  className={`input-standard w-full ${validationErrors.customer_name ? 'border-red-500' : ''} ${selectedClient ? 'bg-gray-50' : ''}`}
                  value={formData.customer_name}
                  onChange={(e) => {
                    setFormData(prev => ({...prev, customer_name: e.target.value}))
                    if (validationErrors.customer_name) {
                      setValidationErrors(prev => ({...prev, customer_name: ''}))
                    }
                  }}
                  placeholder="João Silva"
                  disabled={!!selectedClient}
                />
                <FieldError fieldName="customer_name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  className={`input-standard w-full ${validationErrors.customer_email ? 'border-red-500' : ''} ${selectedClient ? 'bg-gray-50' : ''}`}
                  value={formData.customer_email}
                  onChange={(e) => {
                    setFormData(prev => ({...prev, customer_email: e.target.value}))
                    if (validationErrors.customer_email) {
                      setValidationErrors(prev => ({...prev, customer_email: ''}))
                    }
                  }}
                  placeholder="joao@email.com"
                  disabled={!!selectedClient}
                />
                <FieldError fieldName="customer_email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  className={`input-standard w-full ${validationErrors.customer_phone ? 'border-red-500' : ''} ${selectedClient ? 'bg-gray-50' : ''}`}
                  value={formData.customer_phone}
                  onChange={(e) => {
                    setFormData(prev => ({...prev, customer_phone: e.target.value}))
                    if (validationErrors.customer_phone) {
                      setValidationErrors(prev => ({...prev, customer_phone: ''}))
                    }
                  }}
                  placeholder="(11) 99999-9999"
                  disabled={!!selectedClient}
                />
                <FieldError fieldName="customer_phone" />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-text-dark mb-2">
                  CPF (Buscar Cliente)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-standard w-full pr-10"
                    value={formData.customer_cpf}
                    onChange={(e) => {
                      const cpf = e.target.value.replace(/\D/g, '')
                      setFormData(prev => ({ ...prev, customer_cpf: cpf }))
                      searchClientByCPF(cpf)
                    }}
                    placeholder="00000000000"
                    maxLength={11}
                  />
                  {isSearchingClient && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                
                {clientSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {clientSearchResults.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => selectClient(client)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{client.full_name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </button>
                    ))}
                  </div>
                )}
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
              {/* Tipo de orçamento */}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Tipo de Orçamento *
                </label>
                <div className="flex flex-wrap gap-2">
                {([
                  { id: "one-way", label: "One-way" },
                  { id: "round-trip", label: "Round-trip" },
                  { id: "hourly", label: "Hourly" }
                ] as const).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => {
                        // Limpar campos específicos baseado no tipo anterior e novo
                        const newData = {
                          ...prev,
                          quote_type: t.id,
                          // Resetar campos específicos
                          destination_zone_id: t.id === "hourly" ? "" : prev.destination_zone_id,
                          destination_address: t.id === "hourly" ? "" : prev.destination_address,
                          destination_coordinates: t.id === "hourly" ? null : prev.destination_coordinates,
                          // Campos específicos do Round-trip
                          return_date: t.id !== "round-trip" ? "" : prev.return_date,
                          return_time: t.id !== "round-trip" ? "" : prev.return_time,
                          trip_duration_days: t.id !== "round-trip" ? 0 : prev.trip_duration_days,
                          return_pickup_address: t.id !== "round-trip" ? "" : prev.return_pickup_address,
                          return_pickup_coordinates: t.id !== "round-trip" ? null : prev.return_pickup_coordinates,
                          return_pickup_zone_id: t.id !== "round-trip" ? "" : prev.return_pickup_zone_id,
                          return_destination_address: t.id !== "round-trip" ? "" : prev.return_destination_address,
                          return_destination_coordinates: t.id !== "round-trip" ? null : prev.return_destination_coordinates,
                          return_destination_zone_id: t.id !== "round-trip" ? "" : prev.return_destination_zone_id,
                          // Campos específicos do Hourly
                          service_hours: t.id !== "hourly" ? 2 : prev.service_hours,
                          airport_destination: t.id !== "hourly" ? "" : prev.airport_destination,
                          airport_destination_coordinates: t.id !== "hourly" ? null : prev.airport_destination_coordinates,
                          service_type: t.id !== "hourly" ? "" : prev.service_type,
                          airline: t.id === "hourly" ? "" : prev.airline,
                          flight_number: t.id === "hourly" ? "" : prev.flight_number,
                          no_flight_info: t.id === "hourly" ? false : prev.no_flight_info,
                          // Resetar preços
                          base_price: 0,
                          total_amount: 0
                        }
                        return newData
                      })
                      // Só recalcular se não estiver em modo de ajuste manual
                      setTimeout(() => {
                        const hasOutOfCoverage = (
                          (formData.pickup_address && !formData.pickup_zone_id) ||
                          (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
                          (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
                          (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
                          (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip")
                        )
                        if (!(hasOutOfCoverage && formData.base_price > 0)) {
                          calculateTotal()
                        }
                      }, 0)
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm border ${formData.quote_type === t.id ? "bg-secondary text-white border-secondary" : "bg-white text-text-dark border-border"}`}
                  >
                    {t.label}
                  </button>
                ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Endereço de Origem *
                </label>
                <AddressAutocomplete
                  value={formData.pickup_address}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, pickup_address: value }))
                    if (validationErrors.pickup_address) {
                      setValidationErrors(prev => ({...prev, pickup_address: ''}))
                    }
                  }}
                  onPlaceSelect={handlePickupPlaceSelect}
                  placeholder="Digite o endereço de origem..."
                  required
                  className={validationErrors.pickup_address ? 'border-red-500' : ''}
                />
                <FieldError fieldName="pickup_address" />
                {formData.pickup_address && (
                  <div className="mt-1 text-sm">
                    {formData.pickup_zone_id ? (
                      <span className="text-text-gray">
                        Zona detectada: {zones.find(z => z.id === formData.pickup_zone_id)?.name || formData.pickup_zone_id}
                      </span>
                    ) : (
                      <span className="text-orange-600 font-medium">
                        Fora da cobertura. Utilize o ajuste manual para criar este orçamento personalizado.
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {formData.quote_type !== "hourly" && (
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Endereço de Destino *
                  </label>
                  <AddressAutocomplete
                    value={formData.destination_address}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, destination_address: value }))
                      if (validationErrors.destination_address) {
                        setValidationErrors(prev => ({...prev, destination_address: ''}))
                      }
                    }}
                    onPlaceSelect={handleDestinationPlaceSelect}
                    placeholder="Digite o endereço de destino..."
                    required
                    className={validationErrors.destination_address ? 'border-red-500' : ''}
                  />
                  <FieldError fieldName="destination_address" />
                  {formData.destination_address && (
                    <div className="mt-1 text-sm">
                      {formData.destination_zone_id ? (
                        <span className="text-text-gray">
                          Zona detectada: {zones.find(z => z.id === formData.destination_zone_id)?.name || formData.destination_zone_id}
                        </span>
                      ) : (
                        <span className="text-orange-600 font-medium">
                          Fora da cobertura. Utilize o ajuste manual para criar este orçamento personalizado.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Data da Viagem *
                  </label>
                  <input
                    type="date"
                    required
                    className={`input-standard w-full ${validationErrors.pickup_date ? 'border-red-500' : ''}`}
                    value={formData.pickup_date}
                    onChange={(e) => {
                      const newPickupDate = e.target.value
                      const duration = calculateTripDuration(newPickupDate, formData.return_date)
                      setFormData(prev => ({
                        ...prev, 
                        pickup_date: newPickupDate,
                        trip_duration_days: duration
                      }))
                      if (validationErrors.pickup_date) {
                        setValidationErrors(prev => ({...prev, pickup_date: ''}))
                      }
                    }}
                  />
                  <FieldError fieldName="pickup_date" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    required
                    className={`input-standard w-full ${validationErrors.pickup_time ? 'border-red-500' : ''}`}
                    value={formData.pickup_time}
                    onChange={(e) => {
                      setFormData(prev => ({...prev, pickup_time: e.target.value}))
                      if (validationErrors.pickup_time) {
                        setValidationErrors(prev => ({...prev, pickup_time: ''}))
                      }
                    }}
                  />
                  <FieldError fieldName="pickup_time" />
                </div>
              </div>

              {formData.quote_type !== "hourly" && (
                <div className="space-y-4">
                  
                  {/* Informações de Voo para One-way e Round-trip */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="no_flight_info_general"
                        checked={formData.no_flight_info}
                        onChange={(e) => setFormData(prev => ({...prev, no_flight_info: e.target.checked, airline: e.target.checked ? "" : prev.airline, flight_number: e.target.checked ? "" : prev.flight_number}))}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                      />
                      <label htmlFor="no_flight_info_general" className="text-sm font-medium text-text-dark">
                        Sem informações de voo
                      </label>
                    </div>
                    
                    {!formData.no_flight_info && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Companhia Aérea
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="input-standard w-full pr-10"
                              value={formData.airline}
                              onChange={(e) => setFormData(prev => ({...prev, airline: e.target.value}))}
                              placeholder="Ex: LATAM, GOL, Azul..."
                            />
                            {isLoadingFlight && formData.flight_number && (
                              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                            )}
                            {flightData && !isLoadingFlight && formData.flight_number && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                            {flightError && !isLoadingFlight && formData.flight_number && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Número do Voo
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="input-standard w-full pr-10"
                              value={formData.flight_number}
                              onChange={(e) => {
                                // Permitir apenas números
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setFormData(prev => ({...prev, flight_number: value}))
                              }}
                              placeholder="Ex: 3090, 1234..."
                            />
                            {isLoadingFlight && formData.flight_number && (
                              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                            )}
                            {flightData && !isLoadingFlight && formData.flight_number && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                            {flightError && !isLoadingFlight && formData.flight_number && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                            )}
                          </div>
                          {flightData && !isLoadingFlight && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                              ✈️ Voo encontrado: {flightData.airline.name} - Status: {flightData.status}
                              {flightData.departure.scheduled && (
                                <div>Partida: {new Date(flightData.departure.scheduled).toLocaleString('pt-BR')}</div>
                              )}
                              {flightData.arrival.scheduled && (
                                <div>Chegada: {new Date(flightData.arrival.scheduled).toLocaleString('pt-BR')}</div>
                              )}
                            </div>
                          )}
                          {flightError && !isLoadingFlight && formData.flight_number && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">Não foi possível buscar o voo</p>
                                  <p className="text-sm text-gray-700 mt-1">{flightError}</p>
                                  <div className="mt-2 text-xs text-gray-600">
                                    <p>• Verifique se o número do voo está correto</p>
                                    <p>• Confirme se a data está correta</p>
                                    <p>• Tente novamente em alguns minutos</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.quote_type === "hourly" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Duração (horas)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      className="input-standard w-full"
                      value={formData.service_hours}
                      onChange={(e) => {
                        const hours = parseInt(e.target.value) || 1
                        setFormData(prev => ({...prev, service_hours: hours}))
                        // Só recalcular se não estiver em modo de ajuste manual
                        setTimeout(() => {
                          const hasOutOfCoverage = (
                            (formData.pickup_address && !formData.pickup_zone_id) ||
                            (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
                            (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
                            (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
                            (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip")
                          )
                          if (!(hasOutOfCoverage && formData.base_price > 0)) {
                            calculateTotal()
                          }
                        }, 0)
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Endereço de Destino *
                    </label>
                    <AddressAutocomplete
                      value={formData.airport_destination}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, airport_destination: value }))
                        if (validationErrors.airport_destination) {
                          setValidationErrors(prev => ({...prev, airport_destination: ''}))
                        }
                      }}
                      onPlaceSelect={handleAirportDestinationPlaceSelect}
                      placeholder="Digite o endereço de destino..."
                      required
                      className={validationErrors.airport_destination ? 'border-red-500' : ''}
                    />
                    <FieldError fieldName="airport_destination" />
                    {formData.airport_destination && (
                      <div className="mt-1 text-sm">
                        {formData.destination_zone_id ? (
                          <span className="text-text-gray">
                            Zona detectada: {zones.find(z => z.id === formData.destination_zone_id)?.name || formData.destination_zone_id}
                          </span>
                        ) : (
                          <span className="text-orange-600 font-medium">
                            Fora da cobertura. Utilize o ajuste manual para criar este orçamento personalizado.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Tipo de Serviço
                    </label>
                    <select
                      className="input-standard w-full"
                      value={formData.service_type}
                      onChange={(e) => setFormData(prev => ({...prev, service_type: e.target.value as "airport-dropoff" | "airport-pickup" | ""}))}
                    >
                      <option value="">Selecione o tipo de serviço</option>
                      <option value="airport-dropoff">Airport Drop-off</option>
                      <option value="airport-pickup">Airport Pickup</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="no_flight_info"
                        checked={formData.no_flight_info}
                        onChange={(e) => setFormData(prev => ({...prev, no_flight_info: e.target.checked, airline: e.target.checked ? "" : prev.airline, flight_number: e.target.checked ? "" : prev.flight_number}))}
                        className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                      />
                      <label htmlFor="no_flight_info" className="text-sm font-medium text-text-dark">
                        Sem informações de voo
                      </label>
                    </div>
                    
                    {!formData.no_flight_info && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Companhia Aérea
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="input-standard w-full pr-10"
                              value={formData.airline}
                              onChange={(e) => setFormData(prev => ({...prev, airline: e.target.value}))}
                              placeholder="Ex: LATAM, GOL, Azul..."
                            />
                            {isLoadingFlight && formData.flight_number && (
                              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                            )}
                            {flightData && !isLoadingFlight && formData.flight_number && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                            {flightError && !isLoadingFlight && formData.flight_number && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Número do Voo
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className="input-standard w-full pr-10"
                              value={formData.flight_number}
                              onChange={(e) => {
                                // Permitir apenas números
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setFormData(prev => ({...prev, flight_number: value}))
                              }}
                              placeholder="Ex: 3090, 1234..."
                            />
                            {isLoadingFlight && formData.flight_number && (
                              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
                            )}
                            {flightData && !isLoadingFlight && formData.flight_number && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                            {flightError && !isLoadingFlight && formData.flight_number && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                            )}
                          </div>
                          {flightData && !isLoadingFlight && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                              ✈️ Voo encontrado: {flightData.airline.name} - Status: {flightData.status}
                              {flightData.departure.scheduled && (
                                <div>Partida: {new Date(flightData.departure.scheduled).toLocaleString('pt-BR')}</div>
                              )}
                              {flightData.arrival.scheduled && (
                                <div>Chegada: {new Date(flightData.arrival.scheduled).toLocaleString('pt-BR')}</div>
                              )}
                            </div>
                          )}
                          {flightError && !isLoadingFlight && formData.flight_number && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-red-800">Erro ao buscar voo</p>
                                  <p className="text-sm text-red-700 mt-1">{flightError}</p>
                                  <div className="mt-2 text-xs text-red-600">
                                    <p>• Verifique se o número do voo está correto</p>
                                    <p>• Confirme se a data está correta</p>
                                    <p>• Tente novamente em alguns minutos</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.quote_type === "round-trip" && (
                <div className="space-y-4 pl-7">
                  <h3 className="text-md font-medium text-text-dark mb-3">Viagem de Volta</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Endereço de Origem da Volta *
                    </label>
                    <AddressAutocomplete
                      value={formData.return_pickup_address || formData.destination_address}
                      onChange={(value) => setFormData(prev => ({ ...prev, return_pickup_address: value }))}
                      onPlaceSelect={handleReturnPickupPlaceSelect}
                      placeholder="Digite o endereço de origem da volta..."
                      required
                    />
                    {(formData.return_pickup_address || formData.destination_address) && (
                      <div className="mt-1 text-sm">
                        {formData.return_pickup_zone_id ? (
                          <span className="text-text-gray">
                            Zona detectada: {zones.find(z => z.id === formData.return_pickup_zone_id)?.name || formData.return_pickup_zone_id}
                          </span>
                        ) : (
                          <span className="text-orange-600 font-medium">
                            Fora da cobertura. Utilize o ajuste manual para criar este orçamento personalizado.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Endereço de Destino da Volta *
                    </label>
                    <AddressAutocomplete
                      value={formData.return_destination_address || formData.pickup_address}
                      onChange={(value) => setFormData(prev => ({ ...prev, return_destination_address: value }))}
                      onPlaceSelect={handleReturnDestinationPlaceSelect}
                      placeholder="Digite o endereço de destino da volta..."
                      required
                    />
                    {(formData.return_destination_address || formData.pickup_address) && (
                      <div className="mt-1 text-sm">
                        {formData.return_destination_zone_id ? (
                          <span className="text-text-gray">
                            Zona detectada: {zones.find(z => z.id === formData.return_destination_zone_id)?.name || formData.return_destination_zone_id}
                          </span>
                        ) : (
                          <span className="text-orange-600 font-medium">
                            Fora da cobertura. Utilize o manual de ajuste para criar este orçamento personalizado.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Data de Volta
                      </label>
                      <input
                        type="date"
                        className="input-standard w-full"
                        value={formData.return_date}
                        onChange={(e) => {
                          const newReturnDate = e.target.value
                          const duration = calculateTripDuration(formData.pickup_date, newReturnDate)
                          setFormData(prev => ({
                            ...prev, 
                            return_date: newReturnDate,
                            trip_duration_days: duration
                          }))
                        }}
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
                  
                  {formData.pickup_date && formData.return_date && formData.trip_duration_days > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-sm text-text-gray">
                        Duração da viagem: <strong>{formData.trip_duration_days} dia{formData.trip_duration_days !== 1 ? 's' : ''}</strong>
                      </span>
                    </div>
                  )}
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
                  className={`input-standard w-full ${validationErrors.vehicle_category_id ? 'border-red-500' : ''}`}
                  value={formData.vehicle_category_id}
                  onChange={(e) => {
                    handleVehicleChange(e.target.value)
                    if (validationErrors.vehicle_category_id) {
                      setValidationErrors(prev => ({...prev, vehicle_category_id: ''}))
                    }
                  }}
                >
                  <option value="">Selecione um veículo</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} - ${formData.quote_type === "hourly" ? (formData.service_hours <= 2 ? "100/h" : "80/h") : category.base_price}
                    </option>
                  ))}
                </select>
                <FieldError fieldName="vehicle_category_id" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Número de Passageiros *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    className={`input-standard w-full ${validationErrors.passengers ? 'border-red-500' : ''}`}
                    value={formData.passengers}
                    onChange={(e) => {
                      setFormData(prev => ({...prev, passengers: parseInt(e.target.value)}))
                      if (validationErrors.passengers) {
                        setValidationErrors(prev => ({...prev, passengers: ''}))
                      }
                    }}
                  />
                  <FieldError fieldName="passengers" />
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
                    value={formData.luggage_large}
                    onChange={(e) => setFormData(prev => ({...prev, luggage_large: parseInt(e.target.value)}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Bagagens Pequenas
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="input-standard w-full"
                    value={formData.luggage_small}
                    onChange={(e) => setFormData(prev => ({...prev, luggage_small: parseInt(e.target.value)}))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-3">
                  Serviços Extras
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {availableExtras?.map(extra => {
                    const quantity = formData.extras[extra.id] || 0
                    return (
                      <div key={extra.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-text-dark">{extra.name}</span>
                          <span className="text-sm text-gray-500 ml-2">(+${extra.price})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleExtraQuantityChange(extra.id, -1)}
                            disabled={quantity === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleExtraQuantityChange(extra.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Resumo e Configurações */}
        <div className="space-y-6">
          {/* Ajuste Manual para Fora de Cobertura */}
          {(formData.pickup_address && !formData.pickup_zone_id) || 
           (formData.destination_address && !formData.destination_zone_id && formData.quote_type !== "hourly") ||
           (formData.airport_destination && !formData.destination_zone_id && formData.quote_type === "hourly") ||
           (formData.return_pickup_address && !formData.return_pickup_zone_id && formData.quote_type === "round-trip") ||
           (formData.return_destination_address && !formData.return_destination_zone_id && formData.quote_type === "round-trip") ? (
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-orange-600">Ajuste Manual</h2>
              </div>
              
              <div className="space-y-4">
                 <p className="text-sm text-text-gray">
                   <strong>Atenção:</strong> Uma ou mais localizações estão fora da área de cobertura padrão. 
                   Defina um preço personalizado para esta cotação.
                 </p>
                 
                 <div>
                   <label className="block text-sm font-medium text-text-dark mb-2">
                     Preço Base Personalizado ($)
                   </label>
                   <input
                     type="number"
                     min="0"
                     step="1"
                     className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                     value={formData.base_price || ""}
                     onChange={(e) => {
                       const value = e.target.value
                       const price = value === '' ? 0 : parseFloat(value)
                       console.log('🔧 MUDANÇA DE PREÇO PERSONALIZADO:')
                       console.log('  - Valor do input:', value)
                       console.log('  - Preço parseado:', price, '(tipo:', typeof price, ')')
                       console.log('  - FormData.base_price antes:', formData.base_price)
                       console.log('  - FormData.total_amount antes:', formData.total_amount)
                       console.log('  - Extras atuais:', formData.extras)
                       
                       // Calcular total de extras
                       const currentExtrasTotal = Object.entries(formData.extras).reduce((sum: number, [extraId, quantity]: [string, number]) => {
                         const extra = availableExtras?.find(e => e.id === extraId)
                         const extraPrice = (extra?.price || 0) * quantity
                         return sum + extraPrice
                       }, 0)
                       
                       console.log('  - Total de extras calculado:', currentExtrasTotal)
                       
                       setFormData(prev => {
                         const newData = {...prev, base_price: price}
                         
                         // Calcular novo total: preço base + extras
                         newData.total_amount = price + currentExtrasTotal
                         
                         console.log('  - Novo base_price:', newData.base_price)
                         console.log('  - Novo total_amount:', newData.total_amount, '(base:', price, '+ extras:', currentExtrasTotal, ')')
                         
                         return newData
                       })
                     }}
                     placeholder="Ex: 150"
                   />
                 </div>
               </div>
            </div>
          ) : null}

          {/* Cálculo de Preços */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium text-text-dark">Cálculo de Preços</h2>
            </div>
            
            <div className="space-y-4">
              {zonesLoading || categoriesLoading || pricingLoading || extrasLoading ? (
                <div className="text-center py-4">
                  <div className="text-text-gray">Carregando dados de preços...</div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  {(() => {
                    // Calcular valores em tempo real para evitar delay
                    const extrasTotal = Object.entries(formData.extras).reduce((sum: number, [extraId, quantity]: [string, number]) => {
                      const extra = availableExtras?.find(e => e.id === extraId)
                      return sum + ((extra?.price || 0) * quantity)
                    }, 0)
                    
                    let currentBasePrice = formData.base_price
                    let currentTotal = formData.total_amount
                    
                    // Para modalidade hourly, verificar se há preço personalizado
                    if (formData.quote_type === "hourly") {
                      // Se há preço personalizado (base_price > 0), usar ele
                      if (formData.base_price && formData.base_price > 0) {
                        currentBasePrice = formData.base_price
                      } else {
                        // Caso contrário, calcular preço padrão
                        const hourlyRate = formData.service_hours <= 2 ? 100 : 80
                        currentBasePrice = hourlyRate * Math.max(1, formData.service_hours)
                      }
                      currentTotal = currentBasePrice + extrasTotal
                    } else {
                      // Para outras modalidades, usar o preço base atual + extras
                      currentTotal = currentBasePrice + extrasTotal
                    }
                    
                    return (
                      <>
                        {formData.quote_type !== "hourly" ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-text-gray">
                                {formData.quote_type === "round-trip" ? "Preço ida:" : "Preço base (rota):"}
                              </span>
                              <span className="font-medium">${currentBasePrice.toFixed(2)}</span>
                            </div>
                            {formData.quote_type === "round-trip" && (
                              <div className="flex justify-between">
                                <span className="text-text-gray">Preço volta:</span>
                                <span className="font-medium">${currentBasePrice.toFixed(2)}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-text-gray">Tarifa por hora:</span>
                              <span className="font-medium">${(formData.service_hours <= 2 ? 100 : 80).toFixed(2)}/h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-gray">Horas:</span>
                              <span className="font-medium">{formData.service_hours}</span>
                            </div>
                          </>
                        )}
                        {Object.keys(formData.extras).length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-text-gray">Extras:</span>
                            <span className="font-medium">
                              ${extrasTotal.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-secondary">${currentTotal.toFixed(2)}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Orçamento */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-medium text-text-dark">Detalhes do Orçamento</h2>
            </div>
            
            <div className="space-y-3 text-sm">
              {/* Cliente */}
              {formData.customer_name && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Cliente:</span>
                  <span className="font-medium">{formData.customer_name}</span>
                </div>
              )}
              
              {/* Tipo de Viagem */}
              <div className="flex justify-between">
                <span className="text-text-gray">Tipo:</span>
                <span className="font-medium capitalize">
                  {formData.quote_type === "one-way" ? "Ida" : 
                   formData.quote_type === "round-trip" ? "Ida e Volta" : "Por Hora"}
                </span>
              </div>
              
              {/* Endereços */}
              {formData.quote_type === "round-trip" ? (
                <>
                  {/* Endereços da Ida */}
                  <div className="border-l-2 border-secondary pl-3 space-y-2">
                    <div className="text-xs font-medium text-secondary uppercase tracking-wide">Viagem de Ida</div>
                    {formData.pickup_address && (
                      <div className="flex justify-between">
                        <span className="text-text-gray text-sm">Origem:</span>
                        <span className="font-medium text-right max-w-[180px] truncate text-sm" title={formData.pickup_address}>
                          {formData.pickup_address}
                        </span>
                      </div>
                    )}
                    {formData.destination_address && (
                      <div className="flex justify-between">
                        <span className="text-text-gray text-sm">Destino:</span>
                        <span className="font-medium text-right max-w-[180px] truncate text-sm" title={formData.destination_address}>
                          {formData.destination_address}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Endereços da Volta */}
                  <div className="border-l-2 border-orange-400 pl-3 space-y-2">
                    <div className="text-xs font-medium text-orange-600 uppercase tracking-wide">Viagem de Volta</div>
                    {(formData.return_pickup_address || formData.destination_address) && (
                      <div className="flex justify-between">
                        <span className="text-text-gray text-sm">Origem:</span>
                        <span className="font-medium text-right max-w-[180px] truncate text-sm" title={formData.return_pickup_address || formData.destination_address}>
                          {formData.return_pickup_address || formData.destination_address}
                        </span>
                      </div>
                    )}
                    {(formData.return_destination_address || formData.pickup_address) && (
                      <div className="flex justify-between">
                        <span className="text-text-gray text-sm">Destino:</span>
                        <span className="font-medium text-right max-w-[180px] truncate text-sm" title={formData.return_destination_address || formData.pickup_address}>
                          {formData.return_destination_address || formData.pickup_address}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Endereços para One-way e Hourly */}
                  {formData.pickup_address && (
                    <div className="flex justify-between">
                      <span className="text-text-gray">Origem:</span>
                      <span className="font-medium text-right max-w-[200px] truncate" title={formData.pickup_address}>
                        {formData.pickup_address}
                      </span>
                    </div>
                  )}
                  
                  {formData.destination_address && formData.quote_type !== "hourly" && (
                    <div className="flex justify-between">
                      <span className="text-text-gray">Destino:</span>
                      <span className="font-medium text-right max-w-[200px] truncate" title={formData.destination_address}>
                        {formData.destination_address}
                      </span>
                    </div>
                  )}
                  
                  {formData.airport_destination && formData.quote_type === "hourly" && (
                    <div className="flex justify-between">
                      <span className="text-text-gray">Destino:</span>
                      <span className="font-medium text-right max-w-[200px] truncate" title={formData.airport_destination}>
                        {formData.airport_destination}
                      </span>
                    </div>
                  )}
                </>
              )}
              
              {/* Data e Hora */}
              {formData.pickup_date && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Data:</span>
                  <span className="font-medium">
                    {new Date(formData.pickup_date).toLocaleDateString('pt-BR')}
                    {formData.pickup_time && ` às ${formData.pickup_time}`}
                  </span>
                </div>
              )}
              
              {/* Dados da Volta (Round-trip) */}
              {formData.quote_type === "round-trip" && formData.return_date && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Volta:</span>
                  <span className="font-medium">
                    {new Date(formData.return_date).toLocaleDateString('pt-BR')}
                    {formData.return_time && ` às ${formData.return_time}`}
                  </span>
                </div>
              )}
              
              {/* Horas de Serviço (Hourly) */}
              {formData.quote_type === "hourly" && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Duração:</span>
                  <span className="font-medium">{formData.service_hours} horas</span>
                </div>
              )}
              
              {/* Veículo */}
              {formData.vehicle_category_id && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Veículo:</span>
                  <span className="font-medium">
                    {categories.find(c => c.id === formData.vehicle_category_id)?.name || 'Selecionado'}
                  </span>
                </div>
              )}
              
              {/* Passageiros */}
              {formData.passengers > 1 && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Passageiros:</span>
                  <span className="font-medium">{formData.passengers}</span>
                </div>
              )}
              
              {/* Bagagens */}
              {(formData.luggage_large > 0 || formData.luggage_small > 0) && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Bagagens:</span>
                  <span className="font-medium">
                    {formData.luggage_large > 0 && `${formData.luggage_large} grande${formData.luggage_large > 1 ? 's' : ''}`}
                    {formData.luggage_large > 0 && formData.luggage_small > 0 && ', '}
                    {formData.luggage_small > 0 && `${formData.luggage_small} pequena${formData.luggage_small > 1 ? 's' : ''}`}
                  </span>
                </div>
              )}
              
              {/* Extras */}
              {Object.keys(formData.extras).length > 0 && (
                <div className="space-y-1">
                  <span className="text-text-gray">Extras:</span>
                  {Object.entries(formData.extras).map(([extraId, quantity]: [string, number]) => {
                    const extra = availableExtras?.find(e => e.id === extraId)
                    return extra ? (
                      <div key={extraId} className="flex justify-between ml-4">
                        <span className="text-text-gray text-xs">• {extra.name} x{quantity}</span>
                        <span className="font-medium text-xs">+${(extra.price * quantity).toFixed(2)}</span>
                      </div>
                    ) : null
                  })}
                </div>
              )}
              
              {/* Informações de Voo */}
              {formData.quote_type === "hourly" && !formData.no_flight_info && (formData.airline || formData.flight_number) && (
                <div className="space-y-1">
                  <span className="text-text-gray">Voo:</span>
                  {formData.airline && (
                    <div className="flex justify-between ml-4">
                      <span className="text-text-gray text-xs">• Companhia:</span>
                      <span className="font-medium text-xs">{formData.airline}</span>
                    </div>
                  )}
                  {formData.flight_number && (
                    <div className="flex justify-between ml-4">
                      <span className="text-text-gray text-xs">• Número:</span>
                      <span className="font-medium text-xs">{formData.flight_number}</span>
                    </div>
                  )}
                </div>
              )}
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


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}