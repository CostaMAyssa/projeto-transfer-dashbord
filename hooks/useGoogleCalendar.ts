import { useState, useEffect } from 'react'
import { useAdmin } from './useAdmin'

interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
  location?: string
}

interface UseGoogleCalendarResult {
  events: GoogleCalendarEvent[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useGoogleCalendar(timeMin?: string, timeMax?: string): UseGoogleCalendarResult {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAdmin()

  const fetchEvents = async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        userId: user.id,
        ...(timeMin && { timeMin }),
        ...(timeMax && { timeMax })
      })

      const response = await fetch(`/api/calendar/events?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setEvents(data.events || [])
      } else {
        // Se não estiver conectado, não é um erro crítico
        if (response.status === 400 && data.error === 'Conta do Google não conectada') {
          setEvents([])
          setError(null)
        } else {
          setError(data.error || 'Erro ao carregar eventos do Google Calendar')
        }
      }
    } catch (err) {
      setError('Erro de conexão ao carregar eventos do Google Calendar')
      console.error('Erro ao buscar eventos do Google Calendar:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [user?.id, timeMin, timeMax])

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents
  }
}

// Hook para eventos do dia atual
export function useTodayGoogleCalendar(): UseGoogleCalendarResult {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return useGoogleCalendar(
    today.toISOString().split('T')[0] + 'T00:00:00.000Z',
    tomorrow.toISOString().split('T')[0] + 'T00:00:00.000Z'
  )
}

// Hook para eventos do mês atual
export function useMonthGoogleCalendar(date: Date): UseGoogleCalendarResult {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  return useGoogleCalendar(
    startOfMonth.toISOString(),
    endOfMonth.toISOString()
  )
}