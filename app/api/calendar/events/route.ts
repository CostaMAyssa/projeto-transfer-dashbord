import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

async function getAccessToken(userId: string | null) {
  const { data, error } = await supabaseAdmin
    .from('integrations_google')
    .select('access_token')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.access_token as string | undefined
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

    const accessToken = await getAccessToken(userId || null)
    if (!accessToken) {
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
  } catch (err: any) {
    console.error('Erro ao listar eventos:', err)
    return NextResponse.json({ error: 'Erro interno', details: err?.message }, { status: 500 })
  }
}