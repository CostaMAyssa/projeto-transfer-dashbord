"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar"

interface CreateEventPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string // formato YYYY-MM-DD
}

export default function CreateEventPopup({ isOpen, onClose, selectedDate }: CreateEventPopupProps) {
  const { createEvent, isCreating } = useGoogleCalendar()
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    location: "",
    startTime: "09:00",
    endTime: "10:00",
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const startDateTime = `${selectedDate}T${formData.startTime}:00`
      const endDateTime = `${selectedDate}T${formData.endTime}:00`

      await createEvent({
        summary: formData.summary,
        description: formData.description,
        location: formData.location,
        start: startDateTime,
        end: endDateTime,
        timezone: 'America/Sao_Paulo'
      })

      setMessage({ type: 'success', text: 'Evento criado com sucesso!' })
      setFormData({
        summary: "",
        description: "",
        location: "",
        startTime: "09:00",
        endTime: "10:00",
      })
      
      // Fechar popup após 2 segundos
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar evento. Tente novamente.' })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Criar Evento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Data: {new Date(selectedDate).toLocaleDateString('pt-BR')}
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título do evento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição do evento (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Local do evento (opcional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Início
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Fim
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || !formData.summary.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Criando...' : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}