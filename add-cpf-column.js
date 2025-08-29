const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://micpkdvtewsbtbrptuoj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTc3MzksImV4cCI6MjA2NTMzMzczOX0.ZT-ahqgL0Zc1GxAzUEYCL-uFMecnWy0L3ZBIROamtwA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCurrentStructure() {
  console.log('🔍 Verificando estrutura atual da tabela clients...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro:', error.message)
      return false
    }
    
    if (data && data.length > 0) {
      console.log('📋 Colunas atuais da tabela clients:')
      console.log(Object.keys(data[0]).join(', '))
    } else {
      console.log('📋 Tabela clients existe mas está vazia')
    }
    
    return true
    
  } catch (err) {
    console.error('💥 Erro:', err.message)
    return false
  }
}

async function testCPFColumn() {
  console.log('\n🔍 Testando se a coluna cpf existe...')
  
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('cpf')
      .limit(1)
    
    if (error) {
      if (error.code === '42703') {
        console.log('❌ Coluna cpf NÃO EXISTE')
        return false
      }
      console.error('❌ Erro inesperado:', error.message)
      return false
    }
    
    console.log('✅ Coluna cpf EXISTE!')
    return true
    
  } catch (err) {
    console.error('💥 Erro:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Diagnóstico da tabela clients...')
  
  await checkCurrentStructure()
  const cpfExists = await testCPFColumn()
  
  if (!cpfExists) {
    console.log('\n📝 SOLUÇÃO:')
    console.log('A tabela clients existe, mas não tem a coluna cpf.')
    console.log('Você precisa executar uma migração SQL para adicionar a coluna:')
    console.log('')
    console.log('ALTER TABLE clients ADD COLUMN cpf TEXT;')
    console.log('')
    console.log('Ou execute o script backend/create-clients-table.sql no Supabase Dashboard.')
  }
  
  console.log('\n✨ Diagnóstico concluído!')
}

main().catch(console.error)