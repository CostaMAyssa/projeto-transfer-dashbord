"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Mock data for dashboard
const mockStats = {
  totalBookings: 128,
  pendingBookings: 24,
  completedBookings: 104,
  totalVehicles: 12,
  activeDrivers: 18,
  revenue: 24680,
  recentBookings: [
    {
      id: "B-1234",
      customer: "John Smith",
      date: "2023-04-01",
      pickup: "JFK Airport",
      dropoff: "Manhattan",
      status: "Completed",
      amount: 174,
    },
    {
      id: "B-1235",
      customer: "Sarah Johnson",
      date: "2023-04-02",
      pickup: "Manhattan",
      dropoff: "Newark Airport",
      status: "Completed",
      amount: 150,
    },
    {
      id: "B-1236",
      customer: "Michael Brown",
      date: "2023-04-03",
      pickup: "LaGuardia Airport",
      dropoff: "Brooklyn",
      status: "In Progress",
      amount: 130,
    },
    {
      id: "B-1237",
      customer: "Emily Davis",
      date: "2023-04-04",
      pickup: "Brooklyn",
      dropoff: "JFK Airport",
      status: "Pending",
      amount: 145,
    },
    {
      id: "B-1238",
      customer: "Robert Wilson",
      date: "2023-04-05",
      pickup: "Manhattan",
      dropoff: "LaGuardia Airport",
      status: "Pending",
      amount: 125,
    },
  ],
  upcomingBookings: [
    {
      id: "B-1239",
      customer: "Jessica Miller",
      date: "2023-04-06",
      time: "09:30 AM",
      pickup: "JFK Airport",
      dropoff: "Manhattan",
      vehicle: "Business Class",
    },
    {
      id: "B-1240",
      customer: "David Garcia",
      date: "2023-04-06",
      time: "11:45 AM",
      pickup: "Newark Airport",
      dropoff: "Manhattan",
      vehicle: "First Class",
    },
    {
      id: "B-1241",
      customer: "Lisa Martinez",
      date: "2023-04-07",
      time: "02:15 PM",
      pickup: "Manhattan",
      dropoff: "JFK Airport",
      vehicle: "Business Van/SUV",
    },
  ],
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-gray">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div></div> {/* Empty div to maintain the flex layout */}
        <button className="btn-primary bg-secondary flex items-center text-sm">
          <Plus className="h-5 w-5 mr-2" />
          New Reservation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Total Bookings</h3>
            <div className="bg-blue-100 p-2 rounded">
              <Calendar className="h-5 w-5 text-info" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
              <p className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Active Vehicles</h3>
            <div className="bg-green-100 p-2 rounded">
              <Car className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.totalVehicles}</p>
              <p className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+2 new vehicles</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Active Drivers</h3>
            <div className="bg-purple-100 p-2 rounded">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.activeDrivers}</p>
              <p className="text-sm text-danger flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-1 from last month</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Total Revenue</h3>
            <div className="bg-yellow-100 p-2 rounded">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8.2% from last month</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-background-white rounded border border-border p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium font-dm-sans">Calendar</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-secondary text-white rounded">Day</button>
            <button className="px-3 py-1 text-sm bg-background-light text-text-gray rounded">Week</button>
            <button className="px-3 py-1 text-sm bg-background-light text-text-gray rounded">Month</button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-dm-sans">Friday, January 18, 2025</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded hover:bg-background-light">
              <ChevronLeft className="h-5 w-5 text-text-gray" />
            </button>
            <button className="p-1 rounded hover:bg-background-light">
              <ChevronRight className="h-5 w-5 text-text-gray" />
            </button>
          </div>
        </div>
        <div className="border border-border rounded p-4 bg-white">
          <div className="grid grid-cols-7 gap-1">
            {/* Days of the week */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days - first week with empty cells */}
            <div className="text-center p-2 rounded-md"></div>
            <div className="text-center p-2 rounded-md"></div>
            <div className="text-center p-2 rounded-md"></div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">1</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">2</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">3</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">4</div>

            {/* Second week */}
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">5</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">6</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">7</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">8</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">9</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">10</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">11</div>

            {/* Third week */}
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">12</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">13</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">14</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">15</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">16</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">17</div>
            <div className="text-center p-2 rounded-md bg-secondary text-white font-medium">18</div>

            {/* Fourth week */}
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">19</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">20</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">21</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">22</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">23</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">24</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">25</div>

            {/* Fifth week */}
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">26</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">27</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">28</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">29</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">30</div>
            <div className="text-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">31</div>
            <div className="text-center p-2 rounded-md"></div>
          </div>

          {/* Events for the selected day */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Events for January 18, 2025</h4>
            <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Airport Pickup - John Smith</p>
                  <p className="text-xs text-gray-500">JFK Airport → Manhattan</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">9:30 AM</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">City Tour - Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Manhattan → Brooklyn</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2:00 PM</span>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-md border-l-4 border-purple-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Airport Dropoff - Michael Brown</p>
                  <p className="text-xs text-gray-500">Manhattan → LaGuardia Airport</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">5:45 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 flex-1 overflow-auto">
        {/* Recent Bookings */}
        <div className="bg-background-white rounded border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-medium font-dm-sans">Recent Bookings</h2>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <div className="space-y-4 p-4">
              {stats.recentBookings.map((booking, index) => (
                <Link key={index} href={`/admin/bookings/${booking.id}`}>
                  <div className="p-4 hover:bg-background-light rounded transition-colors border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-background-light rounded-full flex items-center justify-center mr-3">
                          <span className="text-text-dark font-medium text-sm">{booking.customer.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{booking.customer}</h3>
                          <p className="text-sm text-text-gray">{booking.date}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-success"
                            : booking.status === "In Progress"
                              ? "bg-blue-100 text-info"
                              : "bg-yellow-100 text-warning"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-text-gray mt-0.5" />
                      <div>
                        <p className="text-sm">
                          {booking.pickup} → {booking.dropoff}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-gray">ID: {booking.id}</span>
                      <span className="font-medium">${booking.amount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Link href="/admin/bookings" className="text-secondary hover:text-secondary/80 text-sm font-medium">
              View all bookings
            </Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-background-white rounded border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-medium font-dm-sans">Upcoming Bookings</h2>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <div className="space-y-4 p-4">
              {stats.upcomingBookings.map((booking, index) => (
                <Link key={index} href={`/admin/bookings/${booking.id}`}>
                  <div className="p-4 hover:bg-background-light rounded transition-colors border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">{booking.customer}</h3>
                        <div className="flex items-center text-sm text-text-gray">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{booking.date}</span>
                          <Clock className="h-4 w-4 ml-2 mr-1" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{booking.vehicle}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-text-gray mt-0.5" />
                      <div>
                        <p className="text-sm">
                          {booking.pickup} → {booking.dropoff}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Link href="/admin/bookings" className="text-secondary hover:text-secondary/80 text-sm font-medium">
              View all upcoming bookings
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-background-white rounded border border-border p-6 mb-8">
        <h2 className="text-lg font-medium font-dm-sans mb-4">Alerts & Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h3 className="font-medium text-text-dark">Driver Shortage Alert</h3>
              <p className="text-sm text-text-gray mt-1">
                You have 5 bookings scheduled for tomorrow but only 3 available drivers. Please assign more drivers.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded">
            <AlertCircle className="h-5 w-5 text-info mt-0.5" />
            <div>
              <h3 className="font-medium text-text-dark">Maintenance Reminder</h3>
              <p className="text-sm text-text-gray mt-1">
                Vehicle MB-S500 is due for maintenance in 3 days. Schedule service to avoid disruptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
