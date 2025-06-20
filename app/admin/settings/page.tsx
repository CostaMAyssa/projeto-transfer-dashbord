"use client"

import { useState, useEffect } from "react"
import { User, Edit, Save, X, Phone, Mail, MapPin, Shield } from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"
import ChangePasswordModal from "@/components/change-password-modal"
import { supabase } from "@/lib/supabase"
import { ImageUpload } from "@/components/ImageUpload"

export default function SettingsPage() {
  const { user, isLoading } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    avatar_url: ""
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || "",
        avatar_url: user.user_metadata?.avatar_url || ""
      })
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          avatar_url: formData.avatar_url,
        },
      })
      if (error) throw error
      setSuccess("Dados atualizados com sucesso!")
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "Erro ao salvar dados.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || "",
        avatar_url: user.user_metadata?.avatar_url || ""
      })
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-gray">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Perfil do Administrador</h1>
              <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {isEditing ? (
                      <ImageUpload
                        value={formData.avatar_url}
                        onChange={url => setFormData({ ...formData, avatar_url: url })}
                        onError={msg => setError(msg)}
                      />
                    ) : formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" className="object-cover w-32 h-32 rounded-full" />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user?.user_metadata?.full_name || "Administrador"}
                  </h2>
                  <p className="text-gray-600 flex items-center justify-center mt-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </p>
                  <button className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Alterar Foto
                  </button>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">
                            {user?.user_metadata?.full_name || "Não informado"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                        <p className="text-gray-900 py-2 capitalize">Admin</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <p className="text-gray-900 py-2">{user?.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          {isEditing ? (
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{user?.user_metadata?.phone || "Não informado"}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Endereço
                        </label>
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                           {isEditing ? (
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <p className="text-gray-900 py-2">{user?.user_metadata?.address || "Não informado"}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Segurança</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID do Usuário
                        </label>
                        <p className="text-gray-500 text-sm font-mono bg-gray-50 p-2 rounded">
                          {user?.id || "ID não disponível"}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Alterar Senha
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {saving && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-500">{success}</p>
          )}
        </div>
      )}
    </>
  )
}
