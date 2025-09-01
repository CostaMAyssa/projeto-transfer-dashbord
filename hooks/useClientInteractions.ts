import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

export interface ClientInteraction {
  id: number;
  client_id: number;
  interaction_type: 'quote' | 'reservation' | 'call' | 'email' | 'note';
  reference_id: string | null;
  reference_display?: string; // Referência formatada para exibição
  status: string | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
  quotes?: { booking_reference: string } | null;
  bookings?: { id: string } | null;
}

export interface CreateClientInteractionData {
  client_id: number;
  interaction_type: 'quote' | 'reservation' | 'call' | 'email' | 'note';
  reference_id?: string;
  status?: string;
  description?: string;
  created_by?: string;
}

// Hook para buscar interações de um cliente específico
export function useClientInteractions(clientId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    clientId ? `client-interactions-${clientId}` : null,
    async () => {
      // Buscar interações sem JOIN devido à falta de relacionamento FK
      const { data, error } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar interações do cliente:', error);
        throw error;
      }

      // Enriquecer dados manualmente buscando referências relacionadas
      const enrichedData = [];
      
      for (const interaction of data || []) {
        let enrichedInteraction = { ...interaction };
        
        // Buscar dados relacionados baseado no tipo de interação
        if (interaction.interaction_type === 'quote' && interaction.reference_id) {
          try {
            const { data: quote } = await supabase
              .from('quotes')
              .select('booking_reference')
              .eq('id', interaction.reference_id)
              .single();
              
            if (quote) {
              enrichedInteraction.reference_display = quote.booking_reference;
              enrichedInteraction.quotes = { booking_reference: quote.booking_reference };
            }
          } catch (quoteError) {
            console.warn('Erro ao buscar quote:', quoteError);
          }
        } else if (interaction.interaction_type === 'reservation' && interaction.reference_id) {
          try {
            const { data: booking } = await supabase
              .from('bookings')
              .select('id')
              .eq('id', interaction.reference_id)
              .single();
              
            if (booking) {
              enrichedInteraction.reference_display = `BK-${booking.id.slice(-6).toUpperCase()}`;
              enrichedInteraction.bookings = { id: booking.id };
            }
          } catch (bookingError) {
            console.warn('Erro ao buscar booking:', bookingError);
          }
        } else {
          enrichedInteraction.reference_display = interaction.reference_id;
        }
        
        enrichedData.push(enrichedInteraction);
      }

      return enrichedData as ClientInteraction[];
    }
  );

  return {
    interactions: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Hook para buscar todas as interações (para admin)
export function useAllClientInteractions() {
  const { data, error, isLoading, mutate } = useSWR(
    'all-client-interactions',
    async () => {
      // Buscar interações com dados do cliente (relacionamento FK existe para clients)
      const { data, error } = await supabase
        .from('client_interactions')
        .select(`
          *,
          clients (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar todas as interações:', error);
        throw error;
      }

      // Enriquecer dados manualmente para quotes e bookings
      const enrichedData = [];
      
      for (const interaction of data || []) {
        let enrichedInteraction = { ...interaction };
        
        // Buscar dados relacionados baseado no tipo de interação
        if (interaction.interaction_type === 'quote' && interaction.reference_id) {
          try {
            const { data: quote } = await supabase
              .from('quotes')
              .select('booking_reference')
              .eq('id', interaction.reference_id)
              .single();
              
            if (quote) {
              enrichedInteraction.reference_display = quote.booking_reference;
              enrichedInteraction.quotes = { booking_reference: quote.booking_reference };
            }
          } catch (quoteError) {
            console.warn('Erro ao buscar quote:', quoteError);
          }
        } else if (interaction.interaction_type === 'reservation' && interaction.reference_id) {
          try {
            const { data: booking } = await supabase
              .from('bookings')
              .select('id')
              .eq('id', interaction.reference_id)
              .single();
              
            if (booking) {
              enrichedInteraction.reference_display = `BK-${booking.id.slice(-6).toUpperCase()}`;
              enrichedInteraction.bookings = { id: booking.id };
            }
          } catch (bookingError) {
            console.warn('Erro ao buscar booking:', bookingError);
          }
        } else {
          enrichedInteraction.reference_display = interaction.reference_id;
        }
        
        enrichedData.push(enrichedInteraction);
      }

      return enrichedData as ClientInteraction[];
    }
  );

  return {
    interactions: data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Função para criar uma nova interação
export async function createClientInteraction(interactionData: CreateClientInteractionData): Promise<ClientInteraction> {
  const { data, error } = await supabase
    .from('client_interactions')
    .insert([interactionData])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar interação:', error);
    throw error;
  }

  return data as ClientInteraction;
}

// Função para atualizar uma interação
export async function updateClientInteraction(
  id: number,
  updates: Partial<CreateClientInteractionData>
): Promise<ClientInteraction> {
  const { data, error } = await supabase
    .from('client_interactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar interação:', error);
    throw error;
  }

  return data as ClientInteraction;
}

// Função para deletar uma interação
export async function deleteClientInteraction(id: number): Promise<void> {
  const { error } = await supabase
    .from('client_interactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar interação:', error);
    throw error;
  }
}

// Função para buscar interações por tipo
export async function getInteractionsByType(
  clientId: number,
  type: string
): Promise<ClientInteraction[]> {
  const { data, error } = await supabase
    .from('client_interactions')
    .select('*')
    .eq('client_id', clientId)
    .eq('interaction_type', type)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar interações por tipo:', error);
    throw error;
  }

  return data as ClientInteraction[];
}

// Função para buscar interações por período
export async function getInteractionsByDateRange(
  clientId: number,
  startDate: string,
  endDate: string
): Promise<ClientInteraction[]> {
  const { data, error } = await supabase
    .from('client_interactions')
    .select('*')
    .eq('client_id', clientId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar interações por período:', error);
    throw error;
  }

  return data as ClientInteraction[];
}

// Função para obter estatísticas de interações do cliente
export async function getClientInteractionStats(clientId: number) {
  const { data, error } = await supabase
    .from('client_interactions')
    .select('interaction_type')
    .eq('client_id', clientId);

  if (error) {
    console.error('Erro ao buscar estatísticas de interações:', error);
    throw error;
  }

  // Contar interações por tipo
  const stats = data.reduce((acc: Record<string, number>, interaction) => {
    acc[interaction.interaction_type] = (acc[interaction.interaction_type] || 0) + 1;
    return acc;
  }, {});

  return {
    total: data.length,
    byType: stats
  };
}