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
import { useDashboardStats, useRecentBookings, useUpcomingBookings, useTodayBookings } from "@/hooks/useDashboardStats"

export default function AdminDashboard() {
  const { data: stats, error: statsError, isLoading: statsLoading } = useDashboardStats()
  const { data: recentBookings, error: recentError, isLoading: recentLoading } = useRecentBookings()
  const { data: upcomingBookings, error: upcomingError, isLoading: upcomingLoading } = useUpcomingBookings()
  const { data: todayBookings, error: todayError, isLoading: todayLoading } = useTodayBookings()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) // HH:MM
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-success"
      case 'in_progress':
        return "bg-blue-100 text-info"
      case 'scheduled':
        return "bg-purple-100 text-purple-800"
      case 'pending':
        return "bg-yellow-100 text-warning"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return "Concluído"
      case 'in_progress':
        return "Em Andamento"
      case 'scheduled':
        return "Agendado"
      case 'pending':
        return "Pendente"
      case 'cancelled':
        return "Cancelado"
      default:
        return status
    }
  }

  if (statsLoading || recentLoading || upcomingLoading || todayLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-gray">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (statsError || recentError || upcomingError || todayError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600">Erro ao carregar dados do dashboard</p>
          <p className="text-sm text-gray-500">Verifique sua conexão e tente novamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div></div> {/* Empty div to maintain the flex layout */}
        <Link href="/admin/bookings/new" className="btn-primary bg-secondary flex items-center text-sm">
          <Plus className="h-5 w-5 mr-2" />
          Nova Reserva
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Total de Reservas</h3>
            <div className="bg-blue-100 p-2 rounded">
              <Calendar className="h-5 w-5 text-info" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
              <p className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Pendentes: {stats?.pendingBookings || 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Veículos Ativos</h3>
            <div className="bg-green-100 p-2 rounded">
              <Car className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.activeVehicles || 0}</p>
              <p className="text-sm text-text-gray flex items-center">
                <span>Total: {stats?.totalVehicles || 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Motoristas Ativos</h3>
            <div className="bg-purple-100 p-2 rounded">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{stats?.activeDrivers || 0}</p>
              <p className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Disponíveis</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background-white rounded border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-gray text-sm font-medium">Receita Total</h3>
            <div className="bg-yellow-100 p-2 rounded">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p>
              <p className="text-sm text-success flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Este mês: {formatCurrency(stats?.monthlyRevenue || 0)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-background-white rounded border border-border p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium font-dm-sans">Agenda de Hoje</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-secondary text-white rounded">Hoje</button>
            <Link href="/admin/calendar" className="px-3 py-1 text-sm bg-background-light text-text-gray rounded hover:bg-gray-200">
              Calendário
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-dm-sans">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        </div>
        <div className="border border-border rounded p-4 bg-white">
          <div className="space-y-3">
            {todayBookings && todayBookings.length > 0 ? (
              todayBookings.map((booking) => (
                <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                  <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{booking.pickup_location} → {booking.dropoff_location}</p>
                        <p className="text-xs text-gray-500">{booking.vehicle_name || 'Veículo não definido'}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1">
                          {formatTime(booking.pickup_time)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma reserva para hoje</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 flex-1 overflow-auto">
        {/* Recent Bookings */}
        <div className="bg-background-white rounded border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-medium font-dm-sans">Reservas Recentes</h2>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <div className="space-y-4 p-4">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                    <div className="p-4 hover:bg-background-light rounded transition-colors border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-background-light rounded-full flex items-center justify-center mr-3">
                            <span className="text-text-dark font-medium text-sm">
                              {booking.user_id ? booking.user_id.charAt(0).toUpperCase() : 'G'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">Reserva #{booking.id.slice(-8)}</h3>
                            <p className="text-sm text-text-gray">{formatDate(booking.pickup_date)}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-text-gray mt-0.5" />
                        <div>
                          <p className="text-sm">
                            {booking.pickup_location} → {booking.dropoff_location}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-gray">
                          {booking.vehicle_name || 'Veículo não definido'}
                        </span>
                        <span className="font-medium">{formatCurrency(booking.total_amount)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma reserva recente</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Link href="/admin/bookings" className="text-secondary hover:text-secondary/80 text-sm font-medium">
              Ver todas as reservas
            </Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-background-white rounded border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-medium font-dm-sans">Próximas Reservas</h2>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <div className="space-y-4 p-4">
              {upcomingBookings && upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                    <div className="p-4 hover:bg-background-light rounded transition-colors border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium">Reserva #{booking.id.slice(-8)}</h3>
                          <div className="flex items-center text-sm text-text-gray">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(booking.pickup_date)}</span>
                            <Clock className="h-4 w-4 ml-2 mr-1" />
                            <span>{formatTime(booking.pickup_time)}</span>
                          </div>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {booking.vehicle_type || 'Não definido'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-text-gray mt-0.5" />
                        <div>
                          <p className="text-sm">
                            {booking.pickup_location} → {booking.dropoff_location}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-text-gray">
                        <span>{booking.passengers} passageiro(s), {booking.luggage} bagagem(ns)</span>
                        <span>{booking.vehicle_name || 'Veículo não definido'}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma reserva agendada</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Link href="/admin/bookings" className="text-secondary hover:text-secondary/80 text-sm font-medium">
              Ver todas as reservas agendadas
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
