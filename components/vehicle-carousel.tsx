"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Briefcase, ChevronRight, ChevronLeft } from "lucide-react"

interface VehicleType {
  id: string
  title: string
  description: string
  image: string
  passengers: number
  luggage: number
}

interface VehicleCarouselProps {
  vehicles: VehicleType[]
}

export default function VehicleCarousel({ vehicles }: VehicleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if we're on mobile or desktop
  useEffect(() => {
    if (!isClient) return

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [isClient])

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? vehicles.length - 1 : prevIndex - 1))
  }

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === vehicles.length - 1 ? 0 : prevIndex + 1))
  }

  const handleBookNow = () => {
    if (!isClient) return
    window.open("https://customer.moovs.app/az-transfer/new/info?moovs_source=widget", "_blank", "noopener,noreferrer")
  }

  // Detect language based on URL
  const isPortuguese = () => {
    if (!isClient) return false
    if (typeof window !== "undefined") {
      return window.location.pathname.includes("/pt")
    }
    return false
  }

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left, go to next slide
      goToNextSlide()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right, go to previous slide
      goToPrevSlide()
    }
  }

  // Se não estivermos no cliente, renderizar uma versão simplificada
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto justify-center">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="relative h-48 bg-gray-50">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.title}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-medium mb-1">{vehicle.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{vehicle.description}</p>

                <div className="flex justify-between mb-4 mt-auto">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Passengers: {vehicle.passengers}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Luggage: {vehicle.luggage}</span>
                  </div>
                </div>

                <button className="w-full bg-[#E95440] text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                  Book Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {isMobile ? (
        // Mobile view - Carousel
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="w-full flex-shrink-0 px-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                  <div className="relative h-40 md:h-56 bg-gray-50 dark:bg-gray-900">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-medium mb-1 dark:text-white">{vehicle.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{vehicle.description}</p>

                    <div className="flex justify-between mb-3 mt-auto">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1 text-gray-500" />
                        <span className="text-xs font-medium dark:text-gray-300">
                          {isPortuguese() ? "Passageiros: " : "Passengers: "}
                          {vehicle.passengers}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-3 h-3 mr-1 text-gray-500" />
                        <span className="text-xs font-medium dark:text-gray-300">
                          {isPortuguese() ? "Bagagem: " : "Luggage: "}
                          {vehicle.luggage}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBookNow}
                      className="w-full bg-[#E95440] hover:bg-[#d64a36] text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      {isPortuguese() ? "Reservar Agora" : "Book Now"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots for mobile */}
          <div className="flex justify-center mt-4">
            {vehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 mx-1 rounded-full ${activeIndex === index ? "bg-[#E95440]" : "bg-gray-300"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Desktop view - Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto justify-center">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col"
            >
              <div className="relative h-48 md:h-56 bg-gray-50 dark:bg-gray-900">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.title}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-medium mb-1 dark:text-white">{vehicle.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{vehicle.description}</p>

                <div className="flex justify-between mb-4 mt-auto">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium dark:text-gray-300">
                      {isPortuguese() ? "Passageiros: " : "Passengers: "}
                      {vehicle.passengers}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium dark:text-gray-300">
                      {isPortuguese() ? "Bagagem: " : "Luggage: "}
                      {vehicle.luggage}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#E95440] hover:bg-[#d64a36] text-white py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                >
                  {isPortuguese() ? "Reservar Agora" : "Book Now"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation buttons - visible only on mobile */}
      {isMobile && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={goToPrevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={goToNextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E95440] flex items-center justify-center hover:bg-[#d64a36] transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
