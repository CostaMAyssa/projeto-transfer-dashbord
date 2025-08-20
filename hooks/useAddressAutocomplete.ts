import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface PlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export interface PlaceDetails {
  place_id: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export function useAddressAutocomplete() {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAddresses = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('google-places/autocomplete', {
        body: { input }
      })

      if (fetchError) {
        throw fetchError
      }

      // API v1 retorna `suggestions` com `placePrediction`
      if (Array.isArray(data?.suggestions)) {
        const mapped: PlacePrediction[] = data.suggestions
          .map((s: any) => s?.placePrediction)
          .filter(Boolean)
          .map((p: any) => ({
            place_id: p.placeId,
            description: p?.text?.text || '',
            structured_formatting: {
              main_text: p?.structuredFormat?.mainText?.text || '',
              secondary_text: p?.structuredFormat?.secondaryText?.text || ''
            }
          }))
        setSuggestions(mapped)
      } else if (Array.isArray(data?.predictions)) {
        // Fallback para API antiga
        setSuggestions(data.predictions)
      } else {
        setSuggestions([])
      }
    } catch (err) {
      console.error('Erro no autocomplete:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getAddressDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('google-places/details', {
        body: { place_id: placeId }
      })

      if (fetchError) {
        throw fetchError
      }

      // API details v1 retorna `result` com geometry
      if (data?.result) {
        const r = data.result
        const lat = r?.geometry?.location?.lat
        const lng = r?.geometry?.location?.lng
        return {
          place_id: placeId,
          formatted_address: r?.formatted_address || '',
          geometry: {
            location: { lat, lng }
          }
        } as PlaceDetails
      }
      return null
    } catch (err) {
      console.error('Erro ao buscar detalhes do endereço:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      return null
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  return {
    suggestions,
    loading,
    error,
    searchAddresses,
    getAddressDetails,
    clearSuggestions
  }
}
