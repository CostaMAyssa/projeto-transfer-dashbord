import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  try {
    const client = getOAuthClient()
    const { searchParams } = new URL(request.url)
    const prompt = searchParams.get('prompt') || 'select_account' // Padrão: selecionar conta existente

    const state = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + ':' + Date.now()

    const scopes = (process.env.GOOGLE_CALENDAR_SCOPES || 'https://www.googleapis.com/auth/calendar.events')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      prompt: prompt, // Usar o prompt passado (select_account ou consent)
      scope: scopes,
      include_granted_scopes: true,
      state,
    })

    const res = NextResponse.redirect(authUrl)
    // Guardar o state temporariamente para validação anti-CSRF (10 min)
    res.cookies.set('gcal_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    })

    return res
  } catch (err: any) {
    console.error('Erro ao iniciar OAuth do Google:', err)
    return NextResponse.json(
      { error: 'Falha ao iniciar autenticação com o Google Calendar', details: err?.message },
      { status: 500 }
    )
  }
}