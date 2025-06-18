"use client"

import { useState } from "react"
import {
  LineChart,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Clock,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslations } from "@/lib/i18n"
import { useVehicles } from "@/hooks/useVehicles"
import { useDrivers } from "@/hooks/useDrivers"
import { useRecentBookings } from "@/hooks/useDashboardStats"

export default function ReportsPage() {
  const { locale, translations } = useLanguage()
  const t = translations[locale]

  const [selectedPeriod, setSelectedPeriod] = useState("last30")
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles()
  const { data: drivers, isLoading: driversLoading } = useDrivers()
  const { data: recentBookings, isLoading: bookingsLoading } = useRecentBookings()

  const refreshData = () => {
    window.location.reload()
  }

  const vehicleStats = vehicles?.map(vehicle => ({
    name: vehicle.name,
    trips: Math.floor(Math.random() * 50) + 10,
    utilization: Math.floor(Math.random() * 40) + 40
  })).slice(0, 5) || []

  const driverStats = drivers?.map(driver => ({
    name: driver.full_name,
    trips: Math.floor(Math.random() * 40) + 15,
    rating: (Math.random() * 0.5 + 4.5).toFixed(1)
  })).slice(0, 5) || []

  const processedBookings = recentBookings?.slice(0, 5).map(booking => ({
    id: `BK-${booking.id.slice(-4)}`,
    client: booking.user_id ? `Cliente ${booking.user_id.slice(-4)}` : "Guest User",
    from: booking.pickup_location,
    to: booking.dropoff_location,
    date: new Date(booking.pickup_date).toLocaleDateString('pt-BR'),
    amount: `£ ${booking.total_amount.toFixed(2)}`,
    status: booking.status === 'completed' ? t.reports.completed :
            booking.status === 'in_progress' ? t.reports.inProgress :
            booking.status === 'scheduled' ? t.reports.scheduled :
            booking.status === 'pending' ? t.reports.pending :
            booking.status === 'cancelled' ? t.reports.cancelled : booking.status
  })) || []

  if (vehiclesLoading || driversLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-gray">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.reports.title}</h1>
          <p className="text-gray-600 mt-1">{t.reports.subtitle}</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="last7">{t.reports.last7Days}</option>
            <option value="last30">{t.reports.last30Days}</option>
            <option value="last90">{t.reports.last90Days}</option>
          </select>
          <button
            onClick={refreshData}
            className="btn-secondary text-sm flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t.reports.filter}
          </button>
          <button className="btn-primary text-sm flex items-center">
            <Download className="w-4 h-4 mr-2" />
            {t.reports.export}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.totalRevenue}</p>
              <p className="text-2xl font-bold">£ {(Math.random() * 50000 + 25000).toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </span>
            <span className="text-gray-500 text-sm ml-2">{t.reports.vsLastMonth}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.totalTrips}</p>
              <p className="text-2xl font-bold">{recentBookings?.length || 0}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2%
            </span>
            <span className="text-gray-500 text-sm ml-2">{t.reports.vsLastMonth}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.avgTrip}</p>
              <p className="text-2xl font-bold">£ {(Math.random() * 100 + 80).toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-red-600 text-sm flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1%
            </span>
            <span className="text-gray-500 text-sm ml-2">{t.reports.vsLastMonth}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.customerSatisfaction}</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
            <div className="bg-green-100 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-sm flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3
            </span>
            <span className="text-gray-500 text-sm ml-2">{t.reports.vsLastMonth}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t.reports.revenueEvolution}</h3>
            <button className="text-xs text-primary">{t.reports.viewDetails}</button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">{t.reports.chartPlaceholder}</p>
            </div>
          </div>
        </div>

        {/* Bookings chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t.reports.tripsByCategory}</h3>
            <button className="text-xs text-primary">{t.reports.viewDetails}</button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <PieChart className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500 ml-2">{t.reports.categoryChartPlaceholder}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle and driver performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top vehicles */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t.reports.mostUsedVehicles}</h3>
            <button className="text-xs text-primary">{t.reports.viewAll}</button>
          </div>
          <div className="space-y-4">
            {vehicleStats.map((vehicle, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                  <Car className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{vehicle.name}</p>
                    <p className="text-xs text-gray-600">
                      {vehicle.trips} {t.reports.trips}
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${vehicle.utilization}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top drivers */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t.reports.driverPerformance}</h3>
            <button className="text-xs text-primary">{t.reports.viewAll}</button>
          </div>
          <div className="space-y-4">
            {driverStats.map((driver, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs font-medium text-gray-600">
                    {driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{driver.name}</p>
                    <div className="flex items-center">
                      <p className="text-xs text-gray-600 mr-2">
                        {driver.trips} {t.reports.trips}
                      </p>
                      <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
                        <span className="text-xs font-medium text-green-700">{driver.rating}</span>
                        <span className="text-xs text-yellow-500 ml-0.5">★</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(Number(driver.rating) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium">{t.reports.recentTrips}</h3>
          <button className="text-xs text-primary">{t.reports.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.reports.client}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.reports.origin}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.reports.destination}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.reports.date}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.reports.amount}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.reports.status}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processedBookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-primary">{booking.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{booking.client}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.from}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.to}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{booking.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{booking.amount}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === t.reports.completed
                          ? "bg-green-100 text-green-800"
                          : booking.status === t.reports.inProgress
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
