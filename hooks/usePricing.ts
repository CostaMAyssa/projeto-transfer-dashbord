import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type PricingRule = Database['public']['Tables']['pricing_rules']['Row']
type PricingRuleInsert = Database['public']['Tables']['pricing_rules']['Insert']
type PricingRuleUpdate = Database['public']['Tables']['pricing_rules']['Update']

export function usePricingRules() {
  return useSWR('pricing_rules', async () => {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as PricingRule[]
  })
}

export function usePricingRule(id: string) {
  return useSWR(id ? `pricing_rule-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as PricingRule
  })
}

export async function createPricingRule(rule: PricingRuleInsert) {
  const { data, error } = await supabase
    .from('pricing_rules')
    .insert(rule)
    .select()
    .single()
  
  if (error) throw error
  return data as PricingRule
}

export async function updatePricingRule(id: string, updates: PricingRuleUpdate) {
  const { data, error } = await supabase
    .from('pricing_rules')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as PricingRule
}

export async function deletePricingRule(id: string) {
  const { error } = await supabase
    .from('pricing_rules')
    .delete()
    .eq('id', id)
  
  if (error) throw error
} 