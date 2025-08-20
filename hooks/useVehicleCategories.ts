import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type VehicleCategory = Database['public']['Tables']['vehicle_categories']['Row']

export function useVehicleCategories() {
  const [categories, setCategories] = useState<VehicleCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('vehicle_categories')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (fetchError) {
          throw fetchError
        }

        setCategories(data || [])
      } catch (err) {
        console.error('Erro ao buscar categorias de veículos:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
