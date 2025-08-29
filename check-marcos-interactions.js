const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔍 VERIFICANDO CLIENTE MARCOS:');
    
    // Buscar cliente Marcos
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .ilike('full_name', '%marcos%');
    
    if (clientError) {
      console.error('Erro ao buscar cliente:', clientError);
      return;
    }
    
    console.log('Clientes encontrados:', clients);
    
    if (clients.length > 0) {
      const marcos = clients[0];
      console.log('\n👤 DADOS DO MARCOS:');
      console.log('- ID:', marcos.id);
      console.log('- Nome:', marcos.full_name);
      console.log('- Email:', marcos.email);
      
      console.log('\n📋 VERIFICANDO INTERAÇÕES DO MARCOS:');
      const { data: interactions, error: intError } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('client_id', marcos.id)
        .order('created_at', { ascending: false });
      
      if (intError) {
        console.error('Erro ao buscar interações:', intError);
        return;
      }
      
      console.log('Total de interações encontradas:', interactions?.length || 0);
      if (interactions && interactions.length > 0) {
        interactions.forEach((int, index) => {
          console.log(`\nInteração ${index + 1}:`);
          console.log('- ID:', int.id);
          console.log('- Tipo:', int.interaction_type);
          console.log('- Status:', int.status);
          console.log('- Descrição:', int.description);
          console.log('- Referência ID:', int.reference_id);
          console.log('- Booking Reference:', int.quotes?.booking_reference);
          console.log('- Criado em:', int.created_at);
        });
      } else {
        console.log('❌ Nenhuma interação encontrada para o Marcos!');
      }
      
      console.log('\n💰 VERIFICANDO ORÇAMENTOS VINCULADOS AO MARCOS:');
      const { data: quotes, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .ilike('customer_name', '%marcos%')
        .order('created_at', { ascending: false });
      
      if (quoteError) {
        console.error('Erro ao buscar orçamentos:', quoteError);
        return;
      }
      
      console.log('Total de orçamentos encontrados:', quotes?.length || 0);
      if (quotes && quotes.length > 0) {
        quotes.forEach((quote, index) => {
          console.log(`\nOrçamento ${index + 1}:`);
          console.log('- ID:', quote.id);
          console.log('- Booking Reference:', quote.booking_reference);
          console.log('- Cliente:', quote.customer_name);
          console.log('- Status:', quote.status);
          console.log('- Valor:', quote.total_amount);
          console.log('- Criado em:', quote.created_at);
        });
      } else {
        console.log('❌ Nenhum orçamento encontrado para o Marcos!');
      }
      
      // Verificar se existem orçamentos sem interação
      if (quotes && quotes.length > 0) {
        console.log('\n🔗 VERIFICANDO VINCULAÇÕES:');
        for (const quote of quotes) {
          const hasInteraction = interactions?.some(int => 
            int.reference_id === quote.id && int.interaction_type === 'quote'
          );
          console.log(`Orçamento ${quote.booking_reference}: ${hasInteraction ? '✅ Vinculado' : '❌ SEM VINCULAÇÃO'}`);
        }
      }
    } else {
      console.log('❌ Cliente Marcos não encontrado!');
    }
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
})();