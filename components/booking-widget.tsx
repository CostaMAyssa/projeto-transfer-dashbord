"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Calendar, Clock, ChevronRight } from "lucide-react"

export default function BookingWidget() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    pickup: "",
    dropoff: "",
    date: formatDate(new Date()),
    time: "12:00",
    passengers: "1",
    luggage: "1",
  })

  function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would store this data in a state management solution
    // or pass it via URL parameters
    router.push("/booking")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pick-up Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                placeholder="Enter pick-up location"
                className="block w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E95440] focus:border-[#E95440]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Drop-off Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="dropoff"
                value={formData.dropoff}
                onChange={handleChange}
                placeholder="Enter drop-off location"
                className="block w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E95440] focus:border-[#E95440]"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Pick-up Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={formatDate(new Date())}
                className="block w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E95440] focus:border-[#E95440]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Pick-up Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="block w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E95440] focus:border-[#E95440]"
                required
              >
                <option value="00:00">12:00 AM</option>
                <option value="00:30">12:30 AM</option>
                <option value="01:00">1:00 AM</option>
                <option value="01:30">1:30 AM</option>
                <option value="02:00">2:00 AM</option>
                <option value="02:30">2:30 AM</option>
                <option value="03:00">3:00 AM</option>
                <option value="03:30">3:30 AM</option>
                <option value="04:00">4:00 AM</option>
                <option value="04:30">4:30 AM</option>
                <option value="05:00">5:00 AM</option>
                <option value="05:30">5:30 AM</option>
                <option value="06:00">6:00 AM</option>
                <option value="06:30">6:30 AM</option>
                <option value="07:00">7:00 AM</option>
                <option value="07:30">7:30 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="08:30">8:30 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="09:30">9:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="15:30">3:30 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="16:30">4:30 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM</option>
                <option value="21:00">9:00 PM</option>
                <option value="21:30">9:30 PM</option>
                <option value="22:00">10:00 PM</option>
                <option value="22:30">10:30 PM</option>
                <option value="23:00">11:00 PM</option>
                <option value="23:30">11:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Passengers</label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E95440] focus:border-[#E95440]"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
              <option value="5">5 Passengers</option>
              <option value="6">6 Passengers</option>
              <option value="7">7+ Passengers</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#E95440] text-white text-sm py-1.5 px-3 rounded-md hover:bg-[#d64a36] transition-colors flex items-center justify-center"
        >
          Book Now <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
