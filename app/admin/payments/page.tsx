"use client"

import { useState, useEffect } from "react"
import { useQuotes } from "@/hooks/useQuotes"
import { 
  CreditCard, 
  DollarSign,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  QrCode,
  Mail,
  Search
} from "lucide-react"

export default function PaymentsPage() {
  const { quotes, loading: quotesLoading, error: quotesError } = useQuotes()
  const [selectedQuote, setSelectedQuote] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentType, setPaymentType] = useState("full") // "full" or "partial"
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("") // "success", "error", ""
  const [saveCard, setSaveCard] = useState(false)
  const [showVoucher, setShowVoucher] = useState(false)

  // Filtrar apenas orçamentos com status 'sent' ou 'accepted' que podem ser pagos
  const payableQuotes = quotes.filter(quote => 
    quote.status === 'sent' || quote.status === 'accepted'
  )

  const filteredQuotes = searchTerm ? payableQuotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase()
    return (
      quote.customer_name?.toLowerCase().includes(searchLower) ||
      quote.pickup_address?.toLowerCase().includes(searchLower) ||
      quote.destination_address?.toLowerCase().includes(searchLower) ||
      quote.booking_reference?.toLowerCase().includes(searchLower) ||
      quote.id.toString().includes(searchTerm)
    )
  }) : payableQuotes

  // Dados do orçamento selecionado
  const orderSummary = selectedQuote ? {
    serviceName: `${selectedQuote.pickup_address} → ${selectedQuote.destination_address}`,
    totalAmount: Number(selectedQuote.total_amount) || 0,
    bookingDate: selectedQuote.created_at ? new Date(selectedQuote.created_at).toISOString().split('T')[0] : '',
    serviceDate: selectedQuote.pickup_date || '',
    bookingId: selectedQuote.booking_reference || '',
    customerName: selectedQuote.customer_name || ''
  } : null

  const partialPaymentDetails = orderSummary ? {
    firstInstallment: orderSummary.totalAmount * 0.5,
    secondInstallment: orderSummary.totalAmount * 0.5,
    secondPaymentDate: orderSummary.serviceDate
  } : null

  const handlePayment = async () => {
    if (!orderSummary || !partialPaymentDetails) return
    
    setIsProcessing(true)
    setPaymentStatus("")
    
    // Simular processamento do pagamento
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentStatus("success")
      setShowVoucher(true)
    }, 3000)
  }

  const downloadVoucher = () => {
    if (!orderSummary || !partialPaymentDetails) return
    
    // Implementar download do voucher PDF
    console.log("Downloading voucher...")
  }

  const sendVoucherEmail = () => {
    // Implementar envio por email
    console.log("Sending voucher by email...")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Pagamento</h1>
        <p className="text-text-gray">Complete seu pagamento de forma segura</p>
      </div>

      {/* Busca de Orçamento */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2 text-secondary" />
          Buscar Orçamento
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          
          {searchTerm && (
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    onClick={() => {
                      setSelectedQuote(quote)
                      setSearchTerm('')
                    }}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                    <p className="font-medium text-text-dark">#{quote.booking_reference} - {quote.customer_name}</p>
                    <p className="text-sm text-text-gray">{quote.pickup_address} → {quote.destination_address}</p>
                    <p className="text-xs text-text-gray">Serviço: {new Date(quote.pickup_date || '').toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-secondary">R$ {Number(quote.total_amount || 0).toFixed(2)}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-text-gray">
                  Nenhum orçamento encontrado
                </div>
              )}
            </div>
          )}
          
          {selectedQuote && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">Orçamento Selecionado:</p>
              <p className="text-blue-800">#{selectedQuote.booking_reference} - {selectedQuote.customer_name}</p>
              <p className="text-sm text-blue-600">{selectedQuote.pickup_address} → {selectedQuote.destination_address}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumo do Pedido */}
        {selectedQuote && orderSummary && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-secondary" />
            Resumo do Pedido
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-text-gray">Cliente:</span>
              <span className="font-medium text-text-dark">{orderSummary.customerName}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-text-gray">Serviço:</span>
              <span className="font-medium text-text-dark">{orderSummary.serviceName}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-text-gray">Valor Total:</span>
              <span className="font-bold text-xl text-secondary">R$ {orderSummary.totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-text-gray">Data da Reserva:</span>
              <span className="text-text-dark">{new Date(orderSummary.bookingDate).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-text-gray">Data do Serviço:</span>
              <span className="text-text-dark flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(orderSummary.serviceDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        )}

        {/* Opções de Pagamento */}
        {selectedQuote && orderSummary && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-4">Forma de Pagamento</h2>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentType === "full"}
                onChange={(e) => setPaymentType(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">💰</span>
                <div>
                  <div className="font-medium text-text-dark">Pagamento total agora</div>
                  <div className="text-sm text-text-gray">R$ {orderSummary.totalAmount.toFixed(2)} à vista</div>
                </div>
              </div>
            </label>
            
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentType"
                value="partial"
                checked={paymentType === "partial"}
                onChange={(e) => setPaymentType(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">💳</span>
                <div>
                  <div className="font-medium text-text-dark">Pagamento parcial</div>
                  <div className="text-sm text-text-gray">50% agora + 50% no dia do serviço</div>
                </div>
              </div>
            </label>
          </div>

          {/* Detalhamento do Pagamento Parcial */}
          {paymentType === "partial" && partialPaymentDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-text-dark mb-3">Detalhamento do Pagamento Parcial</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-gray">1ª Parcela (Agora):</span>
                  <span className="font-bold text-green-600">R$ {partialPaymentDetails.firstInstallment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-gray">2ª Parcela ({new Date(partialPaymentDetails.secondPaymentDate).toLocaleDateString('pt-BR')}):</span>
                  <span className="font-medium text-text-dark">R$ {partialPaymentDetails.secondInstallment.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Formulário de Pagamento */}
      {selectedQuote && (
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-secondary" />
          Dados do Cartão
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-dark mb-2">Número do Cartão</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">Data de Validade</label>
            <input
              type="text"
              placeholder="MM/AA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">CVV</label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-dark mb-2">Nome no Cartão</label>
            <input
              type="text"
              placeholder="João Silva"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          
          {paymentType === "partial" && (
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-text-gray">Salvar cartão para a segunda parcela</span>
              </label>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Botão de Pagamento */}
      {selectedQuote && (
        <div className="text-center">
          {!showVoucher ? (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pagar {paymentType === "partial" ? `R$ ${partialPaymentDetails?.firstInstallment.toFixed(2)}` : `R$ ${orderSummary?.totalAmount.toFixed(2)}`}
                </>
              )}
            </button>
          ) : null}
        </div>
      )}

      {/* Feedback de Status */}
      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Pagamento Realizado com Sucesso!</h3>
          <p className="text-green-700 mb-4">
            {paymentType === "partial" 
              ? `Primeira parcela de R$ ${partialPaymentDetails?.firstInstallment.toFixed(2)} processada. A segunda parcela será cobrada em ${new Date(partialPaymentDetails?.secondPaymentDate || '').toLocaleDateString('pt-BR')}.`
              : `Pagamento de R$ ${orderSummary?.totalAmount.toFixed(2)} processado com sucesso.`
            }
          </p>
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro no Pagamento</h3>
          <p className="text-red-700 mb-4">Houve um problema ao processar seu pagamento. Tente novamente.</p>
          <button
            onClick={() => setPaymentStatus("")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Voucher */}
      {showVoucher && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
            <QrCode className="h-5 w-5 mr-2 text-secondary" />
            Seu Voucher
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center mb-4">
            <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-sm text-text-gray mb-2">Código da Reserva: {orderSummary?.bookingId}</p>
            <p className="font-medium text-text-dark">{orderSummary?.serviceName}</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={downloadVoucher}
              className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </button>
            
            <button
              onClick={sendVoucherEmail}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar por Email
            </button>
          </div>
        </div>
      )}
    </div>
  )
}