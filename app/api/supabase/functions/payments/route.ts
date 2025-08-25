import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  console.log('🔥 API Proxy POST: Starting request')
  
  try {
    console.log('📥 Parsing request body...')
    const body = await request.json()
    console.log('📋 Request body:', body)
    
    const authHeader = request.headers.get('authorization')
    console.log('🔐 Auth header present:', !!authHeader)
    console.log('🌐 Supabase URL:', supabaseUrl)
    console.log('🔑 Service key present:', !!supabaseServiceKey)

    // Create Supabase client with service role for Edge Function access
    console.log('🚀 Creating Supabase client...')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the Edge Function
    console.log('📞 Calling Edge Function "payments"...')
    const { data, error } = await supabase.functions.invoke('payments', {
      body,
      headers: {
        Authorization: authHeader || '',
      },
    })

    console.log('📥 Edge Function response:')
    console.log('  - Data:', data)
    console.log('  - Error:', error)

    if (error) {
      console.error('❌ Edge Function error details:')
      console.error('  - Message:', error.message)
      console.error('  - Details:', error.details)
      console.error('  - Hint:', error.hint)
      console.error('  - Code:', error.code)
      console.error('  - Full error object:', error)
      
      return NextResponse.json(
        { success: false, error: error.message || 'Edge Function error' },
        { status: 500 }
      )
    }

    console.log('✅ API Proxy POST: Success')
    return NextResponse.json(data)
  } catch (error) {
    console.error('💥 API route error:')
    console.error('  - Error:', error)
    console.error('  - Stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('  - Message:', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quoteId = searchParams.get('quoteId')
    const authHeader = request.headers.get('authorization')

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client with service role for Edge Function access
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('payments', {
      method: 'GET',
      headers: {
        Authorization: authHeader || '',
      },
    })

    if (error) {
      console.error('Edge Function error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}