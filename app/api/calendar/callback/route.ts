import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createServerClient } from '@supabase/ssr'

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
    console.error('❌ Erro OAuth:', error)
    
    // Tratar erro específico de cliente desabilitado
    if (error === 'disabled_client') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin?gcal_error=oauth_disabled`)
    }
    
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

    // Obter usuário logado da sessão do Supabase
    const cookieStore = cookies()
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {}
        }
      }
    )
    
    const { data: { user } } = await supabaseServer.auth.getUser()
    const userId = user?.id || null
    
    console.log('🔍 [Callback] UserId obtido da sessão:', userId)

    // Persistir tokens em tabela "integrations_google"
    console.log('💾 [Callback] Salvando tokens no banco de dados...')
    console.log('  - userId:', userId)
    console.log('  - accessToken presente:', !!accessToken)
    console.log('  - refreshToken presente:', !!refreshToken)
    
    const tokenData = {
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: expiryDate?.toISOString() || null,
      scope: tokens.scope || null,
      token_type: tokens.token_type || null,
      updated_at: new Date().toISOString(),
    }
    
    const { data, error: upsertError } = await supabaseAdmin
      .from('integrations_google')
      .upsert(tokenData, { onConflict: 'user_id', ignoreDuplicates: false })
      .select()
      .single()

    if (upsertError) {
      console.error('❌ [Callback] Erro ao salvar tokens do Google:', JSON.stringify(upsertError, null, 2))
      // Continua mas envia alerta ao UI
    } else {
      console.log('✅ [Callback] Tokens salvos com sucesso:', data?.id)
    }

    // Salvar tokens no localStorage via script inline
    const tokenData = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: expiryDate?.toISOString() || null,
      scope: tokens.scope || null,
      token_type: tokens.token_type || null,
    }
    
    // Limpar cookie state e redirecionar com script para salvar no localStorage
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin?gcal_connected=1`)
    res.cookies.set('gcal_oauth_state', '', { maxAge: 0, path: '/' })
    
    // Adicionar script para salvar tokens no localStorage
    const script = `
      <script>
        try {
          localStorage.setItem('google_calendar_tokens', '${JSON.stringify(tokenData)}');
          console.log('✅ Tokens salvos no localStorage');
        } catch (e) {
          console.error('❌ Erro ao salvar tokens no localStorage:', e);
        }
        window.location.href = '${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin?gcal_connected=1';
      </script>
    `
    
    return new Response(script, {
      headers: {
        'Content-Type': 'text/html',
        ...res.headers
      }
    })
  } catch (err: any) {
    console.error('Erro no callback do Google OAuth:', err)
    return NextResponse.json(
      { error: 'Falha ao processar callback do Google', details: err?.message },
      { status: 500 }
    )
  }
}