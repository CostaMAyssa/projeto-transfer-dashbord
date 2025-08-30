"use client"

import { useState, useEffect, useRef } from 'react'
import { useAddressAutocomplete, type PlacePrediction } from '@/hooks/useAddressAutocomplete'
import { Search, MapPin } from 'lucide-react'

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect?: (place: PlacePrediction) => void
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Digite um endereço...",
  required = false,
  className = "",
  disabled = false
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [hasSelectedPlace, setHasSelectedPlace] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { suggestions, loading, error, searchAddresses, clearSuggestions } = useAddressAutocomplete()

  // Debounce para evitar muitas chamadas à API
  useEffect(() => {
    // Não buscar se já foi selecionado um lugar
    if (hasSelectedPlace) {
      return
    }

    const timeoutId = setTimeout(() => {
      if (inputValue.length >= 3) {
        searchAddresses(inputValue)
        setIsOpen(true)
      } else {
        clearSuggestions()
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [inputValue, searchAddresses, clearSuggestions, hasSelectedPlace])

  // Sincronizar inputValue com value externo apenas se não foi uma seleção interna
  useEffect(() => {
    if (value !== inputValue && !hasSelectedPlace) {
      setInputValue(value)
    }
  }, [value])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const previousValue = inputValue
    setInputValue(newValue)
    onChange(newValue)
    // Reset hasSelectedPlace quando o usuário modifica o texto após ter selecionado
    if (hasSelectedPlace && newValue !== previousValue) {
      setHasSelectedPlace(false)
    }
  }

  const handlePlaceSelect = (place: PlacePrediction) => {
    setInputValue(place.description)
    onChange(place.description)
    onPlaceSelect?.(place)
    setIsOpen(false)
    setHasSelectedPlace(true)
    clearSuggestions()
  }

  const handleInputFocus = () => {
    // Só abre se não tiver selecionado um lugar ou se o input estiver vazio
    if (!hasSelectedPlace || inputValue.length === 0) {
      if (inputValue.length >= 3) {
        setIsOpen(true)
      }
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="input-standard w-full pl-10 pr-4"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
          ) : (
            <MapPin className="h-4 w-4 text-text-gray" />
          )}
        </div>
      </div>

      {/* Dropdown de sugestões */}
      {isOpen && (suggestions.length > 0 || loading || error) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="px-4 py-2 text-sm text-text-gray">
              Buscando endereços...
            </div>
          )}

          {error && (
            <div className="px-4 py-2 text-sm text-red-500">
              Erro: {error}
            </div>
          )}

          {suggestions.map((place) => (
            <button
              key={place.place_id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => handlePlaceSelect(place)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-text-gray mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-text-dark truncate">
                    {place.structured_formatting?.main_text || place.description}
                  </div>
                  {place.structured_formatting?.secondary_text && (
                    <div className="text-sm text-text-gray truncate">
                      {place.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          {!loading && !error && suggestions.length === 0 && inputValue.length >= 3 && (
            <div className="px-4 py-2 text-sm text-text-gray">
              Nenhum endereço encontrado
            </div>
          )}
        </div>
      )}
    </div>
  )
}
