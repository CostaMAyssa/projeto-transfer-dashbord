const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔧 CORRIGINDO INTERAÇÃO FALTANTE DO MARCOS:');
    
    // Dados do orçamento sem vinculação
    const quoteId = '4eb93011-5d4d-4ab1-b605-d5d80a6b4d70';
    const marcosId = 11;
    
    // Buscar dados do orçamento
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();
    
    if (quoteError) {
      console.error('Erro ao buscar orçamento:', quoteError);
      return;
    }
    
    console.log('📋 Orçamento encontrado:');
    console.log('- ID:', quote.id);
    console.log('- Booking Reference:', quote.booking_reference);
    console.log('- Cliente:', quote.customer_name);
    console.log('- Status:', quote.status);
    console.log('- Valor:', quote.total_amount);
    
    // Criar a interação faltante
    const { data: newInteraction, error: interactionError } = await supabase
      .from('client_interactions')
      .insert({
        client_id: marcosId,
        interaction_type: 'quote',
        reference_id: quote.id,
        status: quote.status,
        description: `Orçamento ${quote.booking_reference} - ${quote.pickup_address || 'Origem'} → ${quote.destination_address || 'Destino'} - Valor: $${quote.total_amount}`,
        created_by: 'system_auto_fix'
      })
      .select()
      .single();
    
    if (interactionError) {
      console.error('Erro ao criar interação:', interactionError);
      return;
    }
    
    console.log('\n✅ INTERAÇÃO CRIADA COM SUCESSO:');
    console.log('- ID da interação:', newInteraction.id);
    console.log('- Tipo:', newInteraction.interaction_type);
    console.log('- Status:', newInteraction.status);
    console.log('- Descrição:', newInteraction.description);
    
    // Verificar resultado final
    console.log('\n🎯 VERIFICAÇÃO FINAL - TODAS AS INTERAÇÕES DO MARCOS:');
    const { data: allInteractions, error: finalError } = await supabase
      .from('client_interactions')
      .select('*')
      .eq('client_id', marcosId)
      .order('created_at', { ascending: false });
    
    if (finalError) {
      console.error('Erro na verificação final:', finalError);
      return;
    }
    
    console.log(`Total de interações: ${allInteractions.length}`);
    allInteractions.forEach((interaction, index) => {
      console.log(`\nInteração ${index + 1}:`);
      console.log('- ID:', interaction.id);
      console.log('- Tipo:', interaction.interaction_type);
      console.log('- Status:', interaction.status);
      console.log('- Descrição:', interaction.description);
      console.log('- Referência ID:', interaction.reference_id);
      console.log('- Criado em:', interaction.created_at);
    });
    
    console.log('\n🎉 CORREÇÃO CONCLUÍDA! Agora o Marcos deve ter todas as interações visíveis no histórico.');
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
})();