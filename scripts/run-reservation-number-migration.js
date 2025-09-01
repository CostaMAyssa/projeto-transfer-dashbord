const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!')
  console.log('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addReservationNumberColumn() {
  console.log('🔄 Verificando se a coluna reservation_number existe...')
  
  try {
    // Verificar se a coluna já existe
    const { data: columns, error: checkError } = await supabase
      .rpc('check_column_exists', {
        table_name: 'reservations',
        column_name: 'reservation_number'
      })
    
    if (checkError) {
      console.log('⚠️  Função check_column_exists não existe, tentando método alternativo...')
      
      // Método alternativo: tentar fazer uma query simples
      const { error: testError } = await supabase
        .from('reservations')
        .select('reservation_number')
        .limit(1)
      
      if (testError && testError.message.includes('column "reservation_number" does not exist')) {
        console.log('✅ Coluna reservation_number não existe, criando...')
        await createColumn()
      } else if (!testError) {
        console.log('✅ Coluna reservation_number já existe!')
      } else {
        throw testError
      }
    } else if (columns) {
      console.log('✅ Coluna reservation_number já existe!')
    } else {
      console.log('✅ Coluna reservation_number não existe, criando...')
      await createColumn()
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar coluna:', error.message)
    
    // Se der erro, tentar criar a coluna mesmo assim
    console.log('🔄 Tentando criar a coluna...')
    await createColumn()
  }
}

async function createColumn() {
  try {
    console.log('🔄 Adicionando coluna reservation_number...')
    
    // SQL para adicionar a coluna
    const sql = `
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 
              FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = 'reservations' 
              AND column_name = 'reservation_number'
          ) THEN
              -- Adicionar coluna reservation_number
              ALTER TABLE public.reservations 
              ADD COLUMN reservation_number VARCHAR(50) UNIQUE DEFAULT 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8));
              
              -- Adicionar índice para melhor performance
              CREATE INDEX IF NOT EXISTS idx_reservations_reservation_number ON reservations(reservation_number);
              
              RAISE NOTICE 'Coluna reservation_number adicionada à tabela reservations com sucesso!';
          ELSE
              RAISE NOTICE 'Coluna reservation_number já existe na tabela reservations.';
          END IF;
      END $$;
    `
    
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Coluna reservation_number adicionada com sucesso!')
    
    // Atualizar registros existentes
    console.log('🔄 Atualizando registros existentes...')
    
    const updateSql = `
      UPDATE public.reservations 
      SET reservation_number = 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8))
      WHERE reservation_number IS NULL;
    `
    
    const { error: updateError } = await supabase.rpc('exec_sql', { sql: updateSql })
    
    if (updateError) {
      console.log('⚠️  Erro ao atualizar registros existentes:', updateError.message)
    } else {
      console.log('✅ Registros existentes atualizados!')
    }
    
  } catch (error) {
    console.error('❌ Erro ao criar coluna:', error.message)
    console.log('\n📝 Execute este SQL manualmente no painel do Supabase:')
    console.log(`
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reservations' 
        AND column_name = 'reservation_number'
    ) THEN
        -- Adicionar coluna reservation_number
        ALTER TABLE public.reservations 
        ADD COLUMN reservation_number VARCHAR(50) UNIQUE DEFAULT 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8));
        
        -- Adicionar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_reservations_reservation_number ON reservations(reservation_number);
        
        RAISE NOTICE 'Coluna reservation_number adicionada à tabela reservations com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna reservation_number já existe na tabela reservations.';
    END IF;
END $$;

-- Atualizar registros existentes
UPDATE public.reservations 
SET reservation_number = 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8))
WHERE reservation_number IS NULL;
`)
  }
}

// Executar a migração
addReservationNumberColumn()
  .then(() => {
    console.log('\n🎉 Migração concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro na migração:', error)
    process.exit(1)
  })