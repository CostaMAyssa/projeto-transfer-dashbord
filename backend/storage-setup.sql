-- Criar bucket para imagens de veículos se não existir
insert into storage.buckets (id, name, public)
values ('vehicles', 'vehicles', true)
on conflict (id) do nothing;

-- Permitir acesso público para leitura de imagens
create policy "Imagens públicas para leitura"
on storage.objects for select
using ( bucket_id = 'vehicles' );

-- Permitir upload de imagens para usuários autenticados
create policy "Upload de imagens para usuários autenticados"
on storage.objects for insert
with check (
  bucket_id = 'vehicles'
  and (storage.foldername(name))[1] = 'vehicle-images'
);

-- Permitir atualização de imagens para usuários autenticados
create policy "Atualização de imagens para usuários autenticados"
on storage.objects for update
with check (
  bucket_id = 'vehicles'
  and (storage.foldername(name))[1] = 'vehicle-images'
);

-- Permitir deleção de imagens para usuários autenticados
create policy "Deleção de imagens para usuários autenticados"
on storage.objects for delete
using (
  bucket_id = 'vehicles'
  and (storage.foldername(name))[1] = 'vehicle-images'
); 