"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LanguageProvider } from "@/contexts/language-context"
import AdminDashboard from "@/components/admin-dashboard"
import { useAdmin } from "@/hooks/useAdmin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { user, isLoading } = useAdmin()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  // Páginas que não precisam de autenticação
  const publicPages = ["/admin/login", "/admin/reset-password", "/admin/update-password"]
  const isPublicPage = publicPages.includes(pathname)

  // Se estiver em uma página pública, renderize diretamente
  if (isPublicPage) {
    return <LanguageProvider>{children}</LanguageProvider>
  }

  // Aguardar o carregamento da autenticação
  if (!mounted || isLoading) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-gray">Verificando autenticação...</p>
          </div>
        </div>
      </LanguageProvider>
    )
  }

  // Se não há usuário autenticado, mostrar loading
  if (!user) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-gray">Redirecionando para login...</p>
          </div>
        </div>
      </LanguageProvider>
    )
  }

  // Para todas as outras páginas, renderize o dashboard com o usuário autenticado
  return (
    <LanguageProvider>
      <AdminDashboard user={user}>{children}</AdminDashboard>
    </LanguageProvider>
  )
}
