"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export const dynamic = "force-dynamic"

export default function QuotePreviewPage() {
  const searchParams = useSearchParams()
  const [quote, setQuote] = useState<any>(null)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data))
        setQuote(decoded)
      } catch (error) {
        console.error('Erro ao decodificar dados:', error)
        setQuote({ error: 'invalid' })
      }
    } else {
      setQuote({ error: 'missing' })
    }
  }, [searchParams])

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
          <img src="/img/logo.png" alt="AZ Transfer Logo" className="logo" />
          <a href="https://instagram.com/aztransfer" target="_blank" className="instagram">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="instagram-icon" />
          </a>
        </div>

        <h1>Voucher / Booking Confirmation</h1>

        <div className="section">
          <h2>Booking Information</h2>
          <p><span className="label">Booking Reference:</span> <span className="value">{quote.booking_reference || 'DRFT-' + Date.now().toString().slice(-6)}</span></p>
          <p><span className="label">Issue Date:</span> <span className="value">{quote.data_emissao || new Date().toLocaleDateString('pt-BR')}</span></p>
          <p><span className="label">Receive:</span> <span className="value">{quote.valor_total || '$0.00'} in cash</span></p>
        </div>

        <div className="section">
          <h2>Traveller Information</h2>
          <p><span className="label">Passenger Name:</span> <span className="value">{quote.nome_cliente || quote.client_name || 'Nome do Cliente'}</span></p>
          <p><span className="label">Contact:</span> <span className="value">{quote.telefone_cliente || quote.client_phone || '+1 347 848-7765'}</span></p>
        </div>

        <div className="section">
          <h2>Carrier Details</h2>
          <p><span className="label">N° Passengers:</span> <span className="value">{quote.qtd_passageiros || quote.passengers || '01'}</span></p>
          <p><span className="label">Baggage:</span> <span className="value">{quote.qtd_bagagens || quote.luggage || '01'}M + 00S</span></p>
          <p><span className="label">Vehicle:</span> <span className="value">{quote.veiculo || quote.vehicle_type || 'SUV Lux'}</span></p>
        </div>

        <div className="section">
          <h2>Pick-up Information</h2>
          <p><span className="label">From:</span> <span className="value">{quote.origem || quote.origin || 'Local de origem'}</span></p>
          <p><span className="label">Date/Time:</span> <span className="value">{quote.data_ida || quote.pickup_date ? new Date(quote.data_ida || quote.pickup_date).toLocaleDateString('pt-BR') : 'Data não informada'} {quote.hora_ida || quote.pickup_time || ''}</span></p>
          <p><span className="label">Flight number:</span> <span className="value">{quote.numero_voo || quote.flight_number || 'N/A'}</span></p>
        </div>

        <div className="section">
          <h2>Drop-off Information</h2>
          <p><span className="label">To:</span> <span className="value">{quote.destino || quote.destination || 'Local de destino'}</span></p>
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