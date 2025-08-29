const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://micpkdvtewsbtbrptuoj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTc3MzksImV4cCI6MjA2NTMzMzczOX0.ZT-ahqgL0Zc1GxAzUEYCL-uFMecnWy0L3ZBIROamtwA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testClientCreation() {
  console.log('🧪 Testando criação de cliente com todos os campos...')
  
  // Dados de teste completos (apenas campos que existem na tabela)
  const clientData = {
    full_name: 'João Silva Teste',
    email: 'joao.teste@email.com',
    phone: '(11) 99999-9999',
    company: 'Empresa Teste Ltda',
    role: 'Gerente de Vendas',
    address: 'Rua Teste, 123 - São Paulo, SP',
    tags: 'cliente vip, teste',
    billing_address: 'Rua Cobrança, 456 - São Paulo, SP',
    customer_cpf: '123.456.789-00',
    notes: 'Cliente de teste para verificar salvamento de campos',
    status: 'lead'
  }
  
  try {
    console.log('📝 Dados a serem inseridos:')
    console.log(JSON.stringify(clientData, null, 2))
    
    // Inserir cliente
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar cliente:', error)
      return
    }
    
    console.log('✅ Cliente criado com sucesso!')
    console.log('📊 Dados salvos:')
    console.log(JSON.stringify(data, null, 2))
    
    // Verificar quais campos foram salvos
    console.log('\n🔍 Verificação de campos:')
    Object.keys(clientData).forEach(field => {
      const saved = data[field] !== null && data[field] !== undefined
      const status = saved ? '✅' : '❌'
      console.log(`${status} ${field}: ${saved ? 'SALVO' : 'NÃO SALVO'} (valor: ${data[field]})`)
    })
    
    // Limpar dados de teste
    console.log('\n🧹 Removendo dados de teste...')
    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', data.id)
    
    if (deleteError) {
      console.error('❌ Erro ao remover dados de teste:', deleteError)
    } else {
      console.log('✅ Dados de teste removidos com sucesso!')
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
  }
}

// Executar teste
testClientCreation()
  .then(() => {
    console.log('\n✨ Teste concluído!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro no teste:', error)
    process.exit(1)
  })