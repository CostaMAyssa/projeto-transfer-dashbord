-- Adicionar coluna payment_status à tabela reservations
-- Esta coluna é necessária para o funcionamento da Edge Function de pagamentos

-- Verificar se a coluna já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reservations' 
        AND column_name = 'payment_status'
    ) THEN
        -- Adicionar coluna payment_status
        ALTER TABLE public.reservations 
        ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (
            payment_status IN ('unpaid', 'partial', 'paid', 'refunded')
        );
        
        -- Adicionar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_reservations_payment_status ON reservations(payment_status);
        
        -- Adicionar comentário para documentação
        COMMENT ON COLUMN reservations.payment_status IS 'Status do pagamento: unpaid (não pago), partial (parcial), paid (pago), refunded (reembolsado)';
        
        RAISE NOTICE 'Coluna payment_status adicionada à tabela reservations com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna payment_status já existe na tabela reservations.';
    END IF;
END $$;

-- Atualizar registros existentes que podem ter payment_type mas não payment_status
UPDATE public.reservations 
SET payment_status = CASE 
    WHEN payment_type = 'partial' THEN 'partial'
    WHEN payment_links IS NOT NULL THEN 'pending'
    ELSE 'unpaid'
END
WHERE payment_status IS NULL OR payment_status = 'unpaid';

PRINT 'Script executado com sucesso! Coluna payment_status configurada na tabela reservations.';