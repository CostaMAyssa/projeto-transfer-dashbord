"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LanguageProvider } from "@/contexts/language-context"
import AdminDashboard from "@/components/admin-dashboard"
import Head from "next/head"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Se estiver na página de login, renderize diretamente
  if (pathname === "/admin/login") {
    return <LanguageProvider>{children}</LanguageProvider>
  }

  // Para todas as outras páginas, renderize o dashboard sempre
  return (
    <LanguageProvider>
      <Head>
        <link rel="icon" href="/img/favicon.png" />
      </Head>
      <AdminDashboard user={null}>{children}</AdminDashboard>
    </LanguageProvider>
  )
}
