"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Calendar, MapPin, Users, Car, Clock, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { useBooking } from "@/hooks/useBookings"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const { data: booking, isLoading, error } = useBooking(bookingId || "")
  
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Auto mostrar detalhes após 1 segundo
    setTimeout(() => setShowDetails(true), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processando sua reserva...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Reserva não encontrada</h1>
          <p className="text-gray-600 mb-4">
            Não foi possível localizar os detalhes da sua reserva.
          </p>
          <a
            href="/booking"
            className="bg-[#E95440] text-white px-6 py-2 rounded-md hover:bg-[#d64a36] transition-colors"
          >
            Nova Reserva
          </a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="relative w-[100px] h-8">
            <Image
              src="/img/logo.png"
              alt="AZ Transfer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-[#E95440]">Home</a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">Services</a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">Fleet</a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">About</a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">Contact</a>
          </nav>
          <div>
            <a
              href="/booking"
              className="bg-[#E95440] text-white px-4 py-2 rounded-md hover:bg-[#d64a36] transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </header>

      {/* Confirmation Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserva Confirmada!</h1>
          <p className="text-gray-600 mb-4">
            Sua reserva foi processada com sucesso. Você receberá um email de confirmação em breve.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-green-800 font-medium">
              Número da Reserva: <span className="font-mono">BK-{booking.id.slice(-6).toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className={`transition-all duration-500 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#E95440] text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Detalhes da Reserva</h2>
                  <p className="text-[#E95440]-100 mt-1">
                    Status: <span className="font-medium capitalize">{booking.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#E95440]-100 text-sm">Valor Total</p>
                  <p className="text-2xl font-bold">£ {booking.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Journey Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#E95440]" />
                    Informações da Viagem
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Origem</p>
                        <p className="text-gray-600">{booking.pickup_location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Destino</p>
                        <p className="text-gray-600">{booking.dropoff_location}</p>
                      </div>
                    </div>

                    <div className="flex items-center pt-2">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Data e Hora</p>
                        <p className="text-gray-600">
                          {new Date(booking.pickup_date).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long',
                            day: 'numeric'
                          })} às {booking.pickup_time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Passageiros</p>
                        <p className="text-gray-600">{booking.passengers} passageiro{booking.passengers > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bagagem</p>
                        <p className="text-gray-600">{booking.luggage} volume{booking.luggage > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {booking.flight_number && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Número do Voo</p>
                          <p className="text-gray-600">{booking.flight_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle & Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car className="w-5 h-5 mr-2 text-[#E95440]" />
                    Veículo & Contato
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Vehicle */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                          <Car className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.vehicle_id ? `Veículo ${booking.vehicle_id.slice(-4)}` : 'Business Class'}
                          </p>
                          <p className="text-sm text-gray-600">Mercedes-Benz E-Class ou similar</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Informações de Contato</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">+44 20 7123 4567</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">support@aztransfer.com</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Status do Pagamento</h4>
                      <p className="text-sm text-blue-800 capitalize">
                        {booking.payment_status === 'paid' ? 'Pago' : 
                         booking.payment_status === 'unpaid' ? 'Pendente' : 
                         booking.payment_status}
                      </p>
                      {booking.payment_method && (
                        <p className="text-sm text-blue-700 mt-1">
                          Método: {booking.payment_method}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {booking.notes && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Observações</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              Imprimir Confirmação
            </button>
            <a
              href="/booking"
              className="bg-[#E95440] text-white px-6 py-3 rounded-md hover:bg-[#d64a36] transition-colors"
            >
              Nova Reserva
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Em caso de dúvidas, entre em contato conosco através do telefone +44 20 7123 4567 ou email support@aztransfer.com
          </p>
        </div>
      </div>
    </main>
  )
}
