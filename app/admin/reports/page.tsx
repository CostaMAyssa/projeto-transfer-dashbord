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

export default function ReportsPage() {
  const { language } = useLanguage()
  const t = getTranslations(language)

  const [dateRange, setDateRange] = useState("last30")
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">{t.reports.title}</h1>
          <p className="text-sm text-gray-600 mt-1">{t.reports.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-md border border-gray-200">
            <select
              className="text-sm py-2 pl-3 pr-8 rounded-md border-0 focus:ring-0"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">{t.reports.today}</option>
              <option value="yesterday">{t.reports.yesterday}</option>
              <option value="last7">{t.reports.last7Days}</option>
              <option value="last30">{t.reports.last30Days}</option>
              <option value="thisMonth">{t.reports.thisMonth}</option>
              <option value="lastMonth">{t.reports.lastMonth}</option>
              <option value="custom">{t.reports.custom}</option>
            </select>
            <div className="px-3 border-l border-gray-200">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm py-2 px-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={refreshData}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t.reports.refresh}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm py-2 px-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>{t.reports.export}</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.totalRevenue}</p>
              <h3 className="text-2xl font-medium mt-1">R$ 24.580</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-600 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>12.5%</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">{t.reports.vsPrevious}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.totalTrips}</p>
              <h3 className="text-2xl font-medium mt-1">187</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-600 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>8.2%</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">{t.reports.vsPrevious}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.newCustomers}</p>
              <h3 className="text-2xl font-medium mt-1">43</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-red-600 text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>3.8%</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">{t.reports.vsPrevious}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{t.reports.avgTripTime}</p>
              <h3 className="text-2xl font-medium mt-1">42 min</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-md">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-600 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>1.2%</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">{t.reports.vsPrevious}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t.reports.revenueByPeriod}</h3>
            <div className="flex items-center gap-2">
              <button className="text-xs py-1 px-2 bg-primary/10 text-primary rounded">{t.reports.daily}</button>
              <button className="text-xs py-1 px-2 text-gray-600 hover:bg-gray-100 rounded">{t.reports.weekly}</button>
              <button className="text-xs py-1 px-2 text-gray-600 hover:bg-gray-100 rounded">{t.reports.monthly}</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <LineChart className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500 ml-2">{t.reports.revenueChartPlaceholder}</p>
          </div>
        </div>

        {/* Bookings chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{t.reports.tripsByCategory}</h3>
            <button className="flex items-center text-xs text-gray-600">
              <Filter className="h-3 w-3 mr-1" />
              <span>{t.reports.filter}</span>
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <PieChart className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500 ml-2">{t.reports.categoryChartPlaceholder}</p>
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
            {[
              { name: "Mercedes Benz Sprinter", trips: 42, utilization: 78 },
              { name: "Toyota Hiace Executive", trips: 38, utilization: 72 },
              { name: "Ford Transit Premium", trips: 31, utilization: 65 },
              { name: "Mercedes Benz V-Class", trips: 29, utilization: 61 },
              { name: "Volkswagen Crafter", trips: 24, utilization: 52 },
            ].map((vehicle, index) => (
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
            {[
              { name: "Carlos Silva", trips: 36, rating: 4.9 },
              { name: "Ana Oliveira", trips: 32, rating: 4.8 },
              { name: "Roberto Santos", trips: 29, rating: 4.7 },
              { name: "Juliana Costa", trips: 27, rating: 4.9 },
              { name: "Marcos Pereira", trips: 24, rating: 4.6 },
            ].map((driver, index) => (
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
                      style={{ width: `${(driver.rating / 5) * 100}%` }}
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
              {[
                {
                  id: "BK-7829",
                  client: "João Almeida",
                  from: "Aeroporto de Lisboa",
                  to: "Hotel Tivoli",
                  date: "24/03/2023",
                  amount: "R$ 180",
                  status: t.reports.completed,
                },
                {
                  id: "BK-7830",
                  client: "Maria Santos",
                  from: "Hotel Marriott",
                  to: "Aeroporto do Porto",
                  date: "24/03/2023",
                  amount: "R$ 210",
                  status: t.reports.completed,
                },
                {
                  id: "BK-7831",
                  client: "Pedro Costa",
                  from: "Aeroporto de Faro",
                  to: "Resort Pine Cliffs",
                  date: "25/03/2023",
                  amount: "R$ 250",
                  status: t.reports.inProgress,
                },
                {
                  id: "BK-7832",
                  client: "Sofia Martins",
                  from: "Hotel Altis",
                  to: "Aeroporto de Lisboa",
                  date: "25/03/2023",
                  amount: "R$ 175",
                  status: t.reports.scheduled,
                },
                {
                  id: "BK-7833",
                  client: "Ricardo Ferreira",
                  from: "Aeroporto do Porto",
                  to: "Hotel Infante Sagres",
                  date: "26/03/2023",
                  amount: "R$ 195",
                  status: t.reports.scheduled,
                },
              ].map((booking, index) => (
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
