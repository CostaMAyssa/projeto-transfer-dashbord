import BookingDetailsClient from './booking-details-client'

export default function BookingDetailsServerPage({ params }: { params: { id: string } }) {
  return <BookingDetailsClient id={params.id} />
}
