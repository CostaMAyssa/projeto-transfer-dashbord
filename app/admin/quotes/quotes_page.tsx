'use client';

import React from 'react';

interface QuotePageProps {
  quote?: {
    id: string;
    booking_reference: string;
    customer_name: string;
    customer_phone: string;
    total_price: number;
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    pickup_time: string;
    passengers: number;
    baggage: string;
    vehicle_category_id: string;
    flight_number?: string;
  };
}

export default function QuotePage({ quote }: QuotePageProps) {
  // Dados de exemplo se não houver quote fornecido
  const defaultQuote = {
    id: 'AZ0005000NYC',
    booking_reference: 'AZ0005000NYC',
    customer_name: 'Daniela Silva',
    customer_phone: '+1 347 848-7765',
    total_price: 300,
    pickup_location: 'Courtyard New York Manhattan/Central Park - 1717 Broadway, NY 10019',
    dropoff_location: 'John F. Kennedy International Airport (JFK)',
    pickup_date: 'Sat, 12 de Jul de 2025',
    pickup_time: '02:30 PM',
    passengers: 2,
    baggage: '03M + 03S',
    vehicle_category_id: 'SUV Lux',
    flight_number: 'DL1995'
  };

  const quoteData = quote || defaultQuote;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <img 
              src="/168f2f96-96fb-4f79-a0a2-cbd7929ea8a9.png" 
              alt="AZ Transfer Logo" 
              className="h-16"
            />
            <a 
              href="https://instagram.com/aztransfer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700"
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" 
                alt="Instagram" 
                className="w-8 h-8"
              />
            </a>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-red-600 text-center border-b-2 border-red-600 pb-2 mb-8">
            QUOTES TRANSFER
          </h1>

          {/* Booking Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-gray-300 pb-2">
              Booking Information
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold text-red-600">Booking Reference:</span> <span className="text-gray-800">{quoteData.booking_reference}</span></p>
              <p><span className="font-semibold text-red-600">Issue Date:</span> <span className="text-gray-800">{quoteData.pickup_date} {quoteData.pickup_time}</span></p>
              <p><span className="font-semibold text-red-600">Receive:</span> <span className="text-gray-800">U$ {quoteData.total_price.toFixed(2)} in cash</span></p>
            </div>
          </div>

          {/* Traveller Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-gray-300 pb-2">
              Traveller Information
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold text-red-600">Passenger Name:</span> <span className="text-gray-800">{quoteData.customer_name}</span></p>
              <p><span className="font-semibold text-red-600">Contact:</span> <span className="text-gray-800">{quoteData.customer_phone}</span></p>
            </div>
          </div>

          {/* Carrier Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-gray-300 pb-2">
              Carrier Details
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold text-red-600">N° Passengers:</span> <span className="text-gray-800">{quoteData.passengers.toString().padStart(2, '0')}</span></p>
              <p><span className="font-semibold text-red-600">Baggage:</span> <span className="text-gray-800">{quoteData.baggage}</span></p>
              <p><span className="font-semibold text-red-600">Vehicle:</span> <span className="text-gray-800">{quoteData.vehicle_category_id}</span></p>
            </div>
          </div>

          {/* Pick-up Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-gray-300 pb-2">
              Pick-up Information
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold text-red-600">From:</span> <span className="text-gray-800">{quoteData.pickup_location}</span></p>
              <p><span className="font-semibold text-red-600">Date/Time:</span> <span className="text-gray-800">{quoteData.pickup_date} {quoteData.pickup_time}</span></p>
              {quoteData.flight_number && (
                <p><span className="font-semibold text-red-600">Flight number:</span> <span className="text-gray-800">{quoteData.flight_number}</span></p>
              )}
            </div>
          </div>

          {/* Drop-off Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-gray-300 pb-2">
              Drop-off Information
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold text-red-600">To:</span> <span className="text-gray-800">{quoteData.dropoff_location}</span></p>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-gray-300 pb-2">
              Cancellation Policy
            </h2>
            <div className="space-y-4">
              <p><strong>Free Cancellation:</strong> We offer free cancellation for reservations made, provided the cancellation is made at least 48 hours in advance.</p>
              <p><strong>Cancellation Fee After 48 Hours:</strong> In the event of a cancellation occurring after the 48-hour period, a cancellation fee of US$50 will be applied.</p>
              
              <div className="bg-red-600 text-white p-4 rounded-lg">
                <p className="font-semibold mb-2">IMPORTANT:</p>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>We track your flight until it arrives.</li>
                  <li>Driver will establish contact via WhatsApp with you.</li>
                  <li>There is free Wi-Fi in the terminal and you can make a call at the Welcome Center counter.</li>
                  <li>Please use any of the telephone numbers shown below: +1 347 848-7765 or +1 347 313-2297.</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nós rastreamos seu voo até que ele chegue.</li>
                  <li>O motorista entrará em contato via WhatsApp com você.</li>
                  <li>Há Wi-Fi gratuito no terminal e você pode fazer ligação no balcão do centro de Boas-Vindas.</li>
                  <li>Por favor, use um dos números de telefone mostrados a seguir: +1 347 848-7765 ou +1 347 313-2297.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-300">
            <p>📧 info@aztransferny.com | 📞 +1 347 848-7765 | ☎ +1 347 313-2297</p>
          </div>
        </div>
      </div>
    </div>
  );
}
