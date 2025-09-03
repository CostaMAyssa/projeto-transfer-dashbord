import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { OAuth2Client } from 'google-auth-library'

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Env vars missing: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI')
  }
  return new OAuth2Client(clientId, clientSecret, redirectUri)
}

async function refreshAccessToken(refreshToken: string) {
  console.log('🔄 [refreshAccessToken] Renovando token expirado...')
  
  try {
    const client = getOAuthClient()
    client.setCredentials({ refresh_token: refreshToken })
    
    const { credentials } = await client.refreshAccessToken()
    console.log('✅ [refreshAccessToken] Token renovado com sucesso')
    
    return {
      access_token: credentials.access_token,
      expiry_date: credentials.expiry_date ? new Date(credentials.expiry_date) : null
    }
  } catch (err) {
    console.log('❌ [refreshAccessToken] Erro ao renovar token:', err)
    throw err
  }
}

async function getAccessToken(userId: string | null) {
  console.log('🔍 [getAccessToken] Iniciando busca do token para userId:', userId)
  
  if (!userId) {
    console.log('❌ [getAccessToken] userId é null ou undefined')
    return null
  }

  try {
    console.log('🔗 [getAccessToken] Usando supabaseAdmin')
    
    const { data, error } = await supabaseAdmin
      .from('integrations_google')
      .select('access_token, refresh_token, expiry_date')
      .eq('user_id', userId)
      .maybeSingle()

    console.log('📊 [getAccessToken] Resultado da consulta:')
    console.log('  - error:', error)
    console.log('  - data:', data ? 'Token encontrado' : 'Nenhum token')

    if (error) {
      console.log('❌ [getAccessToken] Erro do Supabase:', JSON.stringify(error, null, 2))
      throw error
    }
    
    if (!data) {
      console.log('❌ [getAccessToken] Nenhum dado retornado')
      return undefined
    }

    // Verificar se o token está expirado
    const now = new Date()
    const expiryDate = data.expiry_date ? new Date(data.expiry_date) : null
    const isExpired = expiryDate && now >= expiryDate
    
    console.log('⏰ [getAccessToken] Verificação de expiração:')
    console.log('  - Data atual:', now.toISOString())
    console.log('  - Data de expiração:', expiryDate?.toISOString() || 'N/A')
    console.log('  - Token expirado:', isExpired)

    if (isExpired && data.refresh_token) {
      console.log('🔄 [getAccessToken] Token expirado, tentando renovar...')
      
      try {
        const refreshedTokens = await refreshAccessToken(data.refresh_token)
        
        // Atualizar token no banco de dados
        const { error: updateError } = await supabaseAdmin
          .from('integrations_google')
          .update({
            access_token: refreshedTokens.access_token,
            expiry_date: refreshedTokens.expiry_date?.toISOString() || null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        if (updateError) {
          console.log('❌ [getAccessToken] Erro ao atualizar token renovado:', updateError)
          throw updateError
        }
        
        console.log('✅ [getAccessToken] Token renovado e salvo com sucesso')
        return refreshedTokens.access_token
      } catch (refreshError) {
        console.log('❌ [getAccessToken] Falha ao renovar token:', refreshError)
        return undefined
      }
    }

    console.log('✅ [getAccessToken] Token obtido com sucesso')
    return data?.access_token as string | undefined
  } catch (err) {
    console.log('💥 [getAccessToken] Erro inesperado:', err)
    throw err
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { summary, description, start, end, timezone, attendees, location, userId } = body

    const accessToken = await getAccessToken(userId || null)
    if (!accessToken) {
      return NextResponse.json({ error: 'Conta do Google não conectada' }, { status: 400 })
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: start, timeZone: timezone || 'UTC' },
        end: { dateTime: end, timeZone: timezone || 'UTC' },
        attendees,
        location,
        reminders: { useDefault: true },
      })
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: 'Falha ao criar evento', details: data }, { status: response.status })
    }

    return NextResponse.json({ success: true, event: data })
  } catch (err: any) {
    console.error('Erro ao criar evento:', err)
    return NextResponse.json({ error: 'Erro interno', details: err?.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeMin = searchParams.get('timeMin') || new Date().toISOString()
    const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const userId = searchParams.get('userId')

    console.log('🔍 [Calendar API] Iniciando busca de eventos:')
    console.log('  - userId:', userId)
    console.log('  - timeMin:', timeMin)
    console.log('  - timeMax:', timeMax)

    const accessToken = await getAccessToken(userId || null)
    console.log('🔑 [Calendar API] Access token obtido:', accessToken ? 'SIM' : 'NÃO')
    
    if (!accessToken) {
      console.log('❌ [Calendar API] Erro: Conta do Google não conectada')
      return NextResponse.json({ error: 'Conta do Google não conectada' }, { status: 400 })
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`)
    url.searchParams.set('timeMin', timeMin)
    url.searchParams.set('timeMax', timeMax)
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')

    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: 'Falha ao listar eventos', details: data }, { status: response.status })
    }

    return NextResponse.json({ success: true, events: data.items || [] })
  } catch (error) {
    console.log('💥 [Calendar API] Erro interno capturado:')
    console.log('  - Tipo do erro:', typeof error)
    console.log('  - Erro completo:', error)
    console.log('  - Stack trace:', error instanceof Error ? error.stack : 'N/A')
    console.log('  - Message:', error instanceof Error ? error.message : String(error))
    
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}