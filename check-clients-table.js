const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://micpkdvtewsbtbrptuoj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTc3MzksImV4cCI6MjA2NTMzMzczOX0.ZT-ahqgL0Zc1GxAzUEYCL-uFMecnWy0L3ZBIROamtwA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkClientsTable() {
  console.log('🔍 Verificando se a tabela clients existe...')
  
  try {
    // Tentar fazer uma consulta simples na tabela clients
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro ao acessar tabela clients:')
      console.error('Código:', error.code)
      console.error('Mensagem:', error.message)
      
      if (error.code === '42P01') {
        console.log('📝 A tabela clients NÃO EXISTE no banco de dados.')
      } else if (error.code === '42703') {
        console.log('📝 A tabela clients existe, mas a coluna cpf NÃO EXISTE.')
      }
      
      return false
    }
    
    console.log('✅ Tabela clients existe e está acessível!')
    console.log('📊 Registros encontrados:', data?.length || 0)
    
    // Verificar se há dados
    if (data && data.length > 0) {
      console.log('📋 Estrutura do primeiro registro:')
      console.log('Colunas disponíveis:', Object.keys(data[0]))
      console.log('Dados:', data[0])
    }
    
    return true
    
  } catch (err) {
    console.error('💥 Erro inesperado:', err.message)
    return false
  }
}

async function testCPFSearch() {
  console.log('\n🔍 Testando busca por CPF...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('customer_cpf', '12345678901')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro na busca por CPF:')
      console.error('Código:', error.code)
      console.error('Mensagem:', error.message)
      return false
    }
    
    console.log('✅ Busca por CPF funcionando!')
    console.log('📊 Resultados:', data?.length || 0)
    return true
    
  } catch (err) {
    console.error('💥 Erro na busca por CPF:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico da tabela clients...')
  
  const tableExists = await checkClientsTable()
  
  if (tableExists) {
    await testCPFSearch()
  }
  
  console.log('\n✨ Diagnóstico concluído!')
}

main().catch(console.error)