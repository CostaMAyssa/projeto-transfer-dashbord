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
          // Create reservation automatically
          const reservationNumber = `RES${Date.now()}`
          const { error: reservationError } = await supabaseClient
            .from('reservations')
            .insert({
              reservation_number: reservationNumber,
              customer_name: customerInfo.name,
              customer_email: customerInfo.email,
              customer_phone: customerInfo.phone,
              pickup_location: quote.pickup_location,
              dropoff_location: quote.dropoff_location,
              pickup_date: quote.pickup_date,
              pickup_time: quote.pickup_time,
              total_amount: quote.total_amount,
              status: 'confirmed',
              payment_status: 'pending',
              payment_links: JSON.stringify({ link: session.url }),
              payment_type: 'single',
              payment_id: payment?.id
            })

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
            const reservationNumber = `RES${Date.now()}`
            const { error: reservationError } = await supabaseClient
              .from('reservations')
              .insert({
                reservation_number: reservationNumber,
                customer_name: customerInfo.name,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone,
                pickup_location: quote.pickup_location,
                dropoff_location: quote.dropoff_location,
                pickup_date: quote.pickup_date,
                pickup_time: quote.pickup_time,
                total_amount: quote.total_amount,
                status: 'confirmed',
                payment_status: 'pending',
                payment_links: JSON.stringify({
                  first_installment: firstInstallmentLink.url,
                  second_installment: secondInstallmentLink.url
                }),
                payment_type: 'partial',
                payment_id: payment.id
              })

            if (reservationError) {
              console.error('Error creating reservation:', reservationError)
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