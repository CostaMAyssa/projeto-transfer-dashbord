import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      quoteId,
      customerEmail,
      customerName,
      totalAmount,
      firstInstallmentPercentage,
      firstInstallmentDate,
      secondInstallmentDate
    } = body

    // Calcular valores das parcelas
    const firstInstallmentAmount = Math.round((totalAmount * firstInstallmentPercentage) / 100)
    const secondInstallmentAmount = totalAmount - firstInstallmentAmount

    // Criar cliente no Stripe (se não existir)
    let customer
    try {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      })
      
      if (customers.data.length > 0) {
        customer = customers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            quote_id: quoteId
          }
        })
      }
    } catch (error) {
      console.error('Erro ao criar/buscar cliente:', error)
      return NextResponse.json(
        { error: 'Erro ao processar cliente' },
        { status: 500 }
      )
    }

    // Criar sessão de checkout para primeira parcela
    const firstInstallmentSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `1ª Parcela - Orçamento ${quoteId}`,
              description: `Primeira parcela (${firstInstallmentPercentage}%) - Vencimento: ${new Date(firstInstallmentDate).toLocaleDateString('pt-BR')}`
            },
            unit_amount: firstInstallmentAmount * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&installment=1&quote_id=${quoteId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?quote_id=${quoteId}`,
      metadata: {
        quote_id: quoteId,
        installment_number: '1',
        installment_type: 'first',
        total_amount: totalAmount.toString(),
        installment_amount: firstInstallmentAmount.toString()
      },
      expires_at: Math.floor(new Date(firstInstallmentDate).getTime() / 1000) + (24 * 60 * 60), // Expira 24h após a data de vencimento
    })

    // Criar sessão de checkout para segunda parcela
    const secondInstallmentSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `2ª Parcela - Orçamento ${quoteId}`,
              description: `Segunda parcela (${100 - firstInstallmentPercentage}%) - Vencimento: ${new Date(secondInstallmentDate).toLocaleDateString('pt-BR')}`
            },
            unit_amount: secondInstallmentAmount * 100, // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&installment=2&quote_id=${quoteId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?quote_id=${quoteId}`,
      metadata: {
        quote_id: quoteId,
        installment_number: '2',
        installment_type: 'second',
        total_amount: totalAmount.toString(),
        installment_amount: secondInstallmentAmount.toString()
      },
      expires_at: Math.floor(new Date(secondInstallmentDate).getTime() / 1000) + (24 * 60 * 60), // Expira 24h após a data de vencimento
    })

    // Salvar informações das parcelas no banco de dados
    try {
      // Inserir registro de pagamento principal
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          quote_id: quoteId,
          customer_email: customerEmail,
          total_amount: totalAmount,
          payment_type: 'installment',
          status: 'pending',
          stripe_customer_id: customer.id
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Erro ao salvar pagamento:', paymentError)
        throw paymentError
      }

      // Inserir parcelas
      const installments = [
        {
          payment_id: payment.id,
          installment_number: 1,
          amount: firstInstallmentAmount,
          due_date: firstInstallmentDate,
          status: 'pending',
          stripe_session_id: firstInstallmentSession.id,
          stripe_checkout_url: firstInstallmentSession.url
        },
        {
          payment_id: payment.id,
          installment_number: 2,
          amount: secondInstallmentAmount,
          due_date: secondInstallmentDate,
          status: 'pending',
          stripe_session_id: secondInstallmentSession.id,
          stripe_checkout_url: secondInstallmentSession.url
        }
      ]

      const { error: installmentsError } = await supabase
        .from('payment_installments')
        .insert(installments)

      if (installmentsError) {
        console.error('Erro ao salvar parcelas:', installmentsError)
        throw installmentsError
      }

    } catch (dbError) {
      console.error('Erro no banco de dados:', dbError)
      // Mesmo com erro no banco, retornamos os links do Stripe
      // O webhook pode processar os pagamentos posteriormente
    }

    // Retornar ambos os links para o frontend
    return NextResponse.json({
      success: true,
      payment_links: {
        first_installment: {
          url: firstInstallmentSession.url,
          session_id: firstInstallmentSession.id,
          amount: firstInstallmentAmount,
          percentage: firstInstallmentPercentage,
          due_date: firstInstallmentDate,
          description: `1ª Parcela (${firstInstallmentPercentage}%)`
        },
        second_installment: {
          url: secondInstallmentSession.url,
          session_id: secondInstallmentSession.id,
          amount: secondInstallmentAmount,
          percentage: 100 - firstInstallmentPercentage,
          due_date: secondInstallmentDate,
          description: `2ª Parcela (${100 - firstInstallmentPercentage}%)`
        }
      },
      customer_id: customer.id,
      total_amount: totalAmount,
      quote_id: quoteId
    })

  } catch (error) {
    console.error('Erro ao criar links de pagamento:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}