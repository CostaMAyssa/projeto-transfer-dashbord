import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Quote = Database['public']['Tables']['quotes']['Row']
type QuoteInsert = Database['public']['Tables']['quotes']['Insert']
type QuoteUpdate = Database['public']['Tables']['quotes']['Update']

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('Erro de autenticação: Usuário não autenticado')
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.')
      }
      
      console.log('Sessão válida, token:', session.access_token.substring(0, 10) + '...')
      
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          vehicle_categories(id, name, capacity, base_price)
        `)
        .order('created_at', { ascending: false })
        .limit(1000) // Aumentar limite para garantir que todos os orçamentos sejam carregados

      if (error) {
        console.error('Erro do Supabase ao buscar orçamentos:', error)
        throw error
      }
      
      console.log('Orçamentos carregados com sucesso:', data?.length || 0)
      setQuotes(data || [])
    } catch (err) {
      console.error('Erro ao buscar orçamentos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar orçamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes
  }
}

export async function createQuote(quote: QuoteInsert): Promise<Quote | null> {
  try {
    // Gerar referência única se não fornecida
    const bookingReference = quote.booking_reference || `QT${Date.now().toString().slice(-6)}`
    
    const quoteData = {
      ...quote,
      booking_reference: bookingReference,
      status: quote.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: quote.expires_at || new Date(Date.now() + (quote.expires_days || 7) * 24 * 60 * 60 * 1000).toISOString()
    }

    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Erro ao criar orçamento:', err)
    throw err
  }
}

export async function updateQuote(id: string, updates: QuoteUpdate): Promise<Quote | null> {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Erro ao atualizar orçamento:', err)
    throw err
  }
}

export async function deleteQuote(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Erro ao deletar orçamento:', err)
    return false
  }
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        vehicle_categories(name)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Erro ao buscar orçamento:', err)
    return null
  }
}

export async function getQuoteByReference(reference: string): Promise<Quote | null> {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
          *,
          vehicle_categories(name)
        `)
      .eq('booking_reference', reference)
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Erro ao buscar orçamento por referência:', err)
    return null
  }
}