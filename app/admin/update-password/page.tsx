"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Lock } from "lucide-react"

export default function AdminUpdatePassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Troca o código pelo cookie de sessão quando acessado pelo link do e-mail
  useEffect(() => {
    const run = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))
        const code = hashParams.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }
      } catch (err: any) {
        console.error(err)
        setError("Não foi possível validar o link. Solicite um novo e-mail.")
      }
    }
    run()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setError(null)

    if (password.length < 8) {
      setIsLoading(false)
      setError("A senha deve ter pelo menos 8 caracteres")
      return
    }
    if (password !== confirmPassword) {
      setIsLoading(false)
      setError("As senhas não conferem")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage("Senha redefinida com sucesso. Você já pode fazer login.")
    } catch (err: any) {
      setError(err?.message || "Erro ao redefinir senha")
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
          <h2 className="text-2xl font-medium text-text-dark mb-3">Definir nova senha</h2>
          <p className="text-text-gray text-sm">Crie uma nova senha para sua conta</p>
        </div>

        <div className="bg-white rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Nova senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-gray" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-standard pl-10 w-full"
                  placeholder="Mínimo 8 caracteres"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Confirmar senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-gray" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-standard pl-10 w-full"
                  placeholder="Repita a senha"
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
              disabled={isLoading || !password || !confirmPassword}
              className="btn-primary bg-secondary w-full flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Salvando..." : "Salvar nova senha"}
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