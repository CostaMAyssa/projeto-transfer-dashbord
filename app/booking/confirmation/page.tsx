"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "#4039",
    date: "Thu, Oct 06, 2022",
    total: "$40.10",
    paymentMethod: "Direct Bank Transfer",
    pickupAddress: "London City Airport (LCY)",
    dropoffAddress: "London City Airport (LCY)",
    pickupDate: "Thu, Oct 06, 2022",
    pickupTime: "6 PM : 15",
    distance: "311 km/ 194 miles",
    time: "3h 43m",
    carClass: "Business Class",
    carModel: "Mercedes-Benz E-Class",
  })

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

      {/* Confirmation Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E95440] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">System, your order was submitted successfully!</h1>
          <p className="text-gray-600">Booking details has been sent to: booking@luxride.com</p>
        </div>

        <div className="border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="font-medium">{orderDetails.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-medium">{orderDetails.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="font-medium">{orderDetails.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-medium">{orderDetails.paymentMethod}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Reservation Information</h2>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-2 border-b">
            <p className="text-gray-600">Pick Up Address</p>
            <p className="font-medium">{orderDetails.pickupAddress}</p>
          </div>
          <div className="flex justify-between py-2 border-b">
            <p className="text-gray-600">Drop Off Address</p>
            <p className="font-medium">{orderDetails.dropoffAddress}</p>
          </div>
          <div className="flex justify-between py-2 border-b">
            <p className="text-gray-600">Pick Up Date</p>
            <p className="font-medium">{orderDetails.pickupDate}</p>
          </div>
          <div className="flex justify-between py-2 border-b">
            <p className="text-gray-600">Pick Up Time</p>
            <p className="font-medium">{orderDetails.pickupTime}</p>
          </div>
          <div className="flex justify-between py-2 border-b">
            <p className="text-gray-600">Distance</p>
            <p className="font-medium">{orderDetails.distance}</p>
          </div>
          <div className="flex justify-between py-2 border-b">
            <p className="text-gray-600">Time</p>
            <p className="font-medium">{orderDetails.time}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Selected Car</h2>

        <div className="border rounded-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 flex items-center justify-center bg-gray-50">
              <div className="relative w-full h-48">
                <Image
                  src="https://content.app-sources.com/s/98064488125095989/uploads/Images/mercedes-e-class-2598047.webp"
                  alt="Mercedes-Benz E-Class"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <p className="text-gray-600">Class</p>
                  <p className="font-medium">{orderDetails.carClass}</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <p className="text-gray-600">Cars</p>
                  <p className="font-medium">{orderDetails.carModel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-[#E95440] text-white px-6 py-3 rounded-md hover:bg-[#d64a36] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
