// Arquivo para corrigir o problema de autenticação na requisição de orçamentos

import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Quote = Database['public']['Tables']['quotes']['Row']

/**
 * Função para buscar orçamentos com tratamento adequado de autenticação
 * Resolve o erro 400 (Bad Request) na requisição
 */
export async function fetchQuotesWithAuth() {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.error('Erro de autenticação: Usuário não autenticado')
      return { data: [], error: 'Usuário não autenticado. Por favor, faça login novamente.' }
    }
    
    console.log('Sessão válida, token:', session.access_token.substring(0, 10) + '...')
    
    // Fazer a requisição com o token de autenticação
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        vehicle_categories(name, type)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar orçamentos:', error)
      return { data: [], error: error.message }
    }
    
    return { data: data || [], error: null }
  } catch (err) {
    console.error('Erro ao buscar orçamentos:', err)
    return { data: [], error: err instanceof Error ? err.message : 'Erro ao buscar orçamentos' }
  }
}