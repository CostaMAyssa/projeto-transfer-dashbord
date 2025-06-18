"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Car, CreditCard, CheckCircle, Edit, Save, X, Copy } from "lucide-react"
import { useBooking } from "@/hooks/useBookings"

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const { data: booking, error, isLoading } = useBooking(params.id)
  const [isEditing, setIsEditing] = useState(false)
  const [editedBooking, setEditedBooking] = useState<any>(null)

  useEffect(() => {
    if (booking) {
      setEditedBooking({
        customer: booking.user_id ? booking.user_id.slice(-8) : "Guest User",
        email: "user@example.com", // Dados do usuário não estão no schema atual
        phone: "+1 (555) 123-4567", // Dados do usuário não estão no schema atual
        date: booking.pickup_date,
        time: booking.pickup_time,
        pickup: booking.pickup_location,
        pickupDetails: booking.pickup_location,
        dropoff: booking.dropoff_location,
        dropoffDetails: booking.dropoff_location,
        vehicle: booking.vehicles?.type || "Not assigned",
        vehicleModel: booking.vehicles?.name || "Not assigned",
        driver: "Not assigned", // Dados do motorista virão depois
        driverPhone: "+1 (555) 789-0123",
        status: booking.status === 'completed' ? 'Completed' : 
                booking.status === 'in_progress' ? 'In Progress' :
                booking.status === 'scheduled' ? 'Scheduled' :
                booking.status === 'pending' ? 'Pending' :
                booking.status === 'cancelled' ? 'Cancelled' : booking.status,
        amount: booking.total_amount,
        paymentStatus: booking.payment_status === 'paid' ? 'Paid' :
                      booking.payment_status === 'unpaid' ? 'Unpaid' :
                      booking.payment_status === 'refunded' ? 'Refunded' : booking.payment_status,
        paymentMethod: booking.payment_method || "Credit Card",
        paymentDetails: "**** **** **** 4567",
        extras: booking.booking_extras?.map((extra: any) => ({
          name: extra.extras?.name || "Extra",
          quantity: extra.quantity,
          price: extra.price
        })) || [],
        notes: booking.notes || "",
        createdAt: booking.created_at,
        history: [
          { timestamp: booking.created_at, action: "Booking created" },
          // Histórico fictício - seria implementado com tabela de audit
        ],
        distance: booking.distance_km ? `${booking.distance_km} km` : "N/A",
        duration: booking.duration_min ? `${booking.duration_min} min` : "N/A",
      })
    }
  }, [booking])

  const handleSaveChanges = () => {
    // Aqui seria implementada a atualização no banco
    setIsEditing(false)
  }

  const calculateTotal = () => {
    if (!editedBooking) return 0
    const extrasTotal = editedBooking.extras.reduce((total: number, extra: any) => total + extra.price * extra.quantity, 0)
    return editedBooking.amount + extrasTotal
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

  if (error || !booking || !editedBooking) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Booking not found...</p>
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
            {editedBooking.customer} • {booking.id.slice(-8)}
          </button>
        </div>
        <div className="ml-auto">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-1 inline" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1 inline" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-1 inline" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto">
        {/* Left Column - Trip Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={editedBooking.customer}
                    onChange={(e) => setEditedBooking({ ...editedBooking, customer: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{editedBooking.customer}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={editedBooking.email}
                    onChange={(e) => setEditedBooking({ ...editedBooking, email: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{editedBooking.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={editedBooking.phone}
                    onChange={(e) => setEditedBooking({ ...editedBooking, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{editedBooking.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Created</label>
                <p className="text-gray-900">{new Date(editedBooking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Trip Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Trip Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={editedBooking.date}
                      onChange={(e) => setEditedBooking({ ...editedBooking, date: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(editedBooking.date).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  {isEditing ? (
                    <input
                      type="time"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      value={editedBooking.time}
                      onChange={(e) => setEditedBooking({ ...editedBooking, time: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900">{editedBooking.time}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                {isEditing ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={2}
                    value={editedBooking.pickup}
                    onChange={(e) => setEditedBooking({ ...editedBooking, pickup: e.target.value })}
                  />
                ) : (
                  <div>
                    <p className="text-gray-900 font-medium">{editedBooking.pickup}</p>
                    <p className="text-gray-600 text-sm">{editedBooking.pickupDetails}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                {isEditing ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={2}
                    value={editedBooking.dropoff}
                    onChange={(e) => setEditedBooking({ ...editedBooking, dropoff: e.target.value })}
                  />
                ) : (
                  <div>
                    <p className="text-gray-900 font-medium">{editedBooking.dropoff}</p>
                    <p className="text-gray-600 text-sm">{editedBooking.dropoffDetails}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <p className="text-gray-900">{editedBooking.distance}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <p className="text-gray-900">{editedBooking.duration}</p>
                </div>
              </div>
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
                    <h3 className="font-medium">{editedBooking.vehicle}</h3>
                    <p className="text-sm text-gray-500">{editedBooking.vehicleModel}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Driver Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Driver</h2>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-medium">{editedBooking.driver.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-medium">{editedBooking.driver}</h3>
                <p className="text-sm text-gray-500">{editedBooking.driverPhone}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Notes</h2>
            {isEditing ? (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
                value={editedBooking.notes}
                onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
              />
            ) : (
              <p className="text-gray-700">{editedBooking.notes}</p>
            )}
          </div>
        </div>

        {/* Right Column - Status & Payment */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trip Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    editedBooking.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : editedBooking.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : editedBooking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {editedBooking.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    editedBooking.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-1 inline" />
                  {editedBooking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Payment</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">{editedBooking.paymentMethod}</p>
                  <p className="text-sm text-gray-500">{editedBooking.paymentDetails}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Price Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base fare</span>
                <span className="font-medium">${editedBooking.amount.toFixed(2)}</span>
              </div>
              {editedBooking.extras.map((extra: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {extra.quantity}x {extra.name}
                  </span>
                  <span>${(extra.price * extra.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Booking History</h2>
            <div className="space-y-3">
              {editedBooking.history.map((item: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
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
