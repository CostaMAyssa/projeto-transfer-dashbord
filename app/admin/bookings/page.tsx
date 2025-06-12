"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, Eye, MapPin, Calendar, Clock, Plus, User } from "lucide-react"

// Mock data for bookings
const mockBookings = [
  {
    id: "B-1234",
    customer: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    date: "2023-04-01",
    time: "09:30 AM",
    pickup: "JFK Airport",
    dropoff: "Manhattan",
    vehicle: "Business Class",
    driver: "David Garcia",
    status: "Completed",
    amount: 174,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "B-1235",
    customer: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    date: "2023-04-02",
    time: "11:45 AM",
    pickup: "Manhattan",
    dropoff: "Newark Airport",
    vehicle: "First Class",
    driver: "Emily Davis",
    status: "Completed",
    amount: 150,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
  },
  {
    id: "B-1236",
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 345-6789",
    date: "2023-04-03",
    time: "02:15 PM",
    pickup: "LaGuardia Airport",
    dropoff: "Brooklyn",
    vehicle: "Business Class",
    driver: "John Smith",
    status: "In Progress",
    amount: 130,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "B-1237",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    date: "2023-04-04",
    time: "04:30 PM",
    pickup: "Brooklyn",
    dropoff: "JFK Airport",
    vehicle: "Business Van/SUV",
    driver: "Robert Wilson",
    status: "Pending",
    amount: 145,
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
  },
  {
    id: "B-1238",
    customer: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "+1 (555) 567-8901",
    date: "2023-04-05",
    time: "08:00 AM",
    pickup: "Manhattan",
    dropoff: "LaGuardia Airport",
    vehicle: "First Class",
    driver: "Jessica Miller",
    status: "Pending",
    amount: 125,
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
  },
  {
    id: "B-1239",
    customer: "Jessica Miller",
    email: "jessica.miller@example.com",
    phone: "+1 (555) 678-9012",
    date: "2023-04-06",
    time: "09:30 AM",
    pickup: "JFK Airport",
    dropoff: "Manhattan",
    vehicle: "Business Class",
    driver: "Michael Brown",
    status: "Scheduled",
    amount: 174,
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
  },
  {
    id: "B-1240",
    customer: "David Garcia",
    email: "david.garcia@example.com",
    phone: "+1 (555) 789-0123",
    date: "2023-04-06",
    time: "11:45 AM",
    pickup: "Newark Airport",
    dropoff: "Manhattan",
    vehicle: "First Class",
    driver: "Sarah Johnson",
    status: "Scheduled",
    amount: 150,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "B-1241",
    customer: "Lisa Martinez",
    email: "lisa.martinez@example.com",
    phone: "+1 (555) 890-1234",
    date: "2023-04-07",
    time: "02:15 PM",
    pickup: "Manhattan",
    dropoff: "JFK Airport",
    vehicle: "Business Van/SUV",
    driver: "Lisa Martinez",
    status: "Scheduled",
    amount: 145,
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropoff.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || booking.status === statusFilter),
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium">Trips</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-primary bg-secondary flex items-center text-sm">
            <Plus className="h-5 w-5 mr-2" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "All" ? "text-[#E95440] border-b-2 border-[#E95440]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "Chauffeur"
                ? "text-[#E95440] border-b-2 border-[#E95440]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("Chauffeur")}
          >
            Chauffeur
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "Flight"
                ? "text-[#E95440] border-b-2 border-[#E95440]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("Flight")}
          >
            Flight
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "Hotel" ? "text-[#E95440] border-b-2 border-[#E95440]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("Hotel")}
          >
            Hotel
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex mb-6 space-x-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            statusFilter === "All" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setStatusFilter("All")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            statusFilter === "Pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setStatusFilter("Pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            statusFilter === "Scheduled" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setStatusFilter("Scheduled")}
        >
          Accepted
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            statusFilter === "Completed" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setStatusFilter("Completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            statusFilter === "Cancelled" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setStatusFilter("Cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E95440] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            Select date
          </button>
        </div>
      </div>

      {/* Bookings Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 overflow-auto flex-1">
        {currentBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-lg mr-4">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{booking.customer}</h3>
                    <span className="ml-2 text-sm text-gray-500">Trip ID: {booking.id}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-sm text-gray-500 mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {booking.time}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full mr-4 ${
                    booking.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "Scheduled"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
                <Link href={`/admin/bookings/${booking.id}`}>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="h-5 w-5 text-gray-500" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Trip type</p>
                <p className="text-sm font-medium">One way</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                <p className="text-sm font-medium">{booking.vehicle}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Driver</p>
                <p className="text-sm font-medium">{booking.driver}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Pickup</p>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{booking.pickup}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Dropoff</p>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{booking.dropoff}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-lg font-bold">${booking.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 text-right">Payment</p>
                <p className={`text-sm ${booking.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {booking.paymentStatus} • {booking.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page ? "bg-[#E95440] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
