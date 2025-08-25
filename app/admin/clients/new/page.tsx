"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Building } from "lucide-react"
import { createClient } from "@/hooks/useClients"

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    company: '',
    position: '',
    tags: '',
    billing_address: '',
    cpf: '',
    status: 'lead',
    notes: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('Dados do cliente:', formData)
      
      // Mapear os campos do formulário para a estrutura da tabela clients
      const clientData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        role: formData.position || undefined, // position -> role na tabela
        address: formData.address || undefined,
        tags: formData.tags || undefined,
        billing_address: formData.billing_address || undefined,
        notes: formData.notes || undefined,
        status: formData.status || 'Ativo'
      }
      
      // Criar cliente usando o hook
      const newClient = await createClient(clientData)
      
      console.log('Cliente criado com sucesso:', newClient)
      router.push('/admin/clients')
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      alert('Erro ao salvar cliente. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clients" className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-gray-600 mt-1">Adicione um novo cliente ao sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Informações Básicas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Digite o nome completo" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="email@exemplo.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="(11) 99999-9999" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="(11) 99999-9999" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Rua, número, bairro, cidade - UF" />
            </div>
          </div>
        </div>

        {/* Informações Profissionais */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Informações Profissionais</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
              <input type="text" name="company" value={formData.company} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Nome da empresa" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cargo / Função</label>
              <input type="text" name="position" value={formData.position} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Cargo ou função" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange} required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary">
                <option value="lead">Lead</option>
                <option value="active">Cliente Ativo</option>
                <option value="inactive">Cliente Inativo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags / Categoria</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Ex: lead quente, cliente VIP" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CPF / CNPJ</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="000.000.000-00" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço de Cobrança</label>
              <input type="text" name="billing_address" value={formData.billing_address} onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Endereço para cobrança" />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary" placeholder="Informações adicionais..." />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Link href="/admin/clients" className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
            Cancelar
          </Link>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}