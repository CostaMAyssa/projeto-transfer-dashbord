import { createClient } from '@supabase/supabase-js';
import BookingDetailsClient from './booking-details-client';

export const dynamicParams = false; // Garante que apenas os IDs gerados sejam válidos

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key environment variables.');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id');

  if (error) {
    console.error('Error fetching booking IDs for generateStaticParams:', error);
    return []; // Retorna um array vazio para não quebrar o build
  }

  return bookings.map((booking) => ({
    id: booking.id,
  }));
}

export default function BookingDetailsServerPage({ params }: { params: { id: string } }) {
  return <BookingDetailsClient id={params.id} />;
}
