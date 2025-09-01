'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Quote {
  booking_reference?: string
  data_emissao?: string
  valor_total?: string
  nome_cliente?: string
  client_name?: string
  telefone_cliente?: string
  client_phone?: string
  email_cliente?: string
  client_email?: string
  qtd_passageiros?: string
  passengers?: string
  qtd_bagagens?: string
  luggage?: string
  bagagens_grandes?: string
  large_luggage?: string
  bagagens_pequenas?: string
  small_luggage?: string
  veiculo?: string
  vehicle_type?: string
  origem?: string
  origin?: string
  data_ida?: string
  pickup_date?: string
  horario?: string
  pickup_time?: string
  numero_voo?: string
  flight_number?: string
  destino?: string
  destination?: string
  tipo_trajeto?: string
  trip_type?: string
  volta?: string
  return_date?: string
  extras?: string[]
  additional_services?: string[]
  preco_base?: string
  base_price?: string
  valor_extras?: string
  extras_price?: string
  validade?: string
  validity?: string
  service_hours?: string
  airline?: string
}

export default function QuotePreview() {
  const searchParams = useSearchParams()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const quoteData = searchParams.get('data')
      if (quoteData) {
        const parsedQuote = JSON.parse(decodeURIComponent(quoteData))
        setQuote(parsedQuote)
      } else {
        // Dados de exemplo para teste
        setQuote({
          booking_reference: 'AZ0005000NYC',
          data_emissao: 'Sat, 12 de Jul de 2025 02:30 PM',
          valor_total: 'U$ 300.00',
          nome_cliente: 'Mayssa Ferreira Costa',
          telefone_cliente: '+1 347 848-7765',
          email_cliente: 'mayssacosta16@gmail.com',
          qtd_passageiros: '2',
          bagagens_grandes: '1',
          bagagens_pequenas: '2',
          veiculo: 'SUV Premium',
          origem: 'JFK Airport - Terminal 4',
          data_ida: '12/07/2025',
          horario: '14:30',
          numero_voo: 'AA1234',
          airline: 'American Airlines',
          destino: 'Manhattan Hotel',
          tipo_trajeto: 'One-way',
          extras: ['Child Seat', 'Meet & Greet'],
          preco_base: 'U$ 250.00',
          valor_extras: 'U$ 50.00',
          validade: '48 hours'
        })
      }
      setLoading(false)
    } catch (err) {
      setError('Erro ao carregar dados do orçamento')
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  if (!quote) {
    return <div>Nenhum dado de orçamento encontrado</div>
  }

  return (
    <>
      <style jsx>{`
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
          color: #2a2a2a;
        }
        .voucher {
          background: #ffffff;
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header-top img.logo {
          max-height: 60px;
        }
        .header-top a.instagram {
          text-decoration: none;
        }
        .header-top img.instagram-icon {
          width: 30px;
          height: 30px;
        }
        h1 {
          font-size: 22px;
          color: #db4038;
          border-bottom: 2px solid #db4038;
          padding-bottom: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        h2 {
          font-size: 18px;
          color: #db4038;
          margin-top: 20px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        p {
          margin: 4px 0;
          font-size: 14px;
        }
        .label {
          font-weight: bold;
          color: #db4038;
        }
        .value {
          color: #000;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #444;
          margin-top: 25px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        .total {
          font-size: 16px;
          font-weight: bold;
          color: #db4038;
        }
        .important-box {
          background: #db4038;
          color: #fff;
          padding: 15px;
          border-radius: 6px;
          margin-top: 10px;
        }
        .important-box ul {
          margin: 8px 0 0 15px;
        }
      `}</style>
      <div className="voucher">
        <div className="header-top">
          <img src="168f2f96-96fb-4f79-a0a2-cbd7929ea8a9.png" alt="AZ Transfer Logo" className="logo" />
          <a href="https://instagram.com/aztransfer" target="_blank" className="instagram">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="instagram-icon" />
          </a>
        </div>

        <h1>TRANSFER QUOTE</h1>

        <div className="section">
          <h2>Booking Information</h2>
          <p><span className="label">Booking Reference:</span> <span className="value">{quote.booking_reference || 'AZ0005000NYC'}</span></p>
          <p><span className="label">Issue Date:</span> <span className="value">{quote.data_emissao || 'Sat, 12 de Jul de 2025 02:30 PM'}</span></p>
          <p><span className="label">Receive:</span> <span className="value">{quote.valor_total || 'U$ 300.00'} in cash</span></p>
        </div>

        <div className="section">
          <h2>Traveller Information</h2>
          <p><span className="label">Full Name *:</span> <span className="value">{quote.nome_cliente || quote.client_name || 'Mayssa Ferreira Costa'}</span></p>
          <p><span className="label">Phone *:</span> <span className="value">{quote.telefone_cliente || quote.client_phone || '+1 347 848-7765'}</span></p>
          <p><span className="label">Email *:</span> <span className="value">{quote.email_cliente || quote.client_email || 'mayssacosta16@gmail.com'}</span></p>
        </div>

        <div className="section">
          <h2>Vehicle and Services</h2>
          <p><span className="label">Vehicle Type *:</span> <span className="value">{quote.veiculo || quote.vehicle_type || 'Selecione um veículo'}</span></p>
          <p><span className="label">Number of Passengers:</span> <span className="value">{quote.qtd_passageiros || quote.passengers || '1'}</span></p>
          <p><span className="label">Large Luggage:</span> <span className="value">{quote.bagagens_grandes || '0'}</span></p>
          <p><span className="label">Small Luggage:</span> <span className="value">{quote.bagagens_pequenas || '0'}</span></p>
        </div>

        <div className="section">
          <h2>Pick-up Information</h2>
          <p><span className="label">Origin Address *:</span> <span className="value">{quote.origem || quote.origin || 'Casa'}</span></p>
          <p><span className="label">Travel Date *:</span> <span className="value">{quote.data_ida || quote.pickup_date || 'dd/mm/aaaa'}</span></p>
          <p><span className="label">Time *:</span> <span className="value">{quote.horario || 'HH:MM'}</span></p>
          {(quote.numero_voo || quote.flight_number) && (
            <p><span className="label">Flight Number:</span> <span className="value">{quote.numero_voo || quote.flight_number}</span></p>
          )}
          {quote.airline && (
            <p><span className="label">Airline:</span> <span className="value">{quote.airline}</span></p>
          )}
        </div>

        <div className="section">
          <h2>Drop-off Information</h2>
          <p><span className="label">Destination Address *:</span> <span className="value">{quote.destino || quote.destination || 'Digite o endereço de destino...'}</span></p>
        </div>

        <div className="section">
          <h2>Trip Type</h2>
          <p><span className="label">Service Type:</span> <span className="value">{quote.tipo_trajeto || quote.trip_type || 'One-way'}</span></p>
          {(quote.volta || quote.return_date) && (
            <p><span className="label">Return Date/Time:</span> <span className="value">{quote.volta || quote.return_date}</span></p>
          )}
          {quote.service_hours && (
            <p><span className="label">Service Hours:</span> <span className="value">{quote.service_hours}</span></p>
          )}
        </div>

        <div className="section">
          <h2>Pricing Details</h2>
          <p><span className="label">Base Price:</span> <span className="value">{quote.preco_base || quote.base_price || 'U$ 250.00'}</span></p>
          {(quote.valor_extras || quote.extras_price) && (
            <p><span className="label">Additional Services:</span> <span className="value">{quote.valor_extras || quote.extras_price}</span></p>
          )}
          <p><span className="label">Total Amount:</span> <span className="value">{quote.valor_total || 'U$ 300.00'}</span></p>
        </div>



        {(quote.extras || quote.additional_services) && (
          <div className="section">
            <h2>Additional Services</h2>
            {quote.extras && Array.isArray(quote.extras) ? (
              <ul>
                {quote.extras.map((extra, index) => (
                  <li key={index}>{extra}</li>
                ))}
              </ul>
            ) : quote.additional_services && Array.isArray(quote.additional_services) ? (
              <ul>
                {quote.additional_services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            ) : (
              <p><span className="value">{quote.extras || quote.additional_services}</span></p>
            )}
          </div>
        )}

        <div className="section">
          <h2>Quote Validity</h2>
          <p><span className="label">Valid for:</span> <span className="value">{quote.validade || quote.validity || '48 hours'}</span></p>
        </div>

        <div className="section">
          <h2>Cancellation Policy</h2>
          <p><strong>Free Cancellation:</strong> We offer free cancellation for reservations made, provided the cancellation is made at least 48 hours in advance.</p>
          <p><strong>Cancellation Fee After 48 Hours:</strong> In the event of a cancellation occurring after the 48-hour period, a cancellation fee of US$50 will be applied.</p>

          <div className="important-box">
            <p><strong>IMPORTANT:</strong></p>
            <ul>
              <li>We track your flight until it arrives.</li>
              <li>Driver will establish contact via WhatsApp with you.</li>
              <li>There is free Wi-Fi in the terminal and you can make a call at the Welcome Center counter.</li>
              <li>Please use any of the telephone numbers shown below: +1 347 848-7765 or +1 347 313-2297.</li>
            </ul>
            <ul>
              <li>Nós rastreamos seu voo até que ele chegue.</li>
              <li>O motorista entrará em contato via WhatsApp com você.</li>
              <li>Há Wi-Fi gratuito no terminal e você pode fazer ligação no balcão do centro de Boas-Vindas.</li>
              <li>Por favor, use um dos números de telefone mostrados a seguir: +1 347 848-7765 ou +1 347 313-2297.</li>
            </ul>
          </div>
        </div>

        <div className="footer">
          <p>📧 info@aztransferny.com | 📞 +1 347 848-7765 | ☎ +1 347 313-2297</p>
        </div>
      </div>
    </>
  )
}