import { createClient } from '@supabase/supabase-js';
import BookingDetailsClient from './booking-details-client';

export const dynamicParams = false; // Garante que apenas os IDs gerados sejam válidos

export async function generateStaticParams() {
  // Temporariamente, retornando IDs fixos para depuração.
  // Isso nos ajudará a verificar se o problema está na lógica do Supabase.
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function BookingDetailsServerPage({ params }: { params: { id: string } }) {
  return <BookingDetailsClient id={params.id} />;
}
