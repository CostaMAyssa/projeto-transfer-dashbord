"use client"

import { useState, useEffect } from "react"
import { useQuotes } from "@/hooks/useQuotes"
import { supabase } from "@/lib/supabase"
import { 
  CreditCard, 
  DollarSign,
  Calendar,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  QrCode,
  Search,
  Shield,
  Lock,
  Copy
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
  const [stripeLoading, setStripeLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")
  const [paymentLinks, setPaymentLinks] = useState<{firstInstallment?: string, secondInstallment?: string}>({})
  const [firstInstallmentPercentage, setFirstInstallmentPercentage] = useState(50)

  // Estilos para o slider
  const sliderStyles = `
    .slider::-webkit-slider-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #10b981;
      cursor: pointer;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #10b981;
      cursor: pointer;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .slider::-webkit-slider-track {
      height: 8px;
      background: linear-gradient(to right, #10b981 0%, #10b981 ${firstInstallmentPercentage}%, #e5e7eb ${firstInstallmentPercentage}%, #e5e7eb 100%);
      border-radius: 4px;
    }
  `

  // Filtrar orçamentos que podem ser pagos (incluindo mais status)
  const payableQuotes = quotes.filter(quote => 
    ['draft', 'sent', 'accepted', 'pending'].includes(quote.status)
  )
  
  // Debug temporário
  console.log('Total quotes loaded:', quotes.length)
  console.log('Payable quotes:', payableQuotes.length)
  console.log('Quotes with Mayssa:', quotes.filter(q => q.customer_name?.toLowerCase().includes('mayssa')).length)
  console.log('All customer names:', quotes.map(q => q.customer_name).filter(Boolean))

  const filteredQuotes = searchTerm ? payableQuotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase().trim()
    return (
      quote.customer_name?.toLowerCase().trim().includes(searchLower) ||
      quote.pickup_address?.toLowerCase().trim().includes(searchLower) ||
      quote.destination_address?.toLowerCase().trim().includes(searchLower) ||
      quote.booking_reference?.toLowerCase().trim().includes(searchLower) ||
      quote.id.toString().includes(searchTerm.trim())
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
    firstInstallment: orderSummary.totalAmount * (firstInstallmentPercentage / 100),
    secondInstallment: orderSummary.totalAmount * ((100 - firstInstallmentPercentage) / 100),
    firstPaymentDate: new Date().toISOString().split('T')[0],
    secondPaymentDate: selectedQuote.pickup_date
  } : null

  const generatePaymentLink = async () => {
    if (!orderSummary || !partialPaymentDetails) {
      console.log('❌ generatePaymentLink: Missing orderSummary or partialPaymentDetails')
      return
    }
    
    console.log('🚀 generatePaymentLink: Starting payment generation')
    console.log('📊 Payment data:', {
      selectedQuote: selectedQuote?.id,
      paymentType,
      firstInstallmentPercentage,
      orderSummary,
      partialPaymentDetails
    })
    
    setIsProcessing(true)
    setStripeLoading(true)
    setPaymentStatus("")
    
    try {
      console.log('🔐 Getting Supabase session...')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('✅ Session obtained:', session ? 'Valid' : 'Invalid')
      
      const requestBody = {
        quoteId: selectedQuote.id,
        paymentType,
        firstInstallmentPercentage,
        customerInfo: {
          name: selectedQuote.customer_name || 'Cliente',
          email: selectedQuote.customer_email || 'cliente@email.com',
          phone: selectedQuote.customer_phone || '+351000000000',
        },
      }
      
      console.log('📤 Request body:', requestBody)
      
      console.log('🌐 Making API request to /api/supabase/functions/payments')
      const response = await fetch('/api/supabase/functions/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Response status:', response.status)
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Error response body:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('📋 API Response:', result)

      if (result.success) {
         console.log('✅ Payment link generated successfully')
         setPaymentStatus("link_generated")
         if (paymentType === 'full') {
           console.log('💳 Full payment - using checkout URL:', result.clientSecret)
           setGeneratedLink(result.clientSecret)
         } else {
           console.log('📊 Partial payment - storing both links:', result.paymentLinks)
           setPaymentLinks(result.paymentLinks || {})
           setGeneratedLink(result.paymentLinks?.firstInstallment || '')
         }
       } else {
         console.error('❌ API returned error:', result.error)
         throw new Error(result.error || 'Erro desconhecido')
       }
    } catch (error) {
      console.error('💥 Error in generatePaymentLink:', error)
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      setPaymentStatus("error")
    } finally {
      console.log('🏁 generatePaymentLink: Finished')
      setIsProcessing(false)
      setStripeLoading(false)
    }
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
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
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
                      setPaymentStatus('')
                      setGeneratedLink('')
                      setPaymentLinks({})
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
            <div className="bg-white border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-text-dark">Orçamento Selecionado:</p>
              <p className="text-text-dark">#{selectedQuote.booking_reference} - {selectedQuote.customer_name}</p>
              <p className="text-sm text-text-gray">{selectedQuote.pickup_address} → {selectedQuote.destination_address}</p>
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
              <div>
                <div className="font-medium text-text-dark">Pagamento total agora</div>
                <div className="text-sm text-text-gray">R$ {orderSummary.totalAmount.toFixed(2)} à vista</div>
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
              <div>
                <div className="font-medium text-text-dark">Pagamento parcial</div>
                <div className="text-sm text-text-gray">{firstInstallmentPercentage}% agora + {100 - firstInstallmentPercentage}% no dia do serviço</div>
              </div>
            </label>
            
            {paymentType === "partial" && (
               <div className="ml-6 p-4 bg-white rounded-lg border border-border">
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-text-dark mb-2">
                       Percentual da primeira parcela: {firstInstallmentPercentage}%
                     </label>
                     <div className="flex items-center space-x-4">
                       <input
                         type="range"
                         min="10"
                         max="90"
                         step="5"
                         value={firstInstallmentPercentage}
                         onChange={(e) => setFirstInstallmentPercentage(Number(e.target.value))}
                         className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                       />
                       <input
                         type="number"
                         min="10"
                         max="90"
                         step="5"
                         value={firstInstallmentPercentage}
                         onChange={(e) => setFirstInstallmentPercentage(Number(e.target.value))}
                         className="w-16 px-2 py-1 border border-border rounded text-center text-sm"
                       />
                       <span className="text-sm text-text-gray">%</span>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div className="bg-white p-3 rounded border border-border">
                       <div className="font-medium text-secondary">1ª Parcela ({new Date().toLocaleDateString('pt-BR')})</div>
                       <div className="text-lg font-semibold text-text-dark">
                         R$ {partialPaymentDetails?.firstInstallment.toFixed(2)}
                       </div>
                       <div className="text-xs text-text-gray">{firstInstallmentPercentage}% do total</div>
                     </div>
                     <div className="bg-white p-3 rounded border border-border">
                       <div className="font-medium text-secondary">2ª Parcela ({new Date(selectedQuote.pickup_date).toLocaleDateString('pt-BR')})</div>
                       <div className="text-lg font-semibold text-text-dark">
                         R$ {partialPaymentDetails?.secondInstallment.toFixed(2)}
                       </div>
                       <div className="text-xs text-text-gray">{100 - firstInstallmentPercentage}% do total</div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
          </div>


        </div>
        )}
      </div>

      {/* Geração de Link de Pagamento */}
      {selectedQuote && (
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-dark flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-secondary" />
            Link de Pagamento Stripe
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="h-4 w-4 mr-1 text-green-600" />
            <span>Protegido por Stripe</span>
          </div>
        </div>
        
        <div className="bg-white border border-border rounded-lg p-4 mb-4">
          <div className="flex items-center text-sm text-text-gray mb-2">
            <Lock className="h-4 w-4 mr-2 text-green-600" />
            <span>Link de pagamento seguro gerado pelo Stripe</span>
          </div>
          <p className="text-xs text-text-gray">O cliente receberá um link seguro para realizar o pagamento em uma página hospedada pelo Stripe</p>
        </div>
        
        {/* Informações do Link */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Email do Cliente</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                defaultValue={selectedQuote?.customer_email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Valor do Pagamento</label>
              <input
                type="text"
                value={`R$ ${(paymentType === "partial" ? partialPaymentDetails?.firstInstallment : orderSummary?.totalAmount)?.toFixed(2) || '0.00'}`}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
          </div>
          
          {paymentType === "partial" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center text-sm text-yellow-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Pagamento parcial: Será gerado um segundo link para a segunda parcela na data da reserva ({new Date(selectedQuote.pickup_date).toLocaleDateString('pt-BR')})</span>
              </div>
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
              onClick={generatePaymentLink}
              disabled={isProcessing || stripeLoading}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              {isProcessing || stripeLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {stripeLoading ? 'Conectando ao Stripe...' : 'Processando pagamento...'}
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Gerar Link de Pagamento {paymentType === "partial" ? `R$ ${partialPaymentDetails?.firstInstallment.toFixed(2)}` : `R$ ${orderSummary?.totalAmount.toFixed(2)}`}
                </>
              )}
            </button>
          ) : null}
        </div>
      )}



      {/* Feedback de Status */}
      {paymentStatus === "link_generated" && (generatedLink || paymentLinks.firstInstallment) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-center text-green-800 mb-4">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Link de pagamento gerado com sucesso!</span>
          </div>
          
          <div className="space-y-4">
            {paymentType === 'full' ? (
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">Link de Pagamento:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-white text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Pagamento Parcial - Dois Links Gerados</h4>
                  <p className="text-sm text-blue-700">Ambos os links foram criados. Envie o primeiro para pagamento imediato e guarde o segundo para enviar na data da reserva.</p>
                </div>
                
                {paymentLinks.firstInstallment && (
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      1ª Parcela ({firstInstallmentPercentage}%) - Para pagamento imediato:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={paymentLinks.firstInstallment}
                        readOnly
                        className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-white text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(paymentLinks.firstInstallment!)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </button>
                    </div>
                  </div>
                )}
                
                {paymentLinks.secondInstallment && (
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      2ª Parcela ({100 - firstInstallmentPercentage}%) - Para enviar na data da reserva:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={paymentLinks.secondInstallment}
                        readOnly
                        className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-white text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(paymentLinks.secondInstallment!)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Pagamento Realizado com Sucesso!</h3>
          <p className="text-green-700 mb-4">
            {paymentType === "partial" 
              ? `Primeira parcela de R$ ${partialPaymentDetails?.firstInstallment.toFixed(2)} processada. A segunda parcela será cobrada em ${new Date(selectedQuote.pickup_date).toLocaleDateString('pt-BR')}.`
              : `Pagamento de R$ ${orderSummary?.totalAmount.toFixed(2)} processado com sucesso.`
            }
          </p>
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro no Pagamento</h3>
          <p className="text-red-700 mb-4">Houve um problema ao gerar link de pagamento. Tente novamente.</p>
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
            

          </div>
        </div>
      )}


    </div>
  )
}