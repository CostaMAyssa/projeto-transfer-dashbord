// @deno-types="https://esm.sh/@types/stripe@8.0.417"
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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

      const totalAmount = Math.round(quote.total_price * 100) // Convert to cents

      if (paymentType === 'full') {
        // Create single payment intent for full amount
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalAmount,
          currency: 'eur',
          metadata: {
            quoteId: quoteId,
            paymentType: 'full',
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
          },
          description: `Payment for transfer service - Quote #${quote.id}`,
        })

        // Save payment record
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            quote_id: quoteId,
            stripe_payment_intent_id: paymentIntent.id,
            amount: quote.total_price,
            currency: 'EUR',
            status: 'pending',
            payment_type: 'full',
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
          })

        if (paymentError) {
          console.error('Error saving payment:', paymentError)
        }

        return new Response(
          JSON.stringify({
            success: true,
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
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
                currency: 'eur',
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
                currency: 'eur',
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
            amount: quote.total_price,
            currency: 'EUR',
            status: 'pending',
            payment_type: 'partial',
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
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
              installment_number: 1,
              amount: firstInstallmentAmount / 100,
              due_date: new Date().toISOString().split('T')[0], // Today
              status: 'pending',
              stripe_payment_link_id: firstInstallmentLink.id,
              stripe_payment_link_url: firstInstallmentLink.url,
            },
            {
              payment_id: payment.id,
              installment_number: 2,
              amount: secondInstallmentAmount / 100,
              due_date: quote.pickup_date, // Service date
              status: 'pending',
              stripe_payment_link_id: secondInstallmentLink.id,
              stripe_payment_link_url: secondInstallmentLink.url,
            },
          ]

          const { error: installmentError } = await supabaseClient
            .from('payment_installments')
            .insert(installments)

          if (installmentError) {
            console.error('Error saving installments:', installmentError)
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