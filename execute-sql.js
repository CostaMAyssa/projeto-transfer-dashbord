const https = require('https')

// Configuração do Supabase
const supabaseUrl = 'https://micpkdvtewsbtbrptuoj.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc1NzczOSwiZXhwIjoyMDY1MzMzNzM5fQ.Uy8qZWgvx8kBu6EqJQXQJQXQJQXQJQXQJQXQJQXQJQXQ' // Chave truncada do .env.local

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })
    
    const options = {
      hostname: 'micpkdvtewsbtbrptuoj.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
    
    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(responseData)
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
        }
      })
    })
    
    req.on('error', (err) => {
      reject(err)
    })
    
    req.write(data)
    req.end()
  })
}

async function addCPFColumn() {
  console.log('🔧 Tentando adicionar coluna cpf via API REST...')
  
  const sql = 'ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS cpf TEXT;'
  
  try {
    const result = await executeSQL(sql)
    console.log('✅ Comando SQL executado com sucesso!')
    console.log('📊 Resultado:', result)
    return true
  } catch (error) {
    console.error('❌ Erro ao executar SQL:', error.message)
    
    // Tentar método alternativo usando fetch
    console.log('\n🔄 Tentando método alternativo...')
    return await addCPFColumnAlternative()
  }
}

async function addCPFColumnAlternative() {
  console.log('🔧 Usando método alternativo (Node.js fetch)...')
  
  try {
    // Simular o que seria feito com fetch
    console.log('📝 INSTRUÇÕES MANUAIS:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/micpkdvtewsbtbrptuoj')
    console.log('2. Vá para "SQL Editor"')
    console.log('3. Execute este comando:')
    console.log('')
    console.log('   ALTER TABLE public.clients ADD COLUMN cpf TEXT;')
    console.log('')
    console.log('4. Ou vá para "Table Editor" > "clients" > "Add Column"')
    console.log('   - Nome: cpf')
    console.log('   - Tipo: text')
    console.log('   - Nullable: true')
    
    return false
  } catch (error) {
    console.error('❌ Erro no método alternativo:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Executando correção da tabela clients...')
  
  const success = await addCPFColumn()
  
  if (success) {
    console.log('\n✅ Coluna cpf adicionada com sucesso!')
    console.log('🔄 Reinicie o servidor de desenvolvimento para aplicar as mudanças.')
  } else {
    console.log('\n❌ Não foi possível adicionar a coluna automaticamente.')
    console.log('📋 Siga as instruções manuais acima.')
  }
  
  console.log('\n✨ Processo concluído!')
}

main().catch(console.error)