const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  try {
    console.log('🔍 DEBUGANDO HOOK useClientInteractions:');
    
    const marcosId = 11;
    
    console.log('\n1️⃣ TESTANDO CONSULTA EXATA DO HOOK:');
    
    // Replicar exatamente a consulta do hook
    const { data, error } = await supabase
      .from('client_interactions')
      .select(`
        *,
        quotes!left(booking_reference),
        bookings!left(id)
      `)
      .eq('client_id', marcosId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ ERRO na consulta:', error);
      return;
    }

    console.log('✅ Consulta executada com sucesso!');
    console.log('📊 Dados brutos retornados:', JSON.stringify(data, null, 2));
    console.log(`📈 Total de registros: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('\n2️⃣ MAPEAMENTO DOS DADOS (como no hook):');
      
      const mappedData = data.map(interaction => ({
        ...interaction,
        reference_display: interaction.interaction_type === 'quote' 
          ? interaction.quotes?.booking_reference 
          : interaction.interaction_type === 'reservation'
          ? `BK-${interaction.bookings?.id?.slice(-6)?.toUpperCase() || 'N/A'}`
          : interaction.reference_id
      }));
      
      console.log('🎯 Dados mapeados:');
      mappedData.forEach((interaction, index) => {
        console.log(`\nInteração ${index + 1}:`);
        console.log('- ID:', interaction.id);
        console.log('- Tipo:', interaction.interaction_type);
        console.log('- Status:', interaction.status);
        console.log('- Descrição:', interaction.description);
        console.log('- Reference ID:', interaction.reference_id);
        console.log('- Reference Display:', interaction.reference_display);
        console.log('- Quotes:', interaction.quotes);
        console.log('- Bookings:', interaction.bookings);
        console.log('- Criado em:', interaction.created_at);
      });
    } else {
      console.log('\n⚠️  NENHUM DADO RETORNADO!');
      
      console.log('\n3️⃣ VERIFICANDO SE EXISTEM INTERAÇÕES SEM JOIN:');
      const { data: simpleData, error: simpleError } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('client_id', marcosId);
        
      if (simpleError) {
        console.error('❌ ERRO na consulta simples:', simpleError);
      } else {
        console.log('📊 Dados sem JOIN:', JSON.stringify(simpleData, null, 2));
        console.log(`📈 Total sem JOIN: ${simpleData?.length || 0}`);
      }
      
      console.log('\n4️⃣ VERIFICANDO ESTRUTURA DA TABELA:');
      const { data: tableInfo, error: tableError } = await supabase
        .from('client_interactions')
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('❌ ERRO ao verificar estrutura:', tableError);
      } else {
        console.log('🏗️  Estrutura da tabela (primeiro registro):');
        console.log(JSON.stringify(tableInfo, null, 2));
      }
    }
    
    console.log('\n5️⃣ VERIFICANDO RELACIONAMENTOS:');
    
    // Verificar se existe relacionamento entre client_interactions e quotes
    const { data: relationTest, error: relationError } = await supabase
      .from('client_interactions')
      .select('*, quotes(*)')
      .eq('client_id', marcosId)
      .limit(1);
      
    if (relationError) {
      console.error('❌ ERRO no relacionamento:', relationError);
      console.log('💡 Isso pode indicar problema na configuração do relacionamento no Supabase');
    } else {
      console.log('✅ Relacionamento funciona:', JSON.stringify(relationTest, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
})();