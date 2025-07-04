"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Car, CreditCard, CheckCircle, Edit, Save, X, Copy } from "lucide-react"
import { useBooking } from "@/hooks/useBookings"

export default function BookingDetailsClient({ id }: { id: string }) {
  const { data: booking, error, isLoading } = useBooking(id)
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance & Duration</label>
                <p className="text-gray-900">{editedBooking.distance} / {editedBooking.duration}</p>
              </div>
            </div>
          </div>

          {/* Vehicle & Driver Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Vehicle & Driver Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <p className="text-gray-900">{editedBooking.vehicle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                <p className="text-gray-900">{editedBooking.vehicleModel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <p className="text-gray-900">{editedBooking.driver}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver Phone</label>
                <p className="text-gray-900">{editedBooking.driverPhone}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Notes</h2>
            {isEditing ? (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
                value={editedBooking.notes}
                onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{editedBooking.notes || "No notes."}</p>
            )}
          </div>
        </div>

        {/* Right Column - Status & Payment */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Status</h2>
            {isEditing ? (
              <select
                className="w-full p-3 border border-gray-300 rounded-md"
                value={editedBooking.status}
                onChange={(e) => setEditedBooking({ ...editedBooking, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  editedBooking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  editedBooking.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  editedBooking.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                  editedBooking.status === 'Pending' ? 'bg-purple-100 text-purple-800' :
                  editedBooking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {editedBooking.status}
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <p className="text-gray-900 font-bold text-xl">${editedBooking.amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                {isEditing ? (
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={editedBooking.paymentStatus}
                    onChange={(e) => setEditedBooking({ ...editedBooking, paymentStatus: e.target.value })}
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                ) : (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      editedBooking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      editedBooking.paymentStatus === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {editedBooking.paymentStatus}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <p className="text-gray-900">{editedBooking.paymentMethod}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
                <p className="text-gray-900">{editedBooking.paymentDetails}</p>
              </div>
            </div>
          </div>

          {/* Extras */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Extras</h2>
            {editedBooking.extras.length > 0 ? (
              <ul className="space-y-2">
                {editedBooking.extras.map((extra: any, index: number) => (
                  <li key={index} className="flex justify-between text-gray-900">
                    <span>{extra.name} (x{extra.quantity})</span>
                    <span>${extra.price.toFixed(2)}</span>
                  </li>
                ))}
                <li className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total (incl. extras)</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </li>
              </ul>
            ) : (
              <p className="text-gray-600">No extra services added.</p>
            )}
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Booking History</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {editedBooking.history.map((event: any, index: number) => (
                <li key={index}>
                  <span className="font-medium">{new Date(event.timestamp).toLocaleString()}:</span> {event.action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 