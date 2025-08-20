"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  DollarSign,
  Mail,
  Phone,
  FileText
} from "lucide-react"

export default function ClientQuotePage() {
  const params = useParams()
  const quoteId = params.id as string
  
  const [quote, setQuote] = useState<any>(null)
  const [status, setStatus] = useState<'viewing' | 'accepting' | 'accepted' | 'rejected'>('viewing')
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    // Aqui você buscaria os dados do orçamento do Supabase
    // Mock data para demonstração
    setQuote({
      id: quoteId,
      customer_name: "João Silva",
      customer_email: "joao@email.com",
      origin: "Aeroporto JFK - Terminal 4",
      destination: "Times Square Hotel - Manhattan",
      pickup_date: "2025-01-25",
      pickup_time: "14:30",
      return_date: "2025-01-27",
      return_time: "10:00",
      vehicle_type: "Premium Sedan",
      passengers: 2,
      luggage: 3,
      distance_km: 25,
      base_price: 80,
      price_per_km: 3.20,
      extras: [
        { name: "Wi-Fi durante viagem", price: 8 },
        { name: "Água e bebidas", price: 10 }
      ],
      include_return: true,
      total_amount: 438,
      notes: "Voo internacional - favor aguardar 30 minutos no aeroporto.",
      expires_at: "2025-01-18T14:30:00",
      created_at: "2025-01-11T09:00:00",
      status: "sent"
    })
  }, [quoteId])

  const handleAccept = () => {
    setStatus('accepting')
    // Aqui você atualizaria o status no Supabase
    setTimeout(() => {
      setStatus('accepted')
    }, 1000)
  }

  const handleReject = () => {
    setStatus('rejected')
    // Aqui você atualizaria o status no Supabase
  }

  const isExpired = quote && new Date(quote.expires_at) < new Date()

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando orçamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/img/logo.png" alt="AZ Transfer" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orçamento #{quote.id}</h1>
                <p className="text-gray-600">Transfer Executivo</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-secondary">${quote.total_amount.toFixed(2)}</div>
              <p className="text-sm text-gray-600">
                Válido até {new Date(quote.expires_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Banner */}
        {status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-green-800 font-medium">Orçamento Aceito!</h3>
                <p className="text-green-700 text-sm">Entraremos em contato em breve para confirmar os detalhes.</p>
              </div>
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">Orçamento Rejeitado</h3>
                <p className="text-red-700 text-sm">Obrigado pelo interesse. Entre em contato para novos orçamentos.</p>
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="text-yellow-800 font-medium">Orçamento Expirado</h3>
                <p className="text-yellow-700 text-sm">Este orçamento expirou. Entre em contato conosco para um novo orçamento.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes do Trajeto */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trajeto */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">Trajeto</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Origem</p>
                    <p className="text-gray-600">{quote.origin}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Destino</p>
                    <p className="text-gray-600">{quote.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data e Horário */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">Data e Horário</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium text-gray-900 mb-2">Ida</p>
                  <p className="text-gray-600">
                    {new Date(quote.pickup_date).toLocaleDateString('pt-BR')} às {quote.pickup_time}
                  </p>
                </div>
                
                {quote.include_return && (
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Volta</p>
                    <p className="text-gray-600">
                      {new Date(quote.return_date).toLocaleDateString('pt-BR')} às {quote.return_time}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Veículo */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-5 w-5 text-secondary" />
                <h2 className="text-xl font-semibold text-gray-900">Veículo</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium text-gray-900">Tipo</p>
                  <p className="text-gray-600">{quote.vehicle_type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Passageiros</p>
                  <p className="text-gray-600">{quote.passengers} pessoas</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bagagens</p>
                  <p className="text-gray-600">{quote.luggage} grandes</p>
                </div>
              </div>
            </div>

            {/* Observações */}
            {quote.notes && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-secondary" />
                  <h2 className="text-xl font-semibold text-gray-900">Observações</h2>
                </div>
                <p className="text-gray-600">{quote.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Resumo e Ações */}
          <div className="space-y-6">
            {/* Resumo do Preço */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preço base:</span>
                  <span className="font-medium">${quote.base_price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distância ({quote.distance_km}km):</span>
                  <span className="font-medium">${(quote.distance_km * quote.price_per_km).toFixed(2)}</span>
                </div>
                
                {quote.include_return && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Viagem de volta:</span>
                    <span className="font-medium">${(quote.base_price + (quote.distance_km * quote.price_per_km)).toFixed(2)}</span>
                  </div>
                )}
                
                {quote.extras.length > 0 && (
                  <>
                    <hr className="my-2" />
                    <p className="text-sm font-medium text-gray-900">Extras:</p>
                    {quote.extras.map((extra: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{extra.name}:</span>
                        <span className="font-medium">${extra.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}
                
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-secondary">${quote.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            {!isExpired && status === 'viewing' && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Aceitar Orçamento</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={handleAccept}
                    className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Aceitar Orçamento
                  </button>
                  
                  <button
                    onClick={handleReject}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-5 w-5" />
                    Rejeitar
                  </button>
                </div>
              </div>
            )}

            {status === 'accepting' && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Processando...</p>
                </div>
              </div>
            )}

            {/* Contato */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contato</h2>
              
              <div className="space-y-3">
                <a href="mailto:contato@aztransfer.com" className="flex items-center gap-3 text-gray-600 hover:text-secondary">
                  <Mail className="h-5 w-5" />
                  contato@aztransfer.com
                </a>
                <a href="tel:+13478487765" className="flex items-center gap-3 text-gray-600 hover:text-secondary">
                  <Phone className="h-5 w-5" />
                  +1 (347) 848-7765
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

