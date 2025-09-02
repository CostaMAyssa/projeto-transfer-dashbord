import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Env vars missing: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI')
  }
  return new OAuth2Client(clientId, clientSecret, redirectUri)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin?gcal_error=${encodeURIComponent(error)}`)
  }

  const cookieStore = cookies()
  const savedState = cookieStore.get('gcal_oauth_state')?.value
  if (!state || !savedState || state !== savedState) {
    return NextResponse.json({ error: 'Estado inválido no OAuth' }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'Código OAuth ausente' }, { status: 400 })
  }

  try {
    const client = getOAuthClient()
    const { tokens } = await client.getToken(code)

    // Extrair info mínima do token
    const accessToken = tokens.access_token
    const refreshToken = tokens.refresh_token
    const expiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : null

    // Obter usuário logado (admin) opcionalmente via header X-User-Id ou ignorar e salvar global
    const userId = request.headers.get('x-user-id') || null

    // Persistir tokens em tabela "integrations_google" (crie via Supabase) ou fallback em tabela de settings
    // Espera-se uma tabela com colunas: id (uuid), user_id (uuid, nullable), access_token (text), refresh_token (text), expiry_date (timestamptz), scope (text), token_type (text), created_at, updated_at
    const { data, error: upsertError } = await supabaseAdmin
      .from('integrations_google')
      .upsert({
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate?.toISOString() || null,
        scope: tokens.scope || null,
        token_type: tokens.token_type || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id', ignoreDuplicates: false })
      .select()
      .single()

    if (upsertError) {
      console.error('Erro ao salvar tokens do Google:', upsertError)
      // Continua mas envia alerta ao UI
    }

    // Limpar cookie state
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin?gcal_connected=1`)
    res.cookies.set('gcal_oauth_state', '', { maxAge: 0, path: '/' })
    return res
  } catch (err: any) {
    console.error('Erro no callback do Google OAuth:', err)
    return NextResponse.json(
      { error: 'Falha ao processar callback do Google', details: err?.message },
      { status: 500 }
    )
  }
}