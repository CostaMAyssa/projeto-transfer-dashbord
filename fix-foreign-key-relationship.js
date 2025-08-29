const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔧 INVESTIGANDO E CORRIGINDO RELACIONAMENTO ENTRE TABELAS:');
    
    console.log('\n1️⃣ VERIFICANDO ESTRUTURA DA TABELA client_interactions:');
    const { data: interactionsSchema, error: interactionsError } = await supabase
      .from('client_interactions')
      .select('*')
      .limit(1);
      
    if (interactionsError) {
      console.error('❌ Erro ao verificar client_interactions:', interactionsError);
    } else {
      console.log('✅ Estrutura client_interactions:', Object.keys(interactionsSchema[0] || {}));
    }
    
    console.log('\n2️⃣ VERIFICANDO ESTRUTURA DA TABELA quotes:');
    const { data: quotesSchema, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .limit(1);
      
    if (quotesError) {
      console.error('❌ Erro ao verificar quotes:', quotesError);
    } else {
      console.log('✅ Estrutura quotes:', Object.keys(quotesSchema[0] || {}));
    }
    
    console.log('\n3️⃣ TESTANDO CONSULTA SEM JOIN (client_interactions apenas):');
    const marcosId = 11;
    
    const { data: simpleInteractions, error: simpleError } = await supabase
      .from('client_interactions')
      .select('*')
      .eq('client_id', marcosId)
      .order('created_at', { ascending: false });
      
    if (simpleError) {
      console.error('❌ Erro na consulta simples:', simpleError);
    } else {
      console.log(`✅ Interações encontradas (sem JOIN): ${simpleInteractions.length}`);
      simpleInteractions.forEach((interaction, index) => {
        console.log(`\nInteração ${index + 1}:`);
        console.log('- ID:', interaction.id);
        console.log('- Tipo:', interaction.interaction_type);
        console.log('- Reference ID:', interaction.reference_id);
        console.log('- Status:', interaction.status);
        console.log('- Descrição:', interaction.description);
      });
    }
    
    console.log('\n4️⃣ TESTANDO BUSCA MANUAL DE QUOTES RELACIONADAS:');
    
    if (simpleInteractions && simpleInteractions.length > 0) {
      for (const interaction of simpleInteractions) {
        if (interaction.interaction_type === 'quote' && interaction.reference_id) {
          console.log(`\n🔍 Buscando quote com ID: ${interaction.reference_id}`);
          
          const { data: quote, error: quoteError } = await supabase
            .from('quotes')
            .select('id, booking_reference, customer_name')
            .eq('id', interaction.reference_id)
            .single();
            
          if (quoteError) {
            console.error('❌ Erro ao buscar quote:', quoteError);
          } else {
            console.log('✅ Quote encontrada:', quote);
          }
        }
      }
    }
    
    console.log('\n5️⃣ SOLUÇÃO ALTERNATIVA - CONSULTA MANUAL:');
    console.log('Como o relacionamento FK não está configurado, vamos buscar os dados manualmente...');
    
    if (simpleInteractions && simpleInteractions.length > 0) {
      const enrichedInteractions = [];
      
      for (const interaction of simpleInteractions) {
        let enrichedInteraction = { ...interaction };
        
        if (interaction.interaction_type === 'quote' && interaction.reference_id) {
          const { data: quote } = await supabase
            .from('quotes')
            .select('booking_reference')
            .eq('id', interaction.reference_id)
            .single();
            
          if (quote) {
            enrichedInteraction.reference_display = quote.booking_reference;
          }
        }
        
        enrichedInteractions.push(enrichedInteraction);
      }
      
      console.log('\n🎯 DADOS ENRIQUECIDOS MANUALMENTE:');
      enrichedInteractions.forEach((interaction, index) => {
        console.log(`\nInteração ${index + 1}:`);
        console.log('- ID:', interaction.id);
        console.log('- Tipo:', interaction.interaction_type);
        console.log('- Reference Display:', interaction.reference_display || 'N/A');
        console.log('- Status:', interaction.status);
        console.log('- Descrição:', interaction.description);
      });
      
      console.log('\n💡 SOLUÇÃO: Precisamos atualizar o hook useClientInteractions para fazer consultas manuais!');
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
})();