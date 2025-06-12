"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Car, User, Package, CreditCard, Check, MapPin, Calendar, Clock, ChevronRight } from "lucide-react"

// Definir tipos para melhorar a tipagem
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
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    pickup: "Manchester, UK",
    dropoff: "London, UK",
    date: "Thu, Oct 06, 2022",
    time: "6 PM : 15",
    distance: "311 km/ 194 miles",
    duration: "3h 43m",
    selectedVehicle: null as VehicleType | null,
    extras: [] as ExtraItem[],
    flightNumber: "",
    passengerDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      passengers: 1,
      luggage: 1,
      notes: "",
    },
    billingDetails: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      country: "UK",
      city: "London",
      zip: "",
      paymentMethod: "Credit Card",
      cardHolder: "",
      cardNumber: "",
      month: "",
      year: "",
      cvv: "",
    },
  })

  // Lista de extras disponíveis
  const availableExtras = [
    {
      id: "child-seat",
      name: "Child Seat",
      price: 12,
      description: "Suitable for toddlers weighing 0-18 kg (approx 0 to 4 years).",
    },
    {
      id: "booster-seat",
      name: "Booster Seat",
      price: 12,
      description: "Suitable for children weighing 15-36 kg (approx 4 to 10 years).",
    },
    { id: "vodka-bottle", name: "Vodka Bottle", price: 39, description: "Absolut Vodka 0.7l Bottle" },
    {
      id: "flowers",
      name: "Bouquet of Flowers",
      price: 75,
      description: "A bouquet of seasonal flowers prepared by a local florist",
    },
    {
      id: "alcohol-package",
      name: "Alcohol Package",
      price: 120,
      description: "Premium selection of spirits and mixers",
    },
    {
      id: "airport-assistance",
      name: "Airport Assistance",
      price: 150,
      description: "VIP airport assistance and fast-track service",
    },
    {
      id: "bodyguard",
      name: "Bodyguard Service",
      price: 250,
      description: "Professional security personnel for your journey",
    },
  ]

  const handleVehicleSelect = (vehicle: VehicleType) => {
    setBookingData({
      ...bookingData,
      selectedVehicle: vehicle,
    })
    setCurrentStep(2)
  }

  const handleContinue = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleBookNow = () => {
    // In a real app, this would submit the form data to an API
    router.push("/booking/confirmation")
  }

  // Função para adicionar ou remover extras
  const handleExtraChange = (extraId: string, change: number) => {
    const extra = availableExtras.find((item) => item.id === extraId)
    if (!extra) return

    const existingExtraIndex = bookingData.extras.findIndex((item) => item.id === extraId)

    if (existingExtraIndex >= 0) {
      // O extra já existe, atualizar a quantidade
      const updatedExtras = [...bookingData.extras]
      const newQuantity = updatedExtras[existingExtraIndex].quantity + change

      if (newQuantity <= 0) {
        // Remover o item se a quantidade for 0 ou menos
        updatedExtras.splice(existingExtraIndex, 1)
      } else {
        // Atualizar a quantidade
        updatedExtras[existingExtraIndex].quantity = newQuantity
      }

      setBookingData({
        ...bookingData,
        extras: updatedExtras,
      })
    } else if (change > 0) {
      // O extra não existe e estamos adicionando
      setBookingData({
        ...bookingData,
        extras: [...bookingData.extras, { id: extra.id, name: extra.name, price: extra.price, quantity: 1 }],
      })
    }
  }

  // Função para obter a quantidade atual de um extra
  const getExtraQuantity = (extraId: string) => {
    const extra = bookingData.extras.find((item) => item.id === extraId)
    return extra ? extra.quantity : 0
  }

  // Função para calcular o preço total dos extras
  const calculateExtrasTotal = () => {
    return bookingData.extras.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  // Função para calcular o preço total
  const calculateTotal = () => {
    const vehiclePrice = bookingData.selectedVehicle ? bookingData.selectedVehicle.price : 0
    const extrasTotal = calculateExtrasTotal()
    return vehiclePrice + extrasTotal
  }

  // Função para atualizar o campo de número de voo
  const handleFlightNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingData({
      ...bookingData,
      flightNumber: e.target.value,
    })
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="relative w-[100px] h-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AZ_Transfer_Logo-2114669%20%281%29-B2wSNbPiBfGCv1l8HXV55FJExLAfx1.webp"
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

      {/* Booking Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-12">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-black" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-black" : "bg-gray-200"}`}
            >
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm mt-2">Vehicle</div>
            <div className="text-xl font-semibold">01</div>
          </div>
          <div className={`flex-1 border-t border-gray-300 self-start mt-5 mx-2`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-black" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-black" : "bg-gray-200"}`}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm mt-2">Extras</div>
            <div className="text-xl font-semibold">02</div>
          </div>
          <div className={`flex-1 border-t border-gray-300 self-start mt-5 mx-2`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 3 ? "text-black" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-black" : "bg-gray-200"}`}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm mt-2">Details</div>
            <div className="text-xl font-semibold">03</div>
          </div>
          <div className={`flex-1 border-t border-gray-300 self-start mt-5 mx-2`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 4 ? "text-black" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-black" : "bg-gray-200"}`}
            >
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm mt-2">Payment</div>
            <div className="text-xl font-semibold">04</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Select Your Car</h2>

                {/* Business Class */}
                <div className="border rounded-lg mb-6 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:border-[#E95440]/30 group">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100/50">
                      <div className="relative w-full h-48 transition-transform duration-500 ease-in-out group-hover:translate-y-[-8px] group-hover:scale-[1.02]">
                        <Image
                          src="https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp"
                          alt="Mercedes-Benz E-Class"
                          fill
                          className="object-contain transition-all duration-500"
                        />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold">Business Class</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Mercedes-Benz E-Class, BMW 5 Series, Cadillac XTS or similar
                      </p>

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

                      <div className="text-2xl font-bold mb-2">$174</div>
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
                        onClick={() =>
                          handleVehicleSelect({
                            type: "Business Class",
                            model: "Mercedes-Benz E220",
                            price: 174,
                            image:
                              "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp",
                          })
                        }
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
                          alt="Mercedes-Benz S-Class"
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
                          <span className="text-sm">Passengers 5</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          <span className="text-sm">Luggage 3</span>
                        </div>
                      </div>

                      <div className="text-2xl font-bold mb-2">$750</div>
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
                        onClick={() =>
                          handleVehicleSelect({
                            type: "First Class",
                            model: "Mercedes-Benz S-Class",
                            price: 750,
                            image:
                              "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-s-class-2598047.webp",
                          })
                        }
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
                          alt="Mercedes-Benz V-Class"
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

                      <div className="text-2xl font-bold mb-2">$1300</div>
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
                        onClick={() =>
                          handleVehicleSelect({
                            type: "Business Van/SUV",
                            model: "Mercedes-Benz V-Class",
                            price: 1300,
                            image:
                              "https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-v-class-2598047.webp",
                          })
                        }
                      >
                        Select{" "}
                        <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
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

                {/* Child Seat */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Child Seat</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$12</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Suitable for toddlers weighing 0-18 kg (approx 0 to 4 years).
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("child-seat", -1)}
                        disabled={getExtraQuantity("child-seat") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("child-seat")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("child-seat", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Booster Seat */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Booster seat</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$12</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Suitable for children weighing 15-36 kg (approx 4 to 10 years).
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("booster-seat", -1)}
                        disabled={getExtraQuantity("booster-seat") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("booster-seat")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("booster-seat", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vodka Bottle */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Vodka Bottle</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$39</span>
                      </div>
                      <p className="text-sm text-gray-600">Absolut Vodka 0.7l Bottle</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("vodka-bottle", -1)}
                        disabled={getExtraQuantity("vodka-bottle") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("vodka-bottle")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("vodka-bottle", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bouquet of Flowers */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Bouquet of Flowers</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$75</span>
                      </div>
                      <p className="text-sm text-gray-600">A bouquet of seasonal flowers prepared by a local florist</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("flowers", -1)}
                        disabled={getExtraQuantity("flowers") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("flowers")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("flowers", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alcohol Package */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Alcohol Package</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$120</span>
                      </div>
                      <p className="text-sm text-gray-600">Premium selection of spirits and mixers</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("alcohol-package", -1)}
                        disabled={getExtraQuantity("alcohol-package") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("alcohol-package")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("alcohol-package", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Airport Assistance */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Airport Assistance and Hostess Service</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$150</span>
                      </div>
                      <p className="text-sm text-gray-600">VIP airport assistance and fast-track service</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("airport-assistance", -1)}
                        disabled={getExtraQuantity("airport-assistance") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("airport-assistance")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("airport-assistance", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bodyguard Service */}
                <div className="mb-6 border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">Bodyguard Service</h3>
                        <span className="ml-2 bg-[#E95440] text-white text-xs px-2 py-1 rounded">$250</span>
                      </div>
                      <p className="text-sm text-gray-600">Professional security personnel for your journey</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("bodyguard", -1)}
                        disabled={getExtraQuantity("bodyguard") === 0}
                      >
                        -
                      </button>
                      <span className="mx-4">{getExtraQuantity("bodyguard")}</span>
                      <button
                        className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                        onClick={() => handleExtraChange("bodyguard", 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Notes for the chauffeur</label>
                  <textarea
                    placeholder="There are many variations of passages of Lorem Ipsum available."
                    className="w-full p-3 border rounded-md h-32"
                  ></textarea>
                </div>

                <button
                  className="bg-black text-white px-6 py-3 rounded flex items-center justify-center w-full md:w-auto hover:bg-[#E95440] transition-colors"
                  onClick={handleContinue}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Passenger Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="creativelayers088@gmail.com"
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="tel" placeholder="+29 964 029 13" className="w-full p-3 border rounded-md" />
                </div>

                <h3 className="text-xl font-semibold mb-4">Options</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Passengers</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Luggage</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Notes to driver</label>
                  <textarea className="w-full p-3 border rounded-md h-32"></textarea>
                </div>

                <button
                  className="bg-black text-white px-6 py-3 rounded flex items-center justify-center w-full md:w-auto hover:bg-[#E95440] transition-colors"
                  onClick={handleContinue}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Billing Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>UK</option>
                      <option>USA</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>London</option>
                      <option>Manchester</option>
                      <option>Birmingham</option>
                      <option>Liverpool</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP / Postal code</label>
                    <input type="text" placeholder="850" className="w-full p-3 border rounded-md" />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold mb-6">Select Payment Method</h2>

                <div className="mb-6">
                  <select className="w-full p-3 border rounded-md">
                    <option>Credit Card</option>
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <h2 className="text-2xl font-semibold mb-6">Credit Card Payment</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Card Holder Name</label>
                  <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input type="text" className="w-full p-3 border rounded-md bg-gray-50" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Month</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>01</option>
                      <option>02</option>
                      <option>03</option>
                      <option>04</option>
                      <option>05</option>
                      <option>06</option>
                      <option>07</option>
                      <option>08</option>
                      <option>09</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>2023</option>
                      <option>2024</option>
                      <option>2025</option>
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input type="text" placeholder="850" className="w-full p-3 border rounded-md" />
                  </div>
                </div>

                <div className="flex items-center mb-2">
                  <img src="/images/payment-methods.png" alt="Payment Methods" className="h-8" />
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  The credit card must be issued in the driver's name. Debit cards are accepted at some locations and
                  for some car categories.
                </p>

                <div className="flex items-start mb-4">
                  <input type="checkbox" id="terms" className="mt-1 mr-2" />
                  <label htmlFor="terms" className="text-sm">
                    I accept the Terms & Conditions - Booking Conditions and Privacy Policy.
                  </label>
                </div>

                <div className="flex items-start mb-6">
                  <input type="checkbox" id="newsletter" className="mt-1 mr-2" />
                  <label htmlFor="newsletter" className="text-sm">
                    I want to subscribe to Transfero's newsletter (Travel tips and special deals)
                  </label>
                </div>

                <button
                  className="bg-black text-white px-6 py-3 rounded flex items-center justify-center w-full md:w-auto hover:bg-[#E95440] transition-colors"
                  onClick={handleBookNow}
                >
                  Book Now <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Ride Summary */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Ride Summary</h3>
              <button className="text-sm text-gray-600">Edit</button>
            </div>

            <div className="mb-6">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-[#E95440] flex items-center justify-center text-white mr-3 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">{bookingData.pickup}</p>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-gray-300 h-12 ml-4"></div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#E95440] flex items-center justify-center text-white mr-3 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">{bookingData.dropoff}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#E95440]/10 flex items-center justify-center text-[#E95440] mr-3">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">{bookingData.date}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#E95440]/10 flex items-center justify-center text-[#E95440] mr-3">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">{bookingData.time}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="w-full h-40 bg-gray-100 rounded-lg mb-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.2889089020086!2d-0.12184492402694705!3d51.50330061882345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sLondon%20Eye!5e0!3m2!1sen!2sus!4v1649371201096!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Distance</p>
                  <p className="font-medium">{bookingData.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Time</p>
                  <p className="font-medium">{bookingData.duration}</p>
                </div>
              </div>
            </div>

            {bookingData.selectedVehicle && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Vehicle</p>
                <p className="font-medium">{bookingData.selectedVehicle.model}</p>
              </div>
            )}

            {bookingData.extras.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Extra Options</p>
                <div className="space-y-2">
                  {bookingData.extras.map((extra) => (
                    <p key={extra.id} className="text-sm">
                      {extra.quantity} x {extra.name} - ${(extra.price * extra.quantity).toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <p>Selected vehicle</p>
                <p className="font-medium">
                  ${bookingData.selectedVehicle ? bookingData.selectedVehicle.price.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="flex justify-between mb-4">
                <p>Extra options</p>
                <p className="font-medium">${calculateExtrasTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <p>Total</p>
                <p>${calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
