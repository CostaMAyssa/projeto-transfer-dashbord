const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔧 CORRIGINDO INTERAÇÃO FALTANTE DO MARCOS...');
    
    // Dados do orçamento sem vinculação
    const quoteId = '4eb93011-5d4d-4ab1-b605-d5d80a6b4d70';
    const marcosId = 11;
    const bookingReference = 'QT623753';
    
    // Buscar dados completos do orçamento
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();
    
    if (quoteError) {
      console.error('Erro ao buscar orçamento:', quoteError);
      return;
    }
    
    console.log('📋 ORÇAMENTO ENCONTRADO:');
    console.log('- ID:', quote.id);
    console.log('- Booking Reference:', quote.booking_reference);
    console.log('- Cliente:', quote.customer_name);
    console.log('- Status:', quote.status);
    console.log('- Valor:', quote.total_amount);
    console.log('- Origem:', quote.pickup_address);
    console.log('- Destino:', quote.destination_address);
    
    // Criar a interação faltante
    const interactionData = {
      client_id: marcosId,
      interaction_type: 'quote',
      reference_id: quoteId,
      status: quote.status,
      description: `Orçamento ${quote.booking_reference} - ${quote.pickup_address || 'Origem não informada'} → ${quote.destination_address || 'Destino não informado'} - Valor: $${quote.total_amount}`,
      created_by: 'system_auto_fix'
    };
    
    console.log('\n➕ CRIANDO INTERAÇÃO:');
    console.log('Dados da interação:', interactionData);
    
    const { data: newInteraction, error: insertError } = await supabase
      .from('client_interactions')
      .insert(interactionData)
      .select()
      .single();
    
    if (insertError) {
      console.error('Erro ao criar interação:', insertError);
      return;
    }
    
    console.log('\n✅ INTERAÇÃO CRIADA COM SUCESSO!');
    console.log('- ID da interação:', newInteraction.id);
    console.log('- Tipo:', newInteraction.interaction_type);
    console.log('- Status:', newInteraction.status);
    console.log('- Descrição:', newInteraction.description);
    
    // Verificar resultado final
    console.log('\n🔍 VERIFICAÇÃO FINAL - TODAS AS INTERAÇÕES DO MARCOS:');
    const { data: allInteractions, error: finalError } = await supabase
      .from('client_interactions')
      .select('*')
      .eq('client_id', marcosId)
      .order('created_at', { ascending: false });
    
    if (finalError) {
      console.error('Erro na verificação final:', finalError);
      return;
    }
    
    console.log(`Total de interações agora: ${allInteractions.length}`);
    allInteractions.forEach((int, index) => {
      console.log(`\nInteração ${index + 1}:`);
      console.log('- ID:', int.id);
      console.log('- Tipo:', int.interaction_type);
      console.log('- Status:', int.status);
      console.log('- Referência ID:', int.reference_id);
      console.log('- Descrição:', int.description);
      console.log('- Criado em:', int.created_at);
    });
    
    console.log('\n🎉 CORREÇÃO CONCLUÍDA! Agora o orçamento QT623753 deve aparecer no histórico do Marcos.');
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
})();