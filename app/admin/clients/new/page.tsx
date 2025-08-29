"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User, Building } from "lucide-react"
import { createClient } from "@/hooks/useClients"

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
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
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Função para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Função para validar telefone (formato brasileiro)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  // Função para validar CPF (formato básico)
  const validateCPF = (cpf: string): boolean => {
    if (!cpf) return true // CPF é opcional
    const cleanCPF = cpf.replace(/\D/g, '')
    return cleanCPF.length === 11
  }

  // Função para validar formulário
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    // Campos obrigatórios
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome completo é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone deve ter um formato válido (ex: (11) 99999-9999)'
    }

    // Validações opcionais
    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF deve ter 11 dígitos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      console.log('Dados do cliente:', formData)
      
      // Mapear os campos do formulário para a estrutura da tabela clients
      const clientData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || undefined,
        role: formData.position.trim() || undefined, // position do formulário -> role na tabela
        address: formData.address.trim() || undefined,
        tags: formData.tags.trim() || undefined,
        billing_address: formData.billing_address.trim() || undefined,
        customer_cpf: formData.cpf.trim() || undefined, // cpf -> customer_cpf na tabela
        notes: formData.notes.trim() || undefined,
        status: formData.status || 'lead'
      }
      
      // Criar cliente usando o hook
      const newClient = await createClient(clientData)
      
      console.log('Cliente criado com sucesso:', newClient)
      router.push('/admin/clients')
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      
      // Tratamento específico para diferentes tipos de erro
      if (error?.code === '23505') {
        if (error?.details?.includes('email')) {
          setErrors({ email: 'Este email já está cadastrado no sistema' })
        } else if (error?.details?.includes('customer_cpf')) {
          setErrors({ cpf: 'Este CPF já está cadastrado no sistema' })
        } else {
          alert('Dados duplicados encontrados. Verifique as informações.')
        }
      } else if (error?.code === '23502') {
        alert('Campos obrigatórios não preenchidos.')
      } else {
        alert('Erro ao salvar cliente. Verifique os dados e tente novamente.')
      }
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary ${
                  errors.full_name ? 'border-red-500' : ''
                }`} placeholder="Digite o nome completo" />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary ${
                  errors.email ? 'border-red-500' : ''
                }`} placeholder="email@exemplo.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary ${
                  errors.phone ? 'border-red-500' : ''
                }`} placeholder="(11) 99999-9999" />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary ${
                  errors.cpf ? 'border-red-500' : ''
                }`} placeholder="000.000.000-00" />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
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