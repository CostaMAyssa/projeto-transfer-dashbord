import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Zone = Database['public']['Tables']['zones']['Row']

export function useZones() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchZones() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('zones')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (fetchError) {
          throw fetchError
        }

        setZones(data || [])
      } catch (err) {
        console.error('Erro ao buscar zonas:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchZones()
  }, [])

  return { zones, loading, error }
}
