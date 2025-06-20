"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LanguageProvider } from "@/contexts/language-context"
import AdminDashboard from "@/components/admin-dashboard"
import { useAdmin } from "@/hooks/useAdmin"
import Head from "next/head"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [user, isLoading, pathname, router])

  if (isLoading || (!user && pathname !== "/admin/login")) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-gray">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se o usuário estiver na página de login, renderize-a diretamente.
  if (pathname === "/admin/login") {
    return <LanguageProvider>{children}</LanguageProvider>
  }
  
  // Se o usuário estiver autenticado, renderize o dashboard.
  if (user) {
    return (
      <LanguageProvider>
        <Head>
          <link rel="icon" href="/img/favicon.png" />
        </Head>
        <AdminDashboard user={user}>{children}</AdminDashboard>
      </LanguageProvider>
    )
  }

  return null
}
