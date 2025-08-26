const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://micpkdvtewsbtbrptuoj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3BrZHZ0ZXdzYnRicnB0dW9qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc1NzczOSwiZXhwIjoyMDY1MzMzNzM5fQ.Uy8qZWgvx8kBu6EqJQXQJQXQJQXQJQXQJQXQJQXQJQXQ';

// Criar cliente Supabase com service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migração da coluna payment_status...');
    
    // Ler o arquivo SQL
    const sqlFilePath = path.join(__dirname, '..', 'backend', 'add-payment-status-column.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Executar o SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sqlContent
    });
    
    if (error) {
      console.error('❌ Erro ao executar migração:', error);
      return;
    }
    
    console.log('✅ Migração executada com sucesso!');
    console.log('📊 Resultado:', data);
    
    // Verificar se a coluna foi criada
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'reservations')
      .eq('column_name', 'payment_status');
    
    if (checkError) {
      console.error('❌ Erro ao verificar coluna:', checkError);
      return;
    }
    
    if (columns && columns.length > 0) {
      console.log('✅ Coluna payment_status confirmada na tabela reservations!');
    } else {
      console.log('⚠️ Coluna payment_status não encontrada. Tentando método alternativo...');
      
      // Método alternativo: executar SQL diretamente
      const { error: directError } = await supabase.rpc('exec', {
        sql: `
          DO $$
          BEGIN
              IF NOT EXISTS (
                  SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'reservations' 
                  AND column_name = 'payment_status'
              ) THEN
                  ALTER TABLE public.reservations 
                  ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (
                      payment_status IN ('unpaid', 'partial', 'paid', 'refunded')
                  );
                  
                  CREATE INDEX IF NOT EXISTS idx_reservations_payment_status ON reservations(payment_status);
                  
                  COMMENT ON COLUMN reservations.payment_status IS 'Status do pagamento: unpaid (não pago), partial (parcial), paid (pago), refunded (reembolsado)';
                  
                  RAISE NOTICE 'Coluna payment_status adicionada à tabela reservations com sucesso!';
              ELSE
                  RAISE NOTICE 'Coluna payment_status já existe na tabela reservations.';
              END IF;
          END $$;
        `
      });
      
      if (directError) {
        console.error('❌ Erro no método alternativo:', directError);
      } else {
        console.log('✅ Método alternativo executado com sucesso!');
      }
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar migração
runMigration();