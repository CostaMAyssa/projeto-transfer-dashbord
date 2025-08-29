import EditReservationClient from './EditReservationClient'

export default function EditReservationPage({ params }: { params: { id: string } }) {
  return <EditReservationClient id={params.id} />
}