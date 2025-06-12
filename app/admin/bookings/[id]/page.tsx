"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Car, CreditCard, CheckCircle, Edit, Save, X, Copy } from "lucide-react"

// Mock booking data
const mockBookingData = {
  id: "B-1234",
  customer: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  date: "2023-04-01",
  time: "09:30 AM",
  pickup: "JFK Airport",
  pickupDetails: "Terminal 4, Arrivals",
  dropoff: "Manhattan",
  dropoffDetails: "123 Broadway, New York, NY 10001",
  vehicle: "Business Class",
  vehicleModel: "Mercedes-Benz E-Class",
  driver: "David Garcia",
  driverPhone: "+1 (555) 789-0123",
  status: "Completed",
  amount: 174,
  paymentStatus: "Paid",
  paymentMethod: "Credit Card",
  paymentDetails: "**** **** **** 4567",
  extras: [
    { name: "Child Seat", quantity: 1, price: 12 },
    { name: "Bouquet of Flowers", quantity: 1, price: 75 },
  ],
  notes: "Flight AA123 arriving at 9:00 AM. Please wait at the arrivals area with a name sign.",
  createdAt: "2023-03-25 14:32:45",
  history: [
    { timestamp: "2023-03-25 14:32:45", action: "Booking created" },
    { timestamp: "2023-03-25 14:35:12", action: "Payment received" },
    { timestamp: "2023-03-31 10:15:30", action: "Driver assigned: David Garcia" },
    { timestamp: "2023-04-01 09:15:22", action: "Driver en route to pickup location" },
    { timestamp: "2023-04-01 09:35:45", action: "Pickup completed" },
    { timestamp: "2023-04-01 10:20:18", action: "Dropoff completed" },
    { timestamp: "2023-04-01 10:25:33", action: "Booking marked as completed" },
  ],
  distance: "17.3 mi",
  duration: "45 min",
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState(mockBookingData)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedBooking, setEditedBooking] = useState(mockBookingData)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSaveChanges = () => {
    setBooking(editedBooking)
    setIsEditing(false)
  }

  const calculateTotal = () => {
    const extrasTotal = booking.extras.reduce((total, extra) => total + extra.price * extra.quantity, 0)
    return booking.amount + extrasTotal
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-6">
        <Link href="/admin/bookings" className="mr-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
        </Link>
        <h1 className="text-xl font-medium">Trip details</h1>
        <div className="ml-4 flex items-center">
          <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <Copy className="h-4 w-4 mr-1" />
            Duplicate trip
          </button>
        </div>
        {!isEditing ? (
          <button
            className="ml-auto bg-[#E95440] hover:bg-[#d64a36] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit Trip
          </button>
        ) : (
          <div className="ml-auto flex space-x-2">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              onClick={handleSaveChanges}
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto flex-1">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Passenger Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Passenger</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">First name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={editedBooking.customer.split(" ")[0]}
                    onChange={(e) => {
                      const lastName = editedBooking.customer.split(" ").slice(1).join(" ")
                      setEditedBooking({ ...editedBooking, customer: `${e.target.value} ${lastName}` })
                    }}
                  />
                ) : (
                  <p className="font-medium">{booking.customer.split(" ")[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Last name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={editedBooking.customer.split(" ").slice(1).join(" ")}
                    onChange={(e) => {
                      const firstName = editedBooking.customer.split(" ")[0]
                      setEditedBooking({ ...editedBooking, customer: `${firstName} ${e.target.value}` })
                    }}
                  />
                ) : (
                  <p className="font-medium">{booking.customer.split(" ").slice(1).join(" ")}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value={editedBooking.phone}
                    onChange={(e) => setEditedBooking({ ...editedBooking, phone: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{booking.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={editedBooking.email}
                    onChange={(e) => setEditedBooking({ ...editedBooking, email: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{booking.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pickup Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Pickup</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Pickup date</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={editedBooking.date}
                    onChange={(e) => setEditedBooking({ ...editedBooking, date: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{booking.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Pickup time</label>
                {isEditing ? (
                  <input
                    type="time"
                    className="w-full p-2 border rounded-md"
                    value={editedBooking.time}
                    onChange={(e) => setEditedBooking({ ...editedBooking, time: e.target.value })}
                  />
                ) : (
                  <p className="font-medium">{booking.time}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">From</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editedBooking.pickup}
                  onChange={(e) => setEditedBooking({ ...editedBooking, pickup: e.target.value })}
                />
              ) : (
                <p className="font-medium">{booking.pickup}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Additional details</label>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={editedBooking.pickupDetails}
                  onChange={(e) => setEditedBooking({ ...editedBooking, pickupDetails: e.target.value })}
                />
              ) : (
                <p className="font-medium">{booking.pickupDetails}</p>
              )}
            </div>
          </div>

          {/* Dropoff Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Dropoff</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">To</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={editedBooking.dropoff}
                  onChange={(e) => setEditedBooking({ ...editedBooking, dropoff: e.target.value })}
                />
              ) : (
                <p className="font-medium">{booking.dropoff}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Additional details</label>
              {isEditing ? (
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={editedBooking.dropoffDetails}
                  onChange={(e) => setEditedBooking({ ...editedBooking, dropoffDetails: e.target.value })}
                />
              ) : (
                <p className="font-medium">{booking.dropoffDetails}</p>
              )}
            </div>
          </div>

          {/* Vehicle Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Vehicle</h2>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <Car className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <select
                      className="w-full p-2 border rounded-md"
                      value={editedBooking.vehicle}
                      onChange={(e) => setEditedBooking({ ...editedBooking, vehicle: e.target.value })}
                    >
                      <option>Business Class</option>
                      <option>First Class</option>
                      <option>Business Van/SUV</option>
                    </select>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Vehicle model"
                      value={editedBooking.vehicleModel}
                      onChange={(e) => setEditedBooking({ ...editedBooking, vehicleModel: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium">{booking.vehicle}</h3>
                    <p className="text-sm text-gray-500">{booking.vehicleModel}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Notes</h2>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded-md h-32"
                value={editedBooking.notes}
                onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
              />
            ) : (
              <p className="text-gray-700">{booking.notes}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Chauffeur Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Chauffeur</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">On the way</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 font-medium">DG</span>
              </div>
              <div>
                <h3 className="font-medium">{booking.driver}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm ml-1">4.9</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Vehicle</span>
              <span className="text-sm">{booking.vehicleModel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm">{booking.driverPhone}</span>
            </div>
          </div>

          {/* Trip Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Trip details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Distance</span>
                <span className="text-sm font-medium">{booking.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trip time</span>
                <span className="text-sm font-medium">{booking.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-medium">{booking.status}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Payment</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Base fare</span>
                <span className="text-sm font-medium">${booking.amount.toFixed(2)}</span>
              </div>

              {booking.extras.map((extra, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {extra.name} x{extra.quantity}
                  </span>
                  <span className="text-sm font-medium">${(extra.price * extra.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="pt-3 border-t flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm">
                  {booking.paymentMethod} ({booking.paymentDetails})
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle
                  className={`h-5 w-5 ${booking.paymentStatus === "Paid" ? "text-green-500" : "text-yellow-500"} mr-2`}
                />
                <span className="text-sm">{booking.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Trip History Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Trip history</h2>
            <div className="space-y-4">
              {booking.history.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#E95440]"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.timestamp}</p>
                    <p className="text-sm font-medium">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Star component for rating
function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
