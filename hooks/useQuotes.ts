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
    console.log('\n=== 🔍 DIAGNÓSTICO COMPLETO DE CRIAÇÃO DE ORÇAMENTO ===')
    console.log('📥 DADOS RECEBIDOS (quote):', quote)
    console.log('🔍 DADOS RECEBIDOS PARA CRIAÇÃO:')
    console.log('  - quote.base_price:', quote.base_price, '(tipo:', typeof quote.base_price, ')')
    console.log('  - quote.total_amount:', quote.total_amount, '(tipo:', typeof quote.total_amount, ')')
    console.log('  - quote.extras:', quote.extras)
    console.log('  - Dados completos recebidos:', quote)
    
    // Validar campos obrigatórios ANTES de processar
    const requiredFields = {
      customer_name: quote.customer_name,
      customer_email: quote.customer_email,
      customer_phone: quote.customer_phone,
      quote_type: quote.quote_type,
      pickup_address: quote.pickup_address,
      pickup_date: quote.pickup_date,
      pickup_time: quote.pickup_time,
      destination_address: quote.destination_address,
      vehicle_category_id: quote.vehicle_category_id,
      passengers: quote.passengers,
      base_price: quote.base_price,
      total_amount: quote.total_amount
    }
    
    console.log('🔍 VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS:')
    const missingFields: string[] = []
    Object.entries(requiredFields).forEach(([field, value]) => {
      const isEmpty = value === null || value === undefined || value === ''
      console.log(`  ${field}: ${isEmpty ? '❌ VAZIO' : '✅ OK'} (${typeof value}) = ${value}`)
      if (isEmpty) missingFields.push(field)
    })
    
    if (missingFields.length > 0) {
      console.error('🚨 CAMPOS OBRIGATÓRIOS FALTANDO:', missingFields)
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`)
    }
    
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
    
    console.log('📋 DADOS PROCESSADOS PARA INSERÇÃO:')
    console.log('  - quoteData.base_price:', quoteData.base_price, '(tipo:', typeof quoteData.base_price, ')')
    console.log('  - quoteData.total_amount:', quoteData.total_amount, '(tipo:', typeof quoteData.total_amount, ')')
    console.log('  - quoteData.extras:', quoteData.extras)
    console.log('  - quoteData.vehicle_category_id:', quoteData.vehicle_category_id)
    console.log('  - Dados completos processados:', quoteData)
    
    console.log('\n📋 COMPARAÇÃO ANTES/DEPOIS DO PROCESSAMENTO:')
    console.log('ANTES (quote original):')
    console.log('  - base_price:', quote.base_price, '(tipo:', typeof quote.base_price, ')')
    console.log('  - total_amount:', quote.total_amount, '(tipo:', typeof quote.total_amount, ')')
    console.log('  - vehicle_category_id:', quote.vehicle_category_id)
    console.log('  - status:', quote.status)
    console.log('  - booking_reference:', quote.booking_reference)
    
    console.log('DEPOIS (quoteData processado):')
    console.log('  - base_price:', quoteData.base_price, '(tipo:', typeof quoteData.base_price, ')')
    console.log('  - total_amount:', quoteData.total_amount, '(tipo:', typeof quoteData.total_amount, ')')
    console.log('  - vehicle_category_id:', quoteData.vehicle_category_id)
    console.log('  - status:', quoteData.status)
    console.log('  - booking_reference:', quoteData.booking_reference)
    
    console.log('\n📊 ANÁLISE COMPLETA DOS DADOS PARA INSERÇÃO:')
    console.log('🔢 CAMPOS NUMÉRICOS:')
    console.log('  - base_price:', quoteData.base_price, '(tipo:', typeof quoteData.base_price, ', válido:', !isNaN(Number(quoteData.base_price)), ')')
    console.log('  - total_amount:', quoteData.total_amount, '(tipo:', typeof quoteData.total_amount, ', válido:', !isNaN(Number(quoteData.total_amount)), ')')
    console.log('  - passengers:', quoteData.passengers, '(tipo:', typeof quoteData.passengers, ', válido:', !isNaN(Number(quoteData.passengers)), ')')
    console.log('  - luggage_large:', quoteData.luggage_large, '(tipo:', typeof quoteData.luggage_large, ')')
    console.log('  - luggage_small:', quoteData.luggage_small, '(tipo:', typeof quoteData.luggage_small, ')')
    console.log('  - expires_days:', quoteData.expires_days, '(tipo:', typeof quoteData.expires_days, ')')
    
    console.log('📝 CAMPOS DE TEXTO:')
    console.log('  - customer_name:', quoteData.customer_name, '(comprimento:', quoteData.customer_name?.length, ')')
    console.log('  - customer_email:', quoteData.customer_email, '(comprimento:', quoteData.customer_email?.length, ')')
    console.log('  - customer_phone:', quoteData.customer_phone, '(comprimento:', quoteData.customer_phone?.length, ')')
    console.log('  - vehicle_category_id:', quoteData.vehicle_category_id)
    console.log('  - quote_type:', quoteData.quote_type)
    console.log('  - pickup_address:', quoteData.pickup_address, '(comprimento:', quoteData.pickup_address?.length, ')')
    console.log('  - destination_address:', quoteData.destination_address, '(comprimento:', quoteData.destination_address?.length, ')')
    
    console.log('📅 CAMPOS DE DATA/HORA:')
    console.log('  - pickup_date:', quoteData.pickup_date)
    console.log('  - pickup_time:', quoteData.pickup_time)
    console.log('  - expires_at:', quoteData.expires_at)
    
    console.log('\n🎯 DADOS FINAIS ENVIADOS PARA SUPABASE:', JSON.stringify(quoteData, null, 2))

    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single()

    if (error) {
      console.error('\n🚨 ERRO DETALHADO DO SUPABASE:')
      console.error('  - Código:', error.code)
      console.error('  - Mensagem:', error.message)
      console.error('  - Detalhes:', error.details)
      console.error('  - Dica:', error.hint)
      console.error('  - Erro completo:', error)
      
      // Análise específica de erros comuns
      if (error.code === '23503') {
        console.error('\n🔍 ERRO DE CHAVE ESTRANGEIRA DETECTADO:')
        console.error('  - Verifique se vehicle_category_id existe:', quoteData.vehicle_category_id)
        console.error('  - Verifique se zone_ids existem (se fornecidos)')
      } else if (error.code === '23514') {
        console.error('\n🔍 ERRO DE RESTRIÇÃO CHECK DETECTADO:')
        console.error('  - Verifique valores de status:', quoteData.status)
        console.error('  - Verifique valores de quote_type:', quoteData.quote_type)
      } else if (error.code === '42703') {
        console.error('\n🔍 ERRO DE COLUNA NÃO ENCONTRADA:')
        console.error('  - Verifique se todos os nomes de colunas estão corretos')
      }
      
      throw error
    }
    
    console.log('✅ ORÇAMENTO CRIADO COM SUCESSO:')
    console.log('  - data.id:', data.id)
    console.log('  - data.base_price:', data.base_price, '(tipo:', typeof data.base_price, ')')
    console.log('  - data.total_amount:', data.total_amount, '(tipo:', typeof data.total_amount, ')')
    console.log('  - data.extras:', data.extras)
    console.log('  - data.vehicle_category_id:', data.vehicle_category_id)
    console.log('  - Resultado completo:', data)
    
    console.log('\n✅ SUCESSO! Orçamento criado:')
    console.log('  - ID:', data.id)
    console.log('  - Referência:', data.booking_reference)
    console.log('  - Status:', data.status)
    console.log('  - Preço base:', data.base_price)
    console.log('  - Total:', data.total_amount)
    console.log('  - Dados completos:', data)
    console.log('=== FIM DO DIAGNÓSTICO ===\n')
    
    return data
  } catch (err) {
    console.error('\n❌ ERRO GERAL NA CRIAÇÃO DO ORÇAMENTO:')
    console.error('  - Tipo do erro:', typeof err)
    console.error('  - Erro:', err)
    console.error('  - Stack trace:', err instanceof Error ? err.stack : 'N/A')
    console.error('=== FIM DO DIAGNÓSTICO COM ERRO ===\n')
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