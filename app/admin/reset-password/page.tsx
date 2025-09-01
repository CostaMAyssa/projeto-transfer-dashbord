"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Mail } from "lucide-react"

export default function AdminResetPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setError(null)

    try {
      const redirectTo = `${window.location.origin}/admin/update-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })
      if (error) throw error
      setMessage("Se o e-mail existir, enviamos um link para redefinir a senha.")
    } catch (err: any) {
      setError(err?.message || "Erro ao solicitar redefinição de senha")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/img/logo.png" alt="AZ Transfer" className="h-24 w-auto" />
          </div>
          <h2 className="text-2xl font-medium text-text-dark mb-3">Redefinir senha</h2>
          <p className="text-text-gray text-sm">Informe seu e-mail para receber o link de redefinição</p>
        </div>

        <div className="bg-white rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-gray" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-standard pl-10 w-full"
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">{message}</div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email}
              className="btn-primary bg-secondary w-full flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar link de redefinição"}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/admin/login" className="text-sm text-text-gray hover:text-secondary transition-colors">
              ← Voltar ao login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 