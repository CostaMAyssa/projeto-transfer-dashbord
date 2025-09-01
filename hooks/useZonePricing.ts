import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type ZonePricing = Database['public']['Tables']['zone_pricing']['Row']

export function useZonePricing() {
  const [pricing, setPricing] = useState<ZonePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPricing() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('zone_pricing')
          .select('*')
          .eq('is_active', true)

        if (fetchError) {
          throw fetchError
        }

        setPricing(data || [])
      } catch (err) {
        console.error('Erro ao buscar preços por zona:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

  // Função para buscar preço específico por rota e veículo
  const getPrice = (originZoneId: string, destinationZoneId: string, vehicleCategoryId: string): number | null => {
    const price = pricing.find(p => 
      p.origin_zone_id === originZoneId && 
      p.destination_zone_id === destinationZoneId && 
      p.vehicle_category_id === vehicleCategoryId
    )
    
    return price ? price.price / 100 : null // Converter de centavos para dólares
  }

  return { pricing, loading, error, getPrice }
}
