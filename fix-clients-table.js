const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://micpkdvtewsbtbrptuoj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTc3MzksImV4cCI6MjA2NTMzMzczOX0.ZT-ahqgL0Zc1GxAzUEYCL-uFMecnWy0L3ZBIROamtwA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addCPFColumn() {
  console.log('🔧 Tentando adicionar coluna cpf à tabela clients...')
  
  try {
    // Primeiro, vamos tentar inserir um registro de teste para ver se a coluna cpf existe
    const testData = {
      full_name: 'Teste CPF',
      email: 'teste@teste.com',
      phone: '11999999999',
      cpf: '12345678901'
    }
    
    const { data, error } = await supabase
      .from('clients')
      .insert([testData])
      .select()
    
    if (error) {
      if (error.code === '42703' && error.message.includes('cpf')) {
        console.log('❌ Confirmado: coluna cpf não existe')
        console.log('\n📝 INSTRUÇÕES PARA CORRIGIR:')
        console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard')
        console.log('2. Vá para o projeto: micpkdvtewsbtbrptuoj')
        console.log('3. Clique em "SQL Editor"')
        console.log('4. Execute o seguinte comando:')
        console.log('')
        console.log('   ALTER TABLE public.clients ADD COLUMN cpf TEXT;')
        console.log('')
        console.log('5. Ou execute o arquivo add-cpf-column.sql que foi criado')
        return false
      } else {
        console.error('❌ Erro inesperado:', error.message)
        return false
      }
    }
    
    console.log('✅ Sucesso! Coluna cpf já existe ou foi adicionada')
    console.log('📊 Registro de teste criado:', data)
    
    // Limpar o registro de teste
    if (data && data.length > 0) {
      await supabase
        .from('clients')
        .delete()
        .eq('id', data[0].id)
      console.log('🧹 Registro de teste removido')
    }
    
    return true
    
  } catch (err) {
    console.error('💥 Erro:', err.message)
    return false
  }
}

async function testCPFSearch() {
  console.log('\n🔍 Testando busca por CPF...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, full_name, cpf')
      .eq('cpf', '12345678901')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro na busca por CPF:', error.message)
      return false
    }
    
    console.log('✅ Busca por CPF funcionando!')
    console.log('📊 Resultados encontrados:', data?.length || 0)
    return true
    
  } catch (err) {
    console.error('💥 Erro na busca:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Corrigindo tabela clients...')
  
  const success = await addCPFColumn()
  
  if (success) {
    await testCPFSearch()
    console.log('\n✅ Problema resolvido! A busca por CPF deve funcionar agora.')
  } else {
    console.log('\n❌ Problema não resolvido. Siga as instruções acima.')
  }
  
  console.log('\n✨ Processo concluído!')
}

main().catch(console.error)