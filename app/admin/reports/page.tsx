"use client"

import { useState } from "react"
import {
  LineChart,
  PieChart,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslations } from "@/lib/i18n"
import { useRecentBookings, useDashboardStats, useAllBookings } from "@/hooks/useDashboardStats"

interface ReportsTranslations {
  title: string
  subtitle: string
  last7Days: string
  last30Days: string
  last90Days: string
  totalRevenue: string
  totalTrips: string
  avgTrip: string
  vsLastMonth: string
  revenueEvolution: string
  viewDetails: string
  chartPlaceholder: string
  tripsByCategory: string
  categoryChartPlaceholder: string
  recentTrips: string
  client: string
  origin: string
  destination: string
  date: string
  amount: string
  status: string
  completed: string
  inProgress: string
  scheduled: string
  pending: string
  cancelled: string
  viewAll: string
}

export default function ReportsPage() {
  const { locale, translations } = useLanguage()
  const t = translations[locale as keyof typeof translations]

  const [selectedPeriod, setSelectedPeriod] = useState("last30")
  const { data: recentBookings, isLoading: bookingsLoading } = useRecentBookings()
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats()
  const { data: allBookings, isLoading: allBookingsLoading } = useAllBookings()

  // Calcular receita total real
  const totalRevenue = dashboardStats?.totalRevenue || 0
  
  // Calcular receita média por viagem baseado em todas as reservas completadas e pagas
  const completedPaidBookings = allBookings?.filter(booking => 
    booking.status === 'completed' && booking.payment_status === 'paid'
  ) || []
  const avgTripValue = completedPaidBookings.length > 0 ? 
    completedPaidBookings.reduce((sum, booking) => sum + booking.total_amount, 0) / completedPaidBookings.length : 0

  // Calcular variações em relação ao mês anterior
  const currentMonth = new Date()
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  const lastMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)
  
  const currentMonthBookings = allBookings?.filter(booking => {
    const bookingDate = new Date(booking.created_at)
    return bookingDate.getMonth() === currentMonth.getMonth() && 
           bookingDate.getFullYear() === currentMonth.getFullYear()
  }) || []
  
  const lastMonthBookings = allBookings?.filter(booking => {
    const bookingDate = new Date(booking.created_at)
    return bookingDate >= lastMonth && bookingDate <= lastMonthEnd
  }) || []

  // Cálculo de variações
  const currentMonthRevenue = currentMonthBookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0)
  
  const lastMonthRevenue = lastMonthBookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.total_amount, 0)
  
  const revenueChange = lastMonthRevenue > 0 ? 
    ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  const currentMonthTripsCount = currentMonthBookings.length
  const lastMonthTripsCount = lastMonthBookings.length
  const tripsChange = lastMonthTripsCount > 0 ? 
    ((currentMonthTripsCount - lastMonthTripsCount) / lastMonthTripsCount) * 100 : 0

  const currentMonthAvg = currentMonthBookings.filter(b => b.payment_status === 'paid').length > 0 ?
    currentMonthRevenue / currentMonthBookings.filter(b => b.payment_status === 'paid').length : 0
  const lastMonthAvg = lastMonthBookings.filter(b => b.payment_status === 'paid').length > 0 ?
    lastMonthRevenue / lastMonthBookings.filter(b => b.payment_status === 'paid').length : 0
  const avgTripChange = lastMonthAvg > 0 ? 
    ((currentMonthAvg - lastMonthAvg) / lastMonthAvg) * 100 : 0

  // Usar valores padrão se as traduções não estiverem carregadas
  const reports: ReportsTranslations = {
    title: "Relatórios",
    subtitle: "Visualize métricas e tendências do seu negócio",
    last7Days: "Últimos 7 dias",
    last30Days: "Últimos 30 dias", 
    last90Days: "Últimos 90 dias",
    totalRevenue: "Receita Total",
    totalTrips: "Total de Viagens",
    avgTrip: "Viagem Média",
    vsLastMonth: "vs. mês anterior",
    revenueEvolution: "Evolução de Receita",
    viewDetails: "Ver Detalhes",
    chartPlaceholder: "Gráfico de referência",
    tripsByCategory: "Viagens por Categoria",
    categoryChartPlaceholder: "Gráfico de categorias será exibido aqui",
    recentTrips: "Viagens Recentes",
    client: "Cliente",
    origin: "Origem",
    destination: "Destino",
    date: "Data",
    amount: "Valor",
    status: "Status",
    completed: "Concluída",
    inProgress: "Em andamento",
    scheduled: "Agendada",
    pending: "Pendente",
    cancelled: "Cancelada",
    viewAll: "Ver todos"
  }

  const processedBookings = recentBookings?.slice(0, 5).map(booking => ({
    id: `BK-${booking.id.slice(-4)}`,
    client: booking.user_id ? `Cliente ${booking.user_id.slice(-4)}` : "Guest User",
    from: booking.pickup_location,
    to: booking.dropoff_location,
    date: new Date(booking.pickup_date).toLocaleDateString('pt-BR'),
    amount: `$ ${booking.total_amount.toFixed(2)}`,
    status: booking.status === 'completed' ? reports.completed :
            booking.status === 'in_progress' ? reports.inProgress :
            booking.status === 'scheduled' ? reports.scheduled :
            booking.status === 'pending' ? reports.pending :
            booking.status === 'cancelled' ? reports.cancelled : booking.status
  })) || []

  if (bookingsLoading || statsLoading || allBookingsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E95440] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{reports.title}</h1>
          <p className="text-gray-600 mt-1">{reports.subtitle}</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="last7">{reports.last7Days}</option>
            <option value="last30">{reports.last30Days}</option>
            <option value="last90">{reports.last90Days}</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{reports.totalRevenue}</p>
              <p className="text-2xl font-bold">$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className={`text-sm flex items-center ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-2">{reports.vsLastMonth}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{reports.totalTrips}</p>
              <p className="text-2xl font-bold">{dashboardStats?.totalBookings || 0}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className={`text-sm flex items-center ${tripsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {tripsChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {tripsChange >= 0 ? '+' : ''}{tripsChange.toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-2">{reports.vsLastMonth}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{reports.avgTrip}</p>
              <p className="text-2xl font-bold">$ {avgTripValue.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className={`text-sm flex items-center ${avgTripChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {avgTripChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {avgTripChange >= 0 ? '+' : ''}{avgTripChange.toFixed(1)}%
            </span>
            <span className="text-gray-500 text-sm ml-2">{reports.vsLastMonth}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{reports.revenueEvolution}</h3>
            <button className="text-xs text-primary">{reports.viewDetails}</button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">{reports.chartPlaceholder}</p>
            </div>
          </div>
        </div>

        {/* Bookings chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{reports.tripsByCategory}</h3>
            <button className="text-xs text-primary">{reports.viewDetails}</button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <PieChart className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500 ml-2">{reports.categoryChartPlaceholder}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium">{reports.recentTrips}</h3>
          <button className="text-xs text-primary">{reports.viewAll}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reports.client}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reports.origin}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reports.destination}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reports.date}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reports.amount}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {reports.status}
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
                        booking.status === reports.completed
                          ? "bg-green-100 text-green-800"
                          : booking.status === reports.inProgress
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
