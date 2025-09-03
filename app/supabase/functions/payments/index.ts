import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  quoteId: string
  paymentType: 'full' | 'partial'
  firstInstallmentPercentage?: number
  customerInfo: {
    name: string
    email: string
    phone: string
  }
}

interface PaymentResponse {
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  paymentLinks?: {
    firstInstallment?: string
    secondInstallment?: string
  }
  error?: string
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    if (req.method === 'POST') {
      const { quoteId, paymentType, firstInstallmentPercentage, customerInfo }: PaymentRequest = await req.json()
      
      console.log('🚀 [Payment] Função de pagamento iniciada')
      console.log('📋 [Payment] Dados recebidos:', { quoteId, paymentType, customerInfo })

      // Get quote details
      const { data: quote, error: quoteError } = await supabaseClient
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (quoteError || !quote) {
        return new Response(
          JSON.stringify({ success: false, error: 'Quote not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const totalAmount = Math.round(quote.total_amount * 100) // Convert to cents

      if (paymentType === 'full') {
        // Create checkout session for full amount
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Transfer Service - Quote #${quote.id}`,
                description: `Payment for transfer service from ${quote.pickup_location} to ${quote.dropoff_location}`,
              },
              unit_amount: totalAmount,
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: `${req.headers.get('origin') || 'https://yourdomain.com'}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.get('origin') || 'https://yourdomain.com'}/admin/bookings`,
          metadata: {
            quoteId: quoteId,
            paymentType: 'full',
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
          },
          customer_email: customerInfo.email,
        })

        // Save payment record
        const { data: payment, error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            quote_id: quoteId,
            stripe_payment_intent_id: session.id,
            amount: quote.total_amount,
            currency: 'USD',
            status: 'pending',
            payment_type: 'full',
            customer_email: customerInfo.email,
            customer_name: customerInfo.name,
            customer_phone: customerInfo.phone,
          })
          .select()
          .single()

        if (paymentError) {
          console.error('Error saving payment:', paymentError)
        } else {
          console.log('✅ [Payment] Pagamento salvo com sucesso, criando reserva...')
          // Create reservation automatically
          const { data: reservationData, error: reservationError } = await supabaseClient
            .from('reservations')
            .insert({
              customer_name: customerInfo.name,
              customer_email: customerInfo.email,
              customer_phone: customerInfo.phone,
              pickup_address: quote.pickup_address || quote.pickup_location,
              destination_address: quote.destination_address || quote.dropoff_location,
              pickup_date: quote.pickup_date,
              pickup_time: quote.pickup_time,
              total_amount: quote.total_amount,
              status: 'confirmed',
              payment_status: 'unpaid',
              payment_links: JSON.stringify({ link: session.url }),
              payment_type: 'single',
              payment_id: payment?.id,
              booking_reference: 'TEMP-' + Date.now() // Temporary value, will be updated
            })
            .select('*')
            .single()

          console.log('📊 [Reservation] Resultado da criação da reserva:', { reservationData: !!reservationData, reservationError })
          
          // Create Google Calendar event if reservation was created successfully
          if (reservationData && !reservationError) {
            console.log('🎯 [Calendar] Condições atendidas, iniciando integração com Google Calendar...')
            try {
              // Validate date fields before creating Date objects
              console.log('📅 [Calendar] Validando dados de data:', {
                pickup_date: quote.pickup_date,
                pickup_time: quote.pickup_time
              })
              
              if (!quote.pickup_date) {
                throw new Error('pickup_date is required for calendar event')
              }
              
              // Prepare event data with date validation
              const pickupDateTime = new Date(`${quote.pickup_date}T${quote.pickup_time || '12:00:00'}`)
              
              // Check if the date is valid
              if (isNaN(pickupDateTime.getTime())) {
                throw new Error(`Invalid pickup date/time: ${quote.pickup_date} ${quote.pickup_time || '12:00'}`)
              }
              
              const endDateTime = new Date(pickupDateTime.getTime() + 2 * 60 * 60 * 1000) // +2 hours
              
              console.log('📅 [Calendar] Datas processadas:', {
                pickupDateTime: pickupDateTime.toISOString(),
                endDateTime: endDateTime.toISOString()
              })
              
              const eventData = {
                summary: reservationData.reservation_number, // Apenas o ID da reserva como título
                description: `Transfer Service\n\nCliente: ${customerInfo.name}\nEmail: ${customerInfo.email}\nTelefone: ${customerInfo.phone}\n\nOrigem: ${quote.pickup_address || quote.pickup_location}\nDestino: ${quote.destination_address || quote.dropoff_location}\n\nValor: $${quote.total_amount}\nStatus: Confirmado`,
                start: pickupDateTime.toISOString(),
                end: endDateTime.toISOString(),
                timezone: 'America/Sao_Paulo',
                location: quote.pickup_address || quote.pickup_location,
                userId: null // No user authentication required
              }

              // Call calendar API to create event
              console.log('🗓️ [Calendar] Iniciando criação de evento no Google Calendar...')
              console.log('📋 [Calendar] Dados da reserva:', {
                reservation_number: reservationData.reservation_number,
                customer_name: customerInfo.name,
                pickup_date: quote.pickup_date,
                pickup_address: quote.pickup_address || quote.pickup_location
              })
              
              console.log('📤 [Calendar] Dados do evento a serem enviados:', eventData)
              
              const baseUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || Deno.env.get('NEXT_PUBLIC_BASE_URL') || 'https://dashboard.aztransfergroup.com'
              console.log('🌐 [Calendar] Variáveis de ambiente disponíveis:')
              console.log('🌐 [Calendar] NEXT_PUBLIC_APP_URL:', Deno.env.get('NEXT_PUBLIC_APP_URL'))
              console.log('🌐 [Calendar] NEXT_PUBLIC_BASE_URL:', Deno.env.get('NEXT_PUBLIC_BASE_URL'))
              console.log('🌐 [Calendar] Base URL final:', baseUrl)
              console.log('🌐 [Calendar] Fazendo requisição para:', `${baseUrl}/api/calendar/events`)
              
              const calendarResponse = await fetch(`${baseUrl}/api/calendar/events`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
              })

              console.log('📡 [Calendar] Status da resposta:', calendarResponse.status)
              console.log('📡 [Calendar] Headers da resposta:', Object.fromEntries(calendarResponse.headers.entries()))

              if (calendarResponse.ok) {
                const calendarResult = await calendarResponse.json()
                console.log('✅ [Calendar] Evento criado no Google Calendar com sucesso!')
                console.log('🆔 [Calendar] Dados do evento criado:', calendarResult)
                
                // Update reservation with Google Calendar event ID
                if (calendarResult.event?.id) {
                  console.log('💾 [Calendar] Atualizando reserva com ID do evento:', calendarResult.event?.id)
                  const updateResult = await supabaseClient
                    .from('reservations')
                    .update({ google_event_id: calendarResult.event?.id })
                    .eq('id', reservationData.id)
                  
                  console.log('💾 [Calendar] Resultado da atualização da reserva:', updateResult)
                }
              } else {
                const errorText = await calendarResponse.text()
                console.error('❌ [Calendar] Erro ao criar evento no Google Calendar')
                console.error('❌ [Calendar] Status:', calendarResponse.status)
                console.error('❌ [Calendar] Erro:', errorText)
              }
            } catch (calendarError) {
              console.error('❌ Erro na integração com Google Calendar:', calendarError)
              // Continue execution - reservation was created successfully
            }
          }

          // Update booking_reference with the generated reservation_number
          if (reservationData && !reservationError) {
            await supabaseClient
              .from('reservations')
              .update({ booking_reference: reservationData.reservation_number })
              .eq('reservation_number', reservationData.reservation_number)
          }

          if (reservationError) {
            console.error('Error creating reservation:', reservationError)
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            paymentIntentId: session.id,
            clientSecret: session.url,
          } as PaymentResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        // Create partial payment with two installments
        const firstInstallmentAmount = Math.round(totalAmount * (firstInstallmentPercentage || 50) / 100)
        const secondInstallmentAmount = totalAmount - firstInstallmentAmount

        // Create payment links for both installments
        const firstInstallmentLink = await stripe.paymentLinks.create({
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Transfer Service - First Installment (${firstInstallmentPercentage}%)`,
                  description: `Quote #${quote.id} - First payment`,
                },
                unit_amount: firstInstallmentAmount,
              },
              quantity: 1,
            },
          ],
          metadata: {
            quoteId: quoteId,
            paymentType: 'partial',
            installmentType: 'first',
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
          },
        })

        const secondInstallmentLink = await stripe.paymentLinks.create({
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Transfer Service - Second Installment (${100 - (firstInstallmentPercentage || 50)}%)`,
                  description: `Quote #${quote.id} - Final payment`,
                },
                unit_amount: secondInstallmentAmount,
              },
              quantity: 1,
            },
          ],
          metadata: {
            quoteId: quoteId,
            paymentType: 'partial',
            installmentType: 'second',
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
          },
        })

        // Save payment record
        const { data: payment, error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            quote_id: quoteId,
            amount: quote.total_amount,
            currency: 'USD',
            status: 'pending',
            payment_type: 'partial',
            customer_email: customerInfo.email,
          })
          .select()
          .single()

        if (paymentError) {
          console.error('Error saving payment:', paymentError)
        } else {
          // Save installment records
          const installments = [
            {
              payment_id: payment.id,
              quote_id: quote.id,
              installment_number: 1,
              amount: firstInstallmentAmount / 100,
              percentage: firstInstallmentPercentage || 50,
              due_date: new Date().toISOString().split('T')[0], // Today
              status: 'pending',
              stripe_payment_link_id: firstInstallmentLink.id,
              payment_link_url: firstInstallmentLink.url,
            },
            {
              payment_id: payment.id,
              quote_id: quote.id,
              installment_number: 2,
              amount: secondInstallmentAmount / 100,
              percentage: 100 - (firstInstallmentPercentage || 50),
              due_date: quote.pickup_date, // Service date
              status: 'pending',
              stripe_payment_link_id: secondInstallmentLink.id,
              payment_link_url: secondInstallmentLink.url,
            },
          ]

          const { error: installmentError } = await supabaseClient
            .from('payment_installments')
            .insert(installments)

          if (installmentError) {
            console.error('Error saving installments:', installmentError)
          } else {
            // Create reservation automatically for partial payment
            const { data: reservationData, error: reservationError } = await supabaseClient
              .from('reservations')
              .insert({
                customer_name: customerInfo.name,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone,
                pickup_address: quote.pickup_address || quote.pickup_location,
                destination_address: quote.destination_address || quote.dropoff_location,
                pickup_date: quote.pickup_date,
                pickup_time: quote.pickup_time,
                total_amount: quote.total_amount,
                status: 'confirmed',
                payment_status: 'partial',
                payment_links: JSON.stringify({
                  first_installment: firstInstallmentLink.url,
                  second_installment: secondInstallmentLink.url
                }),
                payment_type: 'partial',
                payment_id: payment.id,
                booking_reference: 'TEMP-' + Date.now() // Temporary value, will be updated
              })
              .select('reservation_number')
              .single()

            // Update booking_reference with the generated reservation_number
            if (reservationData && !reservationError) {
              await supabaseClient
                .from('reservations')
                .update({ booking_reference: reservationData.reservation_number })
                .eq('reservation_number', reservationData.reservation_number)
            }

            if (reservationError) {
              console.error('Error creating reservation:', reservationError)
            } else if (reservationData) {
              // Create Google Calendar event for partial payment reservation
              console.log('🎯 [Calendar] Condições atendidas para pagamento parcelado, iniciando integração com Google Calendar...')
              try {
                // Validate date fields before creating Date objects
                console.log('📅 [Calendar] Validando dados de data:', {
                  pickup_date: quote.pickup_date,
                  pickup_time: quote.pickup_time
                })
                
                if (!quote.pickup_date) {
                  throw new Error('pickup_date is required for calendar event')
                }
                
                // Prepare event data with date validation
                const pickupDateTime = new Date(`${quote.pickup_date}T${quote.pickup_time || '12:00:00'}`)
                
                // Check if the date is valid
                if (isNaN(pickupDateTime.getTime())) {
                  throw new Error(`Invalid pickup date/time: ${quote.pickup_date} ${quote.pickup_time || '12:00'}`)
                }
                
                const endDateTime = new Date(pickupDateTime.getTime() + 2 * 60 * 60 * 1000) // +2 hours
                
                console.log('📅 [Calendar] Datas processadas:', {
                  pickupDateTime: pickupDateTime.toISOString(),
                  endDateTime: endDateTime.toISOString()
                })
                
                const eventData = {
                  summary: reservationData.reservation_number, // Apenas o ID da reserva como título
                  description: `Transfer Service (Pagamento Parcelado)\n\nCliente: ${customerInfo.name}\nEmail: ${customerInfo.email}\nTelefone: ${customerInfo.phone}\n\nOrigem: ${quote.pickup_address || quote.pickup_location}\nDestino: ${quote.destination_address || quote.dropoff_location}\n\nValor: $${quote.total_amount}\nStatus: Confirmado - Pagamento Parcelado`,
                  start: pickupDateTime.toISOString(),
                  end: endDateTime.toISOString(),
                  timezone: 'America/Sao_Paulo',
                  location: quote.pickup_address || quote.pickup_location,
                  userId: null // No user authentication required
                }

                // Call calendar API to create event
                console.log('🗓️ [Calendar] Iniciando criação de evento no Google Calendar para pagamento parcelado...')
                console.log('📋 [Calendar] Dados da reserva:', {
                  reservation_number: reservationData.reservation_number,
                  customer_name: customerInfo.name,
                  pickup_date: quote.pickup_date,
                  pickup_address: quote.pickup_address || quote.pickup_location
                })
                
                console.log('📤 [Calendar] Dados do evento a serem enviados:', eventData)
                
                const baseUrl = Deno.env.get('NEXT_PUBLIC_APP_URL') || Deno.env.get('NEXT_PUBLIC_BASE_URL') || 'http://localhost:3000'
                console.log('🌐 [Calendar] Variáveis de ambiente disponíveis:')
                console.log('🌐 [Calendar] NEXT_PUBLIC_APP_URL:', Deno.env.get('NEXT_PUBLIC_APP_URL'))
                console.log('🌐 [Calendar] NEXT_PUBLIC_BASE_URL:', Deno.env.get('NEXT_PUBLIC_BASE_URL'))
                console.log('🌐 [Calendar] Base URL final:', baseUrl)
                console.log('🌐 [Calendar] Fazendo requisição para:', `${baseUrl}/api/calendar/events`)
                
                const calendarResponse = await fetch(`${baseUrl}/api/calendar/events`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(eventData)
                })

                console.log('📡 [Calendar] Status da resposta:', calendarResponse.status)
                console.log('📡 [Calendar] Headers da resposta:', Object.fromEntries(calendarResponse.headers.entries()))

                if (calendarResponse.ok) {
                  const calendarResult = await calendarResponse.json()
                  console.log('✅ [Calendar] Evento criado no Google Calendar com sucesso para pagamento parcelado!')
                  console.log('🆔 [Calendar] Dados do evento criado:', calendarResult)
                  
                  // Update reservation with Google Calendar event ID
                  if (calendarResult.event?.id) {
                    console.log('💾 [Calendar] Atualizando reserva com ID do evento:', calendarResult.event?.id)
                    const updateResult = await supabaseClient
                      .from('reservations')
                      .update({ google_event_id: calendarResult.event?.id })
                      .eq('reservation_number', reservationData.reservation_number)
                    
                    console.log('💾 [Calendar] Resultado da atualização da reserva:', updateResult)
                  }
                } else {
                  const errorText = await calendarResponse.text()
                  console.error('❌ [Calendar] Erro ao criar evento no Google Calendar para pagamento parcelado')
                  console.error('❌ [Calendar] Status:', calendarResponse.status)
                  console.error('❌ [Calendar] Erro:', errorText)
                }
              } catch (calendarError) {
                console.error('❌ Erro na integração com Google Calendar para pagamento parcelado:', calendarError)
                // Continue execution - reservation was created successfully
              }
            }
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            paymentLinks: {
              firstInstallment: firstInstallmentLink.url,
              secondInstallment: secondInstallmentLink.url,
            },
          } as PaymentResponse),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Handle GET requests - retrieve payment status
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const quoteId = url.searchParams.get('quoteId')

      if (!quoteId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Quote ID is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get payment details
      const { data: payment, error: paymentError } = await supabaseClient
        .from('payments')
        .select(`
          *,
          payment_installments(*)
        `)
        .eq('quote_id', quoteId)
        .single()

      if (paymentError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Payment not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true, payment }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in payments function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})