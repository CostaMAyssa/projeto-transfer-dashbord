-- Adicionar coluna reservation_number à tabela reservations
-- Esta coluna é necessária para o funcionamento da Edge Function de pagamentos

-- Verificar se a coluna já existe
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
        ADD COLUMN reservation_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8));
        
        -- Adicionar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_reservations_reservation_number ON reservations(reservation_number);
        
        -- Adicionar comentário para documentação
        COMMENT ON COLUMN reservations.reservation_number IS 'Número único da reserva para identificação do cliente';
        
        RAISE NOTICE 'Coluna reservation_number adicionada à tabela reservations com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna reservation_number já existe na tabela reservations.';
    END IF;
END $$;

-- Atualizar registros existentes que não têm reservation_number
UPDATE public.reservations 
SET reservation_number = 'RV-' || UPPER(SUBSTRING(extensions.uuid_generate_v4()::text, 1, 8))
WHERE reservation_number IS NULL;

RAISE NOTICE 'Script executado com sucesso! Coluna reservation_number configurada na tabela reservations.';