"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

// Carregar o ServiceAreaMap com lazy loading e sem SSR
const ServiceAreaMap = dynamic(() => import("@/components/service-area-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  ),
})

interface ServiceAreaClientProps {
  language: string
}

export default function ServiceAreaClient({ language }: ServiceAreaClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  // Usar uma key única para forçar a recriação do componente quando a linguagem mudar
  return <ServiceAreaMap key={`map-${language}`} language={language} />
}
