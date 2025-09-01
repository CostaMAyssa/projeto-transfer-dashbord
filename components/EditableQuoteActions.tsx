"use client"

import { useState } from "react"
import { Eye, Trash2, Edit, Save, X, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

interface EditableQuoteActionsProps {
  quote: any
  onDelete: (quote: any) => void
  onUpdate?: (quoteId: string, updates: any) => void
}

export default function EditableQuoteActions({ quote, onDelete, onUpdate }: EditableQuoteActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingQuote, setIsEditingQuote] = useState(false)
  const [editDate, setEditDate] = useState(new Date(quote.created_at).toISOString().split('T')[0])
  const [editData, setEditData] = useState({
    customer_name: quote.customer_name || '',
    customer_email: quote.customer_email || '',
    customer_phone: quote.customer_phone || '',
    status: quote.status || 'draft'
  })

  const handleSaveDate = async () => {
    if (onUpdate) {
      try {
        await onUpdate(quote.id, { created_at: editDate })
        setIsEditing(false)
      } catch (error) {
        console.error('Erro ao atualizar data:', error)
        alert('Erro ao atualizar data. Tente novamente.')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditDate(new Date(quote.created_at).toISOString().split('T')[0])
    setIsEditing(false)
  }

  const handleSaveQuote = async () => {
    if (onUpdate) {
      try {
        await onUpdate(quote.id, editData)
        setIsEditingQuote(false)
      } catch (error) {
        console.error('Erro ao atualizar orçamento:', error)
        alert('Erro ao atualizar orçamento. Tente novamente.')
      }
    }
  }

  const handleCancelQuoteEdit = () => {
    setEditData({
      customer_name: quote.customer_name || '',
      customer_email: quote.customer_email || '',
      customer_phone: quote.customer_phone || '',
      status: quote.status || 'draft'
    })
    setIsEditingQuote(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Data editável */}
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 w-28"
            />
            <button
              onClick={handleSaveDate}
              className="text-blue-600 hover:text-blue-800"
              title="Salvar data"
            >
              <Save className="h-3 w-3" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-800"
              title="Cancelar"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">
              {formatDate(quote.created_at)}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600"
              title="Editar data"
            >
              <Calendar className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Edição rápida do orçamento */}
      {isEditingQuote ? (
        <div className="bg-gray-50 p-2 rounded border border-gray-200 space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-1">Edição Rápida</div>
          
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-500">Nome</label>
              <input
                type="text"
                name="customer_name"
                value={editData.customer_name}
                onChange={handleInputChange}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500">Email</label>
              <input
                type="email"
                name="customer_email"
                value={editData.customer_email}
                onChange={handleInputChange}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500">Telefone</label>
              <input
                type="text"
                name="customer_phone"
                value={editData.customer_phone}
                onChange={handleInputChange}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500">Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={handleInputChange}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="draft">Rascunho</option>
                <option value="sent">Enviado</option>
                <option value="accepted">Aceito</option>
                <option value="rejected">Rejeitado</option>
                <option value="expired">Expirado</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleCancelQuoteEdit}
              className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveQuote}
              className="text-xs px-2 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : null}

      {/* Ações principais */}
      <div className="flex items-center space-x-2">
        <Link 
          href={`/admin/quotes/${quote.booking_reference}`}
          className="text-blue-600 hover:text-blue-900"
          title="Visualizar"
        >
          <Eye className="h-4 w-4" />
        </Link>
        
        {isEditingQuote ? (
          <button
            onClick={handleCancelQuoteEdit}
            className="text-gray-600 hover:text-gray-900"
            title="Cancelar edição"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        
        <Link 
          href={`/admin/quotes/${quote.booking_reference}/edit`}
          className="text-amber-600 hover:text-amber-900"
          title="Edição completa"
        >
          <Edit className="h-4 w-4" />
        </Link>
        
        <button 
          className="text-red-600 hover:text-red-900" 
          title="Excluir"
          onClick={() => onDelete(quote)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
        
        <Link
          href={`/quote/${quote.booking_reference}`}
          className="text-gray-600 hover:text-gray-900"
          title="Ver como cliente"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}