-- Criação da tabela clients
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  address TEXT,
  company TEXT,
  position TEXT,
  tags TEXT,
  billing_address TEXT,
  cpf TEXT,
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'active', 'inactive', 'prospect')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Política para admins (acesso total)
CREATE POLICY "Admins can do everything on clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles 
      WHERE id = auth.uid()
    )
  );

-- Política para leitura pública (se necessário)
CREATE POLICY "Public read access to clients" ON public.clients
  FOR SELECT USING (true);

-- Comentários para documentação
COMMENT ON TABLE public.clients IS 'Tabela de clientes/contatos do sistema';
COMMENT ON COLUMN public.clients.status IS 'Status do cliente: lead, active, inactive, prospect';
COMMENT ON COLUMN public.clients.tags IS 'Tags para categorização do cliente';
COMMENT ON COLUMN public.clients.cpf IS 'CPF ou documento de identificação';
COMMENT ON COLUMN public.clients.billing_address IS 'Endereço de cobrança diferente do endereço principal';