-- Criar sequência e função para gerar números de reserva no formato AZ0005000NYC
-- Este script implementa o novo formato de booking reference solicitado

-- Criar sequência para números de reserva
CREATE SEQUENCE IF NOT EXISTS az_booking_sequence 
  START WITH 5000 
  INCREMENT BY 1 
  MINVALUE 5000 
  MAXVALUE 9999999 
  CACHE 1;

-- Função para gerar número de reserva no formato AZ + número + NYC
CREATE OR REPLACE FUNCTION generate_az_booking_number()
RETURNS TEXT AS $$
DECLARE
    sequence_number BIGINT;
    formatted_number TEXT;
BEGIN
    -- Obter próximo número da sequência
    SELECT nextval('az_booking_sequence') INTO sequence_number;
    
    -- Formatar número com zeros à esquerda (mínimo 7 dígitos)
    formatted_number := 'AZ' || LPAD(sequence_number::TEXT, 7, '0') || 'NYC';
    
    RETURN formatted_number;
END;
$$ LANGUAGE plpgsql;

-- Atualizar a tabela reservations para usar a nova função como padrão
ALTER TABLE public.reservations 
ALTER COLUMN reservation_number 
SET DEFAULT generate_az_booking_number();

-- Comentário para documentação
COMMENT ON FUNCTION generate_az_booking_number() IS 'Gera números de reserva no formato AZ0005000NYC em sequência numérica';
COMMENT ON SEQUENCE az_booking_sequence IS 'Sequência para números de reserva AZ Transfer, iniciando em 5000';

-- Atualizar registros existentes para usar o novo formato (opcional)
-- CUIDADO: Isso irá alterar todos os números de reserva existentes
-- Descomente as linhas abaixo apenas se desejar atualizar registros existentes

/*
UPDATE public.reservations 
SET reservation_number = generate_az_booking_number()
WHERE reservation_number LIKE 'RV-%' OR reservation_number LIKE 'RES%';
*/

-- Verificar se a função está funcionando
SELECT generate_az_booking_number() AS sample_booking_number;

-- Função generate_az_booking_number() criada com sucesso!
-- Próximos números de reserva seguirão o formato: AZ0005000NYC, AZ0005001NYC, etc.
-- Para atualizar reservas existentes, descomente e execute o UPDATE no final do script.