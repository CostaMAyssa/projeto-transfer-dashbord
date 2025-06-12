"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { useState } from "react"

interface TestimonialGalleryProps {
  language: string
}

export default function TestimonialGallery({ language }: TestimonialGalleryProps) {
  const isPortuguese = language === "pt"
  const isSpanish = language === "es"
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({})

  const handleImageLoad = (id: number) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }))
  }

  const getRole = (name: string) => {
    if (name === "Camila Queiroz") {
      if (isPortuguese) return "Atriz e Modelo"
      if (isSpanish) return "Actriz y Modelo"
      return "Actress and Model"
    } else if (name === "Marcos Mion") {
      if (isPortuguese) return "Apresentador de TV"
      if (isSpanish) return "Presentador de TV"
      return "TV Host"
    } else if (name === "André Marques") {
      if (isPortuguese) return "Apresentador de TV e Ator"
      if (isSpanish) return "Presentador de TV y Actor"
      return "TV Host and Actor"
    }
    return ""
  }

  const clients = [
    {
      id: 1,
      name: "Camila Queiroz",
      role: getRole("Camila Queiroz"),
      image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/IMG_6305-3183425.webp?format=webp",
      rating: 5,
    },
    {
      id: 2,
      name: "Marcos Mion",
      role: getRole("Marcos Mion"),
      image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/IMG_6304-3183425.webp?format=webp",
      rating: 5,
    },
    {
      id: 3,
      name: "André Marques",
      role: getRole("André Marques"),
      image:
        "https://content.app-sources.com/s/98064488125095989/uploads/Images/9c49d563-0644-440d-b7b4-01be3c1ccb6b-3279295.webp?format=webp",
      rating: 5,
    },
  ]

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {clients.map((client) => (
          <div key={client.id} className="relative overflow-hidden rounded-xl shadow-md">
            <div className="relative aspect-[4/3] w-full bg-white">
              {/* Placeholder enquanto a imagem carrega */}
              {!imagesLoaded[client.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="w-10 h-10 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <Image
                src={client.image || "/placeholder.svg"}
                alt={`${client.name} with AZ Transfer`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
                quality={90}
                className={`object-cover transition-opacity duration-300 ${imagesLoaded[client.id] ? "opacity-100" : "opacity-0"}`}
                onLoad={() => handleImageLoad(client.id)}
              />

              {/* Overlay escuro apenas na parte inferior para o texto */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>

              {/* Client info overlay */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(client.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E95440] text-[#E95440]" />
                  ))}
                </div>
                <h3 className="text-lg sm:text-xl font-medium">{client.name}</h3>
                <p className="text-sm text-white/80">{client.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
