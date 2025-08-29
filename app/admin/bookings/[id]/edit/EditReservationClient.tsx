"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { mutate } from 'swr'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useReservation, updateReservation, type Reservation } from '@/hooks/useReservations'

interface EditableReservation extends Partial<Reservation> {}

export default function EditReservationClient({ id }: { id: string }) {
  const { data: reservation, error, isLoading } = useReservation(id)
  const [form, setForm] = useState<EditableReservation>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (reservation) {
      setForm({
        customer_name: reservation.customer_name,
        customer_email: reservation.customer_email,
        customer_phone: reservation.customer_phone,
        pickup_address: reservation.pickup_address,
        destination_address: reservation.destination_address,
        pickup_date: reservation.pickup_date,
        pickup_time: reservation.pickup_time,
        return_date: reservation.return_date,
        return_time: reservation.return_time,
        status: reservation.status,
        total_amount: reservation.total_amount,
        reservation_number: reservation.reservation_number,
        booking_reference: reservation.booking_reference,
        payment_status: reservation.payment_status,
        payment_type: reservation.payment_type,
        payment_links: reservation.payment_links ? JSON.stringify(reservation.payment_links, null, 2) : ''
      })
    }
  }, [reservation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'total_amount' ? Number(value) : value }))
  }

  const handleSubmit = async () => {
    if (!reservation) return
    setSaving(true)
    try {
      const updates: EditableReservation = { ...form }
      // Converter payment_links se for string JSON válida
      if (typeof updates.payment_links === 'string') {
        const str = updates.payment_links.trim()
        if (str) {
          try {
            updates.payment_links = JSON.parse(str)
          } catch {
            // mantém string se JSON inválido
          }
        } else {
          updates.payment_links = null as any
        }
      }
      await updateReservation(reservation.id, updates)
      await mutate('reservations')
      await mutate(`reservation-${reservation.id}`)
      alert('Reserva atualizada com sucesso!')
    } catch (e) {
      console.error(e)
      alert('Erro ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando reserva...</p>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">Não foi possível carregar a reserva.</p>
        <Link href="/admin/bookings" className="text-primary underline">Voltar</Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/bookings" className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-medium">Editar Reserva</h1>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-3 py-2 bg-[#E95440] text-white rounded-md hover:bg-[#d63d2a] disabled:opacity-50">
            <Save className="h-4 w-4" /> Salvar
          </button>
          <Link href={`/admin/bookings/${reservation.id}`} className="inline-flex items-center gap-2 px-3 py-2 border rounded-md">
            <X className="h-4 w-4" /> Cancelar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg border p-4 space-y-4">
          <h2 className="font-medium">Dados do Cliente</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm">Nome
              <input name="customer_name" value={form.customer_name ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Email
              <input name="customer_email" value={form.customer_email ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Telefone
              <input name="customer_phone" value={form.customer_phone ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-lg border p-4 space-y-4">
          <h2 className="font-medium">Rota</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm">Endereço de Embarque
              <input name="pickup_address" value={form.pickup_address ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Endereço de Destino
              <input name="destination_address" value={form.destination_address ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-lg border p-4 space-y-4">
          <h2 className="font-medium">Datas e Horários</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Data de Embarque
              <input type="date" name="pickup_date" value={form.pickup_date ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Hora de Embarque
              <input type="time" name="pickup_time" value={form.pickup_time ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Data de Retorno
              <input type="date" name="return_date" value={form.return_date ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Hora de Retorno
              <input type="time" name="return_time" value={form.return_time ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-lg border p-4 space-y-4">
          <h2 className="font-medium">Status e Valor</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">Status
              <select name="status" value={form.status ?? 'pending'} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmada</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </label>
            <label className="text-sm">Valor Total (USD)
              <input type="number" step="0.01" name="total_amount" value={form.total_amount ?? 0} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-lg border p-4 space-y-4 md:col-span-2">
          <h2 className="font-medium">Referências e Pagamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="text-sm">Nº da Reserva
              <input name="reservation_number" value={form.reservation_number ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Ref. da Cotação
              <input name="booking_reference" value={form.booking_reference ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="text-sm">Tipo de Pagamento
              <select name="payment_type" value={form.payment_type ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                <option value="">N/A</option>
                <option value="single">Único</option>
                <option value="partial">Parcial</option>
              </select>
            </label>
            <label className="text-sm">Status de Pagamento
              <select name="payment_status" value={form.payment_status ?? ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                <option value="">N/A</option>
                <option value="paid">Pago</option>
                <option value="partial">Parcial</option>
                <option value="unpaid">Não Pago</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <label className="text-sm">Links de Pagamento (JSON)
              <textarea name="payment_links" value={(form.payment_links as any as string) ?? ''} onChange={handleChange} rows={6} className="mt-1 w-full border rounded px-3 py-2 font-mono text-sm" placeholder='{"link":"https://..."} ou {"first_installment":"...","second_installment":"..."}' />
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}