"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, ChevronRight, User, Package, ArrowLeft, Minus, Plus } from "lucide-react"
import { usePricingRules } from "@/hooks/usePricingRules"
import { useExtras } from "@/hooks/useExtras"
import { useVehicles } from "@/hooks/useVehicles"

interface ExtraItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface VehicleType {
  type: string
  model: string
  price: number
  image: string
}

export default function BookingPage() {
  const { data: pricingRules, isLoading: pricingLoading } = usePricingRules()
  const { data: extras, isLoading: extrasLoading } = useExtras()
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles()

  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    passengers: 1,
    luggage: 0,
    selectedVehicle: null as VehicleType | null,
    extras: [] as ExtraItem[],
    flightNumber: "",
  })

  // Adicionar função para buscar preços dinâmicos  
  const getVehiclePrice = (vehicleType: string) => {
    // Preços baseados na tabela pricing_rules - valores padrão
    switch (vehicleType) {
      case "Business Class":
        return 85; // Base price do pricing_rules
      case "First Class":
        return 120; // Base price do pricing_rules  
      case "Business Van/SUV":
        return 140; // Base price do pricing_rules
      default:
        return 75;
    }
  }

  // Obter veículo por tipo
  const getVehicleByType = (type: string) => {
    if (!vehicles) return null
    return vehicles.find(v => v.type === type)
  }

  const handleVehicleSelect = (vehicle: VehicleType) => {
    setBookingData({ ...bookingData, selectedVehicle: vehicle })
  }

  const handleContinue = () => {
    setCurrentStep(2)
  }

  const handleBookNow = () => {
    // Implementar lógica de reserva
    setCurrentStep(3)
  }

  const handleExtraChange = (extraId: string, change: number) => {
    setBookingData(prevData => {
      const existingExtraIndex = prevData.extras.findIndex(e => e.id === extraId)
      
      if (existingExtraIndex >= 0) {
        // Extra já existe, atualizar quantidade
        const updatedExtras = [...prevData.extras]
        const newQuantity = Math.max(0, updatedExtras[existingExtraIndex].quantity + change)
        
        if (newQuantity === 0) {
          // Remover se quantidade for 0
          updatedExtras.splice(existingExtraIndex, 1)
        } else {
          updatedExtras[existingExtraIndex].quantity = newQuantity
        }
        
        return { ...prevData, extras: updatedExtras }
      } else if (change > 0) {
        // Adicionar novo extra
        const extra = extras?.find(e => e.id === extraId)
        if (extra) {
          return {
            ...prevData,
            extras: [...prevData.extras, { id: extra.id, name: extra.name, price: extra.price, quantity: 1 }],
          }
        }
      }
      
      return prevData
    })
  }

  const getExtraQuantity = (extraId: string) => {
    const extra = bookingData.extras.find(e => e.id === extraId)
    return extra ? extra.quantity : 0
  }

  const calculateExtrasTotal = () => {
    return bookingData.extras.reduce((total, extra) => total + extra.price * extra.quantity, 0)
  }

  const calculateTotal = () => {
    const vehiclePrice = bookingData.selectedVehicle ? bookingData.selectedVehicle.price : 0
    return vehiclePrice + calculateExtrasTotal()
  }

  const handleFlightNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({ ...bookingData, flightNumber: e.target.value })
  }

  if (pricingLoading || extrasLoading || vehiclesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando opções de reserva...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="relative w-[100px] h-8">
            <Image
              src="/img/logo.png"
              alt="AZ Transfer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-[#E95440]">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">
              Services
            </a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">
              Fleet
            </a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-[#E95440]">
              Contact
            </a>
          </nav>
          <div>
            <a
              href="/booking"
              className="bg-[#E95440] text-white px-4 py-2 rounded-md hover:bg-[#d64a36] transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </header>

      {/* Booking Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-[#E95440] text-white" : "bg-gray-200 text-gray-600"}`}>
              1
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? "bg-[#E95440]" : "bg-gray-200"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-[#E95440] text-white" : "bg-gray-200 text-gray-600"}`}>
              2
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? "bg-[#E95440]" : "bg-gray-200"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-[#E95440] text-white" : "bg-gray-200 text-gray-600"}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Vehicle Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Choose your ride</h2>
            <div className="space-y-6">
              {/* Business Class */}
              <div className="border rounded-lg mb-6 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:border-[#E95440]/30 group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100/50">
                    <div className="relative w-full h-48 transition-transform duration-500 ease-in-out group-hover:translate-y-[-8px] group-hover:scale-[1.02]">
                      <Image
                        src="https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp"
                        alt="Business Class Vehicle"
                        fill
                        className="object-contain transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">Business Class</h3>
                    <p className="text-sm text-gray-600 mb-2">Mercedes-Benz E-Class, BMW 5 Series, Cadillac XTS or similar</p>

                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span className="text-sm">Passengers 3</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        <span className="text-sm">Luggage 2</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold mb-2">${getVehiclePrice("Business Class")}</div>
                    <p className="text-sm text-gray-600 mb-4">All prices include VAT, fees & tip.</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Meet & Greet included</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Free cancellation</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Free Waiting time</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Safe and secure travel</span>
                      </div>
                    </div>

                    <button
                      className="bg-black text-white px-6 py-3 rounded flex items-center justify-center transition-all duration-300 group-hover:bg-[#E95440]"
                      onClick={() => {
                        const vehicle = getVehicleByType("Business Class")
                        handleVehicleSelect({
                          type: "Business Class",
                          model: vehicle?.name || "Mercedes-Benz E-Class",
                          price: getVehiclePrice("Business Class"),
                          image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp",
                        })
                      }}
                    >
                      Select{" "}
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* First Class */}
              <div className="border rounded-lg mb-6 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:border-[#E95440]/30 group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100/50">
                    <div className="relative w-full h-48 transition-transform duration-500 ease-in-out group-hover:translate-y-[-8px] group-hover:scale-[1.02]">
                      <Image
                        src="https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-s-class-2598047.webp"
                        alt="First Class Vehicle"
                        fill
                        className="object-contain transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">First Class</h3>
                    <p className="text-sm text-gray-600 mb-2">Mercedes-Benz EQS, BMW 7 Series, Audi A8 or similar</p>

                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span className="text-sm">Passengers 3</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        <span className="text-sm">Luggage 3</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold mb-2">${getVehiclePrice("First Class")}</div>
                    <p className="text-sm text-gray-600 mb-4">All prices include VAT, fees & tip.</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Meet & Greet included</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Free cancellation</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Free Waiting time</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Safe and secure travel</span>
                      </div>
                    </div>

                    <button
                      className="bg-black text-white px-6 py-3 rounded flex items-center justify-center transition-all duration-300 group-hover:bg-[#E95440]"
                      onClick={() => {
                        const vehicle = getVehicleByType("First Class")
                        handleVehicleSelect({
                          type: "First Class",
                          model: vehicle?.name || "Mercedes-Benz S-Class",
                          price: getVehiclePrice("First Class"),
                          image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-s-class-2598047.webp",
                        })
                      }}
                    >
                      Select{" "}
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Business Van/SUV */}
              <div className="border rounded-lg mb-6 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:border-[#E95440]/30 group">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100/50">
                    <div className="relative w-full h-48 transition-transform duration-500 ease-in-out group-hover:translate-y-[-8px] group-hover:scale-[1.02]">
                      <Image
                        src="https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-v-class-2598047.webp"
                        alt="Business Van/SUV"
                        fill
                        className="object-contain transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">Business Van/SUV</h3>
                    <p className="text-sm text-gray-600 mb-2">Mercedes-Benz V-Class, Chevrolet Suburban, Cadillac</p>

                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span className="text-sm">Passengers 7</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        <span className="text-sm">Luggage 5</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold mb-2">${getVehiclePrice("Business Van/SUV")}</div>
                    <p className="text-sm text-gray-600 mb-4">All prices include VAT, fees & tip.</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Meet & Greet included</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Free cancellation</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Free Waiting time</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-[#E95440] mr-2" />
                        <span className="text-sm">Safe and secure travel</span>
                      </div>
                    </div>

                    <button
                      className="bg-black text-white px-6 py-3 rounded flex items-center justify-center transition-all duration-300 group-hover:bg-[#E95440]"
                      onClick={() => {
                        const vehicle = getVehicleByType("Business Van/SUV")
                        handleVehicleSelect({
                          type: "Business Van/SUV",
                          model: vehicle?.name || "Mercedes-Benz V-Class",
                          price: getVehiclePrice("Business Van/SUV"),
                          image: "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-v-class-2598047.webp",
                        })
                      }}
                    >
                      Select{" "}
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Extra Options</h2>

            {/* Flight/Train Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Flight/train number</label>
              <input
                type="text"
                placeholder="Example : LH83822"
                className="w-full p-3 border rounded-md"
                value={bookingData.flightNumber}
                onChange={handleFlightNumberChange}
              />
            </div>

            {/* Extras */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Extras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extras?.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{extra.name}</h4>
                      <p className="text-sm text-gray-600">{extra.description}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleExtraChange(extra.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        disabled={getExtraQuantity(extra.id) === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-3 font-medium">{getExtraQuantity(extra.id)}</span>
                      <button
                        onClick={() => handleExtraChange(extra.id, 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">${extra.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={4}
                placeholder="Placeholder text"
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleContinue}
                className="bg-[#E95440] text-white px-6 py-3 rounded-md hover:bg-[#d64a36]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Booking Summary */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Booking Summary</h2>
            
            {/* Selected Vehicle */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Selected Vehicle</h3>
              {bookingData.selectedVehicle && (
                <div className="flex items-center">
                  <div className="relative w-24 h-16 mr-4">
                    <Image
                      src={bookingData.selectedVehicle.image}
                      alt={bookingData.selectedVehicle.type}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{bookingData.selectedVehicle.type}</h4>
                    <p className="text-sm text-gray-600">{bookingData.selectedVehicle.model}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Extras */}
            {bookingData.extras.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Selected Extras</h3>
                <div className="space-y-2">
                  {bookingData.extras.map((extra, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {extra.quantity} x {extra.name} - ${(extra.price * extra.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span>
                    ${bookingData.selectedVehicle ? bookingData.selectedVehicle.price.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Extras:</span>
                  <span>${calculateExtrasTotal().toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleBookNow}
                className="bg-[#E95440] text-white px-6 py-3 rounded-md hover:bg-[#d64a36]"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
