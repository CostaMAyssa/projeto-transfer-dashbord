"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock } from "lucide-react"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (password === "nexlink") {
      // Set authentication in localStorage
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_auth_time", Date.now().toString())

      // Redirect to admin dashboard
      router.push("/admin")
    } else {
      setError("Senha incorreta. Tente novamente.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/images/az-logo.png" alt="AZ Transfer" className="h-24 w-auto" />
          </div>
          <h2 className="text-2xl font-medium font-dm-sans text-text-dark mb-3 mt-2">Painel Administrativo</h2>
          <p className="text-text-gray text-sm">Digite a senha para acessar o sistema</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-gray" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-standard pl-10 pr-10 w-full"
                  placeholder="Digite sua senha"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-gray hover:text-text-dark" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-gray hover:text-text-dark" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="btn-primary bg-secondary w-full flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Acessar Painel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-text-gray text-center">
              Acesso restrito apenas para administradores autorizados
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-text-gray hover:text-secondary transition-colors"
          >
            ← Voltar ao site principal
          </button>
        </div>
      </div>
    </div>
  )
}
