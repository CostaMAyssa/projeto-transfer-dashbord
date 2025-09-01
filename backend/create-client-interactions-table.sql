-- Criar tabela client_interactions
CREATE TABLE public.client_interactions (
    id serial PRIMARY KEY,
    client_id int NOT NULL REFERENCES clients(id),
    interaction_type varchar(50) NOT NULL, -- 'quote', 'reservation', 'call', 'email', 'note'
    reference_id uuid NULL, -- id do quote ou reserva, se aplicável
    status varchar(50) NULL, -- ex: draft, sent, accepted, rejected
    description text NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by varchar(150) NULL -- usuário que registrou a interação
);

-- Criar índices para melhor performance
CREATE INDEX idx_client_interactions_client_id ON public.client_interactions(client_id);
CREATE INDEX idx_client_interactions_type ON public.client_interactions(interaction_type);
CREATE INDEX idx_client_interactions_created_at ON public.client_interactions(created_at);
CREATE INDEX idx_client_interactions_reference_id ON public.client_interactions(reference_id);

-- Adicionar comentários
COMMENT ON TABLE public.client_interactions IS 'Tabela para armazenar histórico de interações com clientes';
COMMENT ON COLUMN public.client_interactions.interaction_type IS 'Tipo de interação: quote, reservation, call, email, note';
COMMENT ON COLUMN public.client_interactions.reference_id IS 'ID de referência para quotes ou reservas';
COMMENT ON COLUMN public.client_interactions.status IS 'Status da interação: draft, sent, accepted, rejected, etc';
COMMENT ON COLUMN public.client_interactions.created_by IS 'Usuário que registrou a interação';

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.client_interactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir que admins vejam todas as interações
CREATE POLICY "Admin can view all client interactions" ON public.client_interactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- Política para permitir que admins insiram interações
CREATE POLICY "Admin can insert client interactions" ON public.client_interactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- Política para permitir que admins atualizem interações
CREATE POLICY "Admin can update client interactions" ON public.client_interactions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- Política para permitir que admins deletem interações
CREATE POLICY "Admin can delete client interactions" ON public.client_interactions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE admin_profiles.id = auth.uid()
        )
    );

-- Inserir alguns dados de exemplo
INSERT INTO public.client_interactions (client_id, interaction_type, reference_id, status, description, created_by) VALUES
(1, 'quote', gen_random_uuid(), 'sent', 'Quote enviada para transfer do aeroporto', 'admin@example.com'),
(1, 'note', NULL, NULL, 'Cliente ligou perguntando sobre disponibilidade', 'admin@example.com'),
(1, 'reservation', gen_random_uuid(), 'confirmed', 'Reserva confirmada para 25/08/2025', 'admin@example.com'),
(2, 'quote', gen_random_uuid(), 'draft', 'Quote em elaboração', 'admin@example.com'),
(2, 'call', NULL, 'completed', 'Ligação realizada para esclarecimentos', 'admin@example.com');