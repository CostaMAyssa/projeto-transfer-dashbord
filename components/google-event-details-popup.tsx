"use client"

import { X, Calendar, MapPin, Clock, Users } from "lucide-react"

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
  attendees?: { email: string; displayName?: string }[]
  creator?: { email: string; displayName?: string }
  htmlLink?: string
}

interface GoogleEventDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  event: GoogleCalendarEvent | null
}

export default function GoogleEventDetailsPopup({ isOpen, onClose, event }: GoogleEventDetailsPopupProps) {
  if (!isOpen || !event) return null

  const formatDateTime = (dateTime?: string, date?: string) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    if (date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) + ' (Dia inteiro)'
    }
    return 'Data não definida'
  }

  const formatTime = (dateTime?: string) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return ''
  }

  const isAllDayEvent = !event.start.dateTime && !event.end.dateTime

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900 pr-4">{event.summary || 'Evento sem título'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Data e Hora */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <div className="font-medium text-gray-700">Data e Hora</div>
              <div className="text-gray-600">
                <div>Início: {formatDateTime(event.start.dateTime, event.start.date)}</div>
                <div>Fim: {formatDateTime(event.end.dateTime, event.end.date)}</div>
                {!isAllDayEvent && event.start.dateTime && event.end.dateTime && (
                  <div className="text-sm text-gray-500 mt-1">
                    Duração: {formatTime(event.start.dateTime)} - {formatTime(event.end.dateTime)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Local */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-700">Local</div>
                <div className="text-gray-600">{event.location}</div>
              </div>
            </div>
          )}

          {/* Descrição */}
          {event.description && (
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Descrição</div>
                <div className="text-gray-600 whitespace-pre-wrap">{event.description}</div>
              </div>
            </div>
          )}

          {/* Criador */}
          {event.creator && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-700">Organizador</div>
                <div className="text-gray-600">
                  {event.creator.displayName || event.creator.email}
                </div>
              </div>
            </div>
          )}

          {/* Participantes */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-700">Participantes ({event.attendees.length})</div>
                <div className="text-gray-600 space-y-1">
                  {event.attendees.map((attendee, index) => (
                    <div key={index} className="text-sm">
                      {attendee.displayName || attendee.email}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}