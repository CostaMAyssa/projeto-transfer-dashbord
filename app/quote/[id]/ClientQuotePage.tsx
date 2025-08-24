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
import { useSearchParams } from "next/navigation"
import { getQuoteByReference } from "@/hooks/useQuotes"

export default function ClientQuotePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const quoteId = params.id as string
  
  const [quote, setQuote] = useState<any>(null)
  const [status, setStatus] = useState<'viewing' | 'accepting' | 'accepted' | 'rejected'>('viewing')
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (quoteId === 'preview') {
      const dataParam = searchParams.get('data')
      if (!dataParam) {
        setQuote({ error: 'missing' })
        return
      }
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam))
        const now = new Date()
        const expiresDays = parsed.validade?.match(/\d+/)?.[0]
        const expiresAt = expiresDays ? new Date(now.getTime() + Number(expiresDays) * 24*60*60*1000) : now
        setQuote({
          id: parsed.booking_reference || 'PREVIEW',
          customer_name: parsed.nome_cliente || '-',
          customer_email: parsed.email_cliente || '-',
          customer_phone: parsed.telefone_cliente || '-',
          origin: parsed.origem || '-',
          destination: parsed.destino || '-',
          pickup_date: parsed.data_ida || '-',
          pickup_time: parsed.hora_ida || '-',
          return_date: parsed.volta?.split(' ')?.[0] || '',
          return_time: parsed.volta?.split(' ')?.[1] || '',
          include_return: !!parsed.volta && parsed.volta !== '—',
          vehicle_type: parsed.veiculo || '-',
          passengers: Number(parsed.qtd_passageiros || 0),
          luggage: Number(parsed.qtd_bagagens || 0),
          base_price: Number(String(parsed.preco_base || '0').replace(/[^0-9.]/g, '')),
          extras: (parsed.extras || []).map((n: string) => ({ name: n, price: 0 })),
          total_amount: Number(String(parsed.valor_total || '0').replace(/[^0-9.]/g, '')),
          notes: '',
          expires_at: expiresAt.toISOString(),
          created_at: now.toISOString(),
          status: 'draft',
          tipo_trajeto: parsed.tipo_trajeto || '-',
          numero_voo: parsed.numero_voo || '-'
        })
      } catch (e) {
        console.error('Erro ao carregar dados de preview:', e)
        setQuote({ error: 'invalid' })
      }
      return
    }

    // Buscar dados reais do orçamento no banco de dados
    const fetchQuote = async () => {
      try {
        const quoteData = await getQuoteByReference(quoteId)
        
        if (quoteData) {
          // Mapear dados do banco para o formato esperado pelo componente
          setQuote({
            id: quoteData.booking_reference,
            customer_name: quoteData.customer_name,
            customer_email: quoteData.customer_email,
            customer_phone: quoteData.customer_phone,
            origin: quoteData.pickup_address,
            destination: quoteData.destination_address,
            pickup_date: quoteData.pickup_date,
            pickup_time: quoteData.pickup_time,
            return_date: quoteData.return_date,
            return_time: quoteData.return_time,
            vehicle_type: quoteData.vehicle_categories?.name || 'Not specified',
            passengers: quoteData.passengers,
            luggage: (quoteData.luggage_large || 0) + (quoteData.luggage_small || 0),
            base_price: quoteData.base_price,
            extras: quoteData.extras || [],
            include_return: quoteData.quote_type === 'round-trip',
            total_amount: quoteData.total_amount,
            notes: quoteData.notes,
            expires_at: quoteData.expires_at,
            created_at: quoteData.created_at,
            status: quoteData.status,
            numero_voo: quoteData.flight_number
          })
        } else {
          setQuote({ error: 'not_found' })
        }
      } catch (error) {
        console.error('Erro ao buscar orçamento:', error)
        setQuote({ error: 'fetch_error' })
      }
    }
    
    fetchQuote()
  }, [quoteId, searchParams])

  if (quote?.error === 'missing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Dados de pré-visualização não encontrados.</p>
      </div>
    )
  }

  if (quote?.error === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Não foi possível carregar o preview do voucher.</p>
      </div>
    )
  }

  if (quote?.error === 'not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Orçamento não encontrado.</p>
      </div>
    )
  }

  if (quote?.error === 'fetch_error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar dados do orçamento. Tente novamente.</p>
      </div>
    )
  }

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

  if (!isClient || !quote) {
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
    <div style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#f8f9fa",
      margin: 0,
      padding: "20px",
      color: "#2a2a2a",
      minHeight: "100vh"
    }}>
      <div style={{
        background: "#ffffff",
        maxWidth: "800px",
        margin: "auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <img 
            src="/images/az-logo.png" 
            alt="AZ Transfer Logo" 
            style={{ maxHeight: "60px" }}
          />
          <a 
            href="https://instagram.com/aztransfer" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
              alt="Instagram" 
              style={{ width: "30px", height: "30px" }}
            />
          </a>
        </div>

        <h1 style={{
          fontSize: "22px",
          color: "#db4038",
          borderBottom: "2px solid #db4038",
          paddingBottom: "8px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Voucher / Booking Confirmation
        </h1>
        {/* Booking Information */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            color: '#db4038',
            marginTop: '20px',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px'
          }}>Booking Information</h2>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Booking Reference:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.id || 'Loading...'}</span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Issue Date:</span>{' '}
            <span style={{ color: '#000' }}>
              {quote?.created_at ? (() => {
                try {
                  return new Date(quote.created_at).toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                } catch {
                  return new Date(quote.created_at).toLocaleDateString()
                }
              })() : 'Loading...'}
            </span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Total Price:</span>{' '}
            <span style={{ color: '#000', fontSize: '16px', fontWeight: 'bold' }}>
              ${quote?.total_amount || '0.00'}
            </span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Status:</span>{' '}
            <span style={{ 
              color: status === 'accepted' ? '#16a34a' : 
                     status === 'rejected' ? '#dc2626' : 
                     isExpired ? '#6b7280' : '#eab308',
              fontWeight: 'bold'
            }}>
              {status === 'accepted' ? 'Accepted' :
               status === 'rejected' ? 'Rejected' :
               isExpired ? 'Expired' :
               'Pending'}
            </span>
          </p>
        </div>

        {/* Traveller Information */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            color: '#db4038',
            marginTop: '20px',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px'
          }}>Traveller Information</h2>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Passenger Name:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.customer_name || 'Not provided'}</span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Contact:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.customer_phone || 'Not provided'}</span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Email:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.customer_email || 'Not provided'}</span>
          </p>
        </div>

        {/* Carrier Details */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            color: '#db4038',
            marginTop: '20px',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px'
          }}>Carrier Details</h2>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>N° Passengers:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.passengers || 'Not specified'}</span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Baggage:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.luggage || 'Not specified'}</span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Vehicle:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.vehicle_type || 'Not specified'}</span>
          </p>
        </div>

        {/* Pick-up Information */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            color: '#db4038',
            marginTop: '20px',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px'
          }}>Pick-up Information</h2>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>From:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.origin || 'Not specified'}</span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>Date/Time:</span>{' '}
            <span style={{ color: '#000' }}>
              {quote?.pickup_date && quote?.pickup_time ? (() => {
                try {
                  return new Date(quote.pickup_date + 'T' + quote.pickup_time).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                } catch {
                  return `${quote.pickup_date} ${quote.pickup_time}`
                }
              })() : 'Not specified'}
            </span>
          </p>
          {quote?.numero_voo && (
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold', color: '#db4038' }}>Flight number:</span>{' '}
              <span style={{ color: '#000' }}>{quote.numero_voo}</span>
            </p>
          )}
        </div>

        {/* Drop-off Information */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            color: '#db4038',
            marginTop: '20px',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px'
          }}>Drop-off Information</h2>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold', color: '#db4038' }}>To:</span>{' '}
            <span style={{ color: '#000' }}>{quote?.destination || 'Not specified'}</span>
          </p>
          {quote?.include_return && quote?.return_date && quote?.return_time && (
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <span style={{ fontWeight: 'bold', color: '#db4038' }}>Return Date/Time:</span>{' '}
              <span style={{ color: '#000' }}>
                {(() => {
                  try {
                    return new Date(quote.return_date + 'T' + quote.return_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  } catch {
                    return `${quote.return_date} ${quote.return_time}`
                  }
                })()}
              </span>
            </p>
          )}
        </div>

        {/* Cancellation Policy */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            color: '#db4038',
            marginTop: '20px',
            marginBottom: '10px',
            borderBottom: '1px solid #ddd',
            paddingBottom: '5px'
          }}>Cancellation Policy</h2>
          <p style={{ margin: '8px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold' }}>Free Cancellation:</span> We offer <span style={{ color: '#dc2626', fontWeight: 'bold' }}>free cancellation</span> for reservations made, provided the cancellation is made at least <span style={{ color: '#dc2626', fontWeight: 'bold' }}>48 hours</span> in advance.
          </p>
          <p style={{ margin: '8px 0', fontSize: '14px' }}>
            <span style={{ fontWeight: 'bold' }}>Cancellation Fee After 48 Hours:</span> In the event of a cancellation occurring after the <span style={{ color: '#dc2626', fontWeight: 'bold' }}>48-hour period</span>, a cancellation fee of <span style={{ color: '#dc2626', fontWeight: 'bold' }}>US$50</span> will be applied.
          </p>

          <div style={{
            background: '#db4038',
            color: '#fff',
            padding: '15px',
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>IMPORTANT:</p>
            <ul style={{ margin: '8px 0 0 15px', paddingLeft: '0' }}>
              <li style={{ marginBottom: '4px' }}>We track your flight until it arrives.</li>
              <li style={{ marginBottom: '4px' }}>Driver will establish contact via WhatsApp with you.</li>
              <li style={{ marginBottom: '4px' }}>There is free Wi-Fi in the terminal and you can make a call at the Welcome Center counter.</li>
              <li style={{ marginBottom: '4px' }}>Please use any of the telephone numbers shown below: <span style={{ fontWeight: 'bold' }}>+1 347 848-7765</span> or <span style={{ fontWeight: 'bold' }}>+1 347 313-2297</span>.</li>
            </ul>
            <ul style={{ margin: '15px 0 0 15px', paddingLeft: '0' }}>
              <li style={{ marginBottom: '4px' }}>Nós rastreamos seu voo até que ele chegue.</li>
              <li style={{ marginBottom: '4px' }}>O motorista entrará em contato via WhatsApp com você.</li>
              <li style={{ marginBottom: '4px' }}>Há Wi-Fi gratuito no terminal e você pode fazer ligação no balcão do centro de Boas-Vindas.</li>
              <li style={{ marginBottom: '4px' }}>Por favor, use um dos números de telefone mostrados a seguir: <span style={{ fontWeight: 'bold' }}>+1 347 848-7765</span> ou <span style={{ fontWeight: 'bold' }}>+1 347 313-2297</span>.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#444',
          marginTop: '25px',
          paddingTop: '15px',
          borderTop: '1px solid #ddd'
        }}>
          <p>📧 info@aztransferny.com | 📞 +1 347 848-7765 | ☎ +1 347 313-2297</p>
        </div>
      </div>
    </div>
  )
}

