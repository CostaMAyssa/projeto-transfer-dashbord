'use client'

import { useState } from 'react'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { Button } from '@/components/ui/button'

interface CreateGoogleEventProps {
  onEventCreated?: (event: any) => void
}

export function CreateGoogleEvent({ onEventCreated }: CreateGoogleEventProps) {
  const { createEvent, isCreating } = useGoogleCalendar()
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    start: '',
    end: '',
    location: '',
    timezone: 'America/Sao_Paulo'
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!formData.summary || !formData.start || !formData.end) {
      setMessage({ type: 'error', text: 'Título, data de início e fim são obrigatórios' })
      return
    }

    try {
      const result = await createEvent({
        summary: formData.summary,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        location: formData.location,
        timezone: formData.timezone
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Evento criado com sucesso no Google Calendar!' })
        setFormData({
          summary: '',
          description: '',
          start: '',
          end: '',
          location: '',
          timezone: 'America/Sao_Paulo'
        })
        onEventCreated?.(result.event)
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao criar evento' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro inesperado ao criar evento' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Criar Evento no Google Calendar</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Reunião importante"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detalhes do evento..."
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Local
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Sala de reuniões, Endereço..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
              Data/Hora Início *
            </label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
              Data/Hora Fim *
            </label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
            Fuso Horário
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/New_York">Nova York (GMT-5)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Criando...' : 'Criar Evento'}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">ℹ️ Como funciona:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• O evento será criado no seu Google Calendar conectado</li>
          <li>• Você precisa ter feito a autenticação OAuth primeiro</li>
          <li>• O evento aparecerá tanto aqui quanto no Google Calendar</li>
          <li>• Todos os campos de data/hora usam o fuso horário selecionado</li>
        </ul>
      </div>
    </div>
  )
}