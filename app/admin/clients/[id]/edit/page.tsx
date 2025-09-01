"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X } from "lucide-react"
import { useClients, updateClient, type Client } from "@/hooks/useClients"

interface FormData {
  full_name: string
  email: string
  phone: string
  company: string
  role: string
  address: string
  tags: string
  billing_address: string
  notes: string
  preferred_currency: string
  status: string
}

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const { clients, isLoading } = useClients()
  const [client, setClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    address: '',
    tags: '',
    billing_address: '',
    notes: '',
    preferred_currency: 'BRL',
    status: 'Lead'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (clients && params.id) {
      const foundClient = clients.find(c => c.id.toString() === params.id)
      if (foundClient) {
        setClient(foundClient)
        setFormData({
          full_name: foundClient.full_name,
          email: foundClient.email,
          phone: foundClient.phone || '',
          company: foundClient.company || '',
          role: foundClient.role || '',
          address: foundClient.address || '',
          tags: foundClient.tags || '',
          billing_address: foundClient.billing_address || '',
          notes: foundClient.notes || '',
          preferred_currency: foundClient.preferred_currency || 'BRL',
          status: foundClient.status || 'Lead'
        })
      }
    }
  }, [clients, params.id])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !client) return

    setIsSubmitting(true)
    try {
      await updateClient(client.id, formData)
      router.push(`/admin/clients/${client.id}`)
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      alert('Erro ao atualizar cliente. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cliente não encontrado</h3>
          <p className="text-gray-600 mb-4">O cliente solicitado não existe ou foi removido.</p>
          <Link
            href="/admin/clients"
            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Clientes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/admin/clients/${client.id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-600">Atualize as informações do cliente</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Nome Completo */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.full_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o nome completo"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o telefone"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Empresa */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Digite a empresa (opcional)"
              />
            </div>

            {/* Cargo */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Cargo
              </label>
              <input
                type="text"
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Digite o cargo (opcional)"
              />
            </div>

            {/* Endereço */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Digite o endereço (opcional)"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Digite as tags separadas por vírgula (opcional)"
              />
            </div>

            {/* Endereço de Cobrança */}
            <div>
              <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço de Cobrança
              </label>
              <textarea
                id="billing_address"
                value={formData.billing_address}
                onChange={(e) => handleInputChange('billing_address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Digite o endereço de cobrança (opcional)"
              />
            </div>

            {/* Notas */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Digite notas adicionais (opcional)"
              />
            </div>

            {/* Moeda Preferida */}
            <div>
              <label htmlFor="preferred_currency" className="block text-sm font-medium text-gray-700 mb-2">
                Moeda Preferida
              </label>
              <select
                id="preferred_currency"
                value={formData.preferred_currency}
                onChange={(e) => handleInputChange('preferred_currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="BRL">Real (BRL)</option>
                <option value="USD">Dólar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="Lead">Lead</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Link
              href={`/admin/clients/${client.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-secondary border border-transparent rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}