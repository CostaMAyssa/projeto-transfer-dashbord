"use client"

import { useState, useEffect } from "react"
import { Search, Plane, Clock, MapPin, AlertCircle, CheckCircle } from "lucide-react"
import { useFlightData, useFlightSearch } from "@/hooks/useFlightData"
import type { FlightData } from "@/lib/goflightlabs-service"

interface FlightSearchProps {
  value: string
  onChange: (value: string, flightData?: FlightData) => void
  date?: string
  placeholder?: string
  className?: string
}

export default function FlightSearch({ 
  value, 
  onChange, 
  date, 
  placeholder = "Ex: 3359, 1900", 
  className = "" 
}: FlightSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<FlightData | null>(null)
  
  const { 
    query, 
    setQuery, 
    suggestions, 
    isSearching, 
    clearSuggestions 
  } = useFlightSearch(300)
  
  const { 
    searchFlight, 
    loading, 
    error, 
    flightData,
    getStatusInPortuguese 
  } = useFlightData()

  // Sincronizar query com value prop
  useEffect(() => {
    if (value !== query) {
      setQuery(value)
    }
  }, [value, query, setQuery])

  // Buscar voo quando o usuário para de digitar
  useEffect(() => {
    if (query && query.length >= 3 && /^\d{1,4}$/.test(query.trim())) {
      const searchDate = date || new Date().toISOString().split('T')[0]
      searchFlight(query.trim(), searchDate)
    }
  }, [query, date, searchFlight])

  // Atualizar selectedFlight quando flightData muda
  useEffect(() => {
    if (flightData) {
      setSelectedFlight(flightData)
      onChange(flightData.flightNumber, flightData)
    }
  }, [flightData, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir apenas números
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    setQuery(newValue)
    onChange(newValue)
    setIsOpen(true)
    
    if (!newValue) {
      setSelectedFlight(null)
      clearSuggestions()
    }
  }

  const handleSuggestionClick = (flight: FlightData) => {
    setSelectedFlight(flight)
    setQuery(flight.flightNumber)
    onChange(flight.flightNumber, flight)
    setIsOpen(false)
    clearSuggestions()
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  const handleInputBlur = () => {
    // Delay para permitir clique nas sugestões
    setTimeout(() => setIsOpen(false), 200)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'active':
        return 'text-green-600'
      case 'delayed':
        return 'text-yellow-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E95440] focus:border-[#E95440]"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#E95440] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown com sugestões */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((flight, index) => (
            <div
              key={`${flight.flightNumber}-${index}`}
              onClick={() => handleSuggestionClick(flight)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plane className="w-4 h-4 text-[#E95440]" />
                  <span className="font-medium">{flight.flightNumber}</span>
                  <span className="text-sm text-gray-600">{flight.airline}</span>
                </div>
                <span className={`text-xs font-medium ${getStatusColor(flight.status)}`}>
                  {getStatusInPortuguese(flight.status)}
                </span>
              </div>
              
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{flight.origin} → {flight.destination}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTime(flight.departure.scheduled)} - {formatTime(flight.arrival.scheduled)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informações do voo selecionado */}
      {selectedFlight && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-sm">Voo encontrado</span>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(selectedFlight.status)}`}>
              {getStatusInPortuguese(selectedFlight.status)}
            </span>
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Voo:</span>
              <span className="font-medium">{selectedFlight.flightNumber} - {selectedFlight.airline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rota:</span>
              <span>{selectedFlight.origin} → {selectedFlight.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Partida:</span>
              <span>
                {formatTime(selectedFlight.departure.estimated || selectedFlight.departure.scheduled)}
                {selectedFlight.departure.delay > 0 && (
                  <span className="text-yellow-600 ml-1">(+{selectedFlight.departure.delay}min)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chegada:</span>
              <span>
                {formatTime(selectedFlight.arrival.estimated || selectedFlight.arrival.scheduled)}
                {selectedFlight.arrival.delay > 0 && (
                  <span className="text-yellow-600 ml-1">(+{selectedFlight.arrival.delay}min)</span>
                )}
              </span>
            </div>
            {selectedFlight.gate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Portão:</span>
                <span>{selectedFlight.gate}</span>
              </div>
            )}
            {selectedFlight.terminal && (
              <div className="flex justify-between">
                <span className="text-gray-600">Terminal:</span>
                <span>{selectedFlight.terminal}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Erro ao buscar voo</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <div className="mt-2 text-xs text-red-600">
                <p>• Verifique se o número do voo está correto</p>
                <p>• Confirme se a data está correta</p>
                <p>• Tente novamente em alguns minutos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-600">Buscando informações do voo...</span>
          </div>
        </div>
      )}
    </div>
  )
}