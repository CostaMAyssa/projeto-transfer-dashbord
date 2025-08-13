"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Link as LinkIcon,
  Settings
} from "lucide-react"

export default function PaymentsPage() {
  const pathname = usePathname()
  const [filter, setFilter] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  // Navigation tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", href: "/admin/payments", icon: DollarSign },
    { id: "schedules", label: "Cronograma", href: "/admin/payments/schedules", icon: Calendar },
    { id: "settings", label: "Configurações", href: "/admin/payments/settings", icon: Settings }
  ]

  // Mock data - será substituído por dados reais do Supabase
  const paymentStats = {
    pending: { count: 12, amount: 2400.00 },
    paid: { count: 48, amount: 9600.00 },
    failed: { count: 3, amount: 450.00 },
    total: { count: 63, amount: 12450.00 }
  }

  const recentPayments = [
    {
      id: "1",
      booking_id: "BK001",
      customer_name: "João Silva",
      amount: 200.00,
      status: "paid",
      method: "card",
      installment: "1/2",
      created_at: "2025-01-11T10:30:00",
      next_payment: "2025-01-25"
    },
    {
      id: "2", 
      booking_id: "BK002",
      customer_name: "Maria Santos",
      amount: 500.00,
      status: "pending",
      method: "card",
      installment: "2/2",
      created_at: "2025-01-11T09:15:00",
      next_payment: "2025-01-11"
    },
    {
      id: "3",
      booking_id: "BK003", 
      customer_name: "Carlos Oliveira",
      amount: 150.00,
      status: "failed",
      method: "card",
      installment: "1/1",
      created_at: "2025-01-11T08:45:00",
      next_payment: null
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600 bg-green-50"
      case "pending": return "text-yellow-600 bg-yellow-50"
      case "failed": return "text-red-600 bg-red-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Pago"
      case "pending": return "Pendente"
      case "failed": return "Falhou"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-text-dark">Pagamentos</h1>
          <p className="text-text-gray text-sm mt-1">Gerencie pagamentos e parcelas das reservas</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center text-sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button className="btn-primary bg-secondary flex items-center text-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-border">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-secondary text-secondary"
                      : "border-transparent text-text-gray hover:text-text-dark"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-gray text-sm">Pendentes</p>
                  <p className="text-2xl font-medium text-text-dark">{paymentStats.pending.count}</p>
                  <p className="text-yellow-600 text-sm font-medium">${paymentStats.pending.amount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-gray text-sm">Pagos</p>
                  <p className="text-2xl font-medium text-text-dark">{paymentStats.paid.count}</p>
                  <p className="text-green-600 text-sm font-medium">${paymentStats.paid.amount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-gray text-sm">Falharam</p>
                  <p className="text-2xl font-medium text-text-dark">{paymentStats.failed.count}</p>
                  <p className="text-red-600 text-sm font-medium">${paymentStats.failed.amount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-gray text-sm">Total</p>
                  <p className="text-2xl font-medium text-text-dark">{paymentStats.total.count}</p>
                  <p className="text-secondary text-sm font-medium">${paymentStats.total.amount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-text-gray" />
                <span className="text-sm font-medium text-text-dark">Filtros:</span>
              </div>
              
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="input-standard text-sm min-w-[120px]"
              >
                <option value="all">Todos</option>
                <option value="paid">Pagos</option>
                <option value="pending">Pendentes</option>
                <option value="failed">Falharam</option>
              </select>

              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="input-standard text-sm min-w-[120px]"
              >
                <option value="today">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
                <option value="custom">Período customizado</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-text-dark">Transações Recentes</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reserva
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parcela
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próxima
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-text-dark">{payment.booking_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-dark">{payment.customer_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-text-dark">${payment.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-gray">{payment.installment}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.next_payment ? (
                          <span className="text-sm text-text-gray">
                            {new Date(payment.next_payment).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-text-gray">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {payment.status === "pending" && (
                            <button className="text-secondary hover:text-secondary/80 text-sm">
                              Cobrar
                            </button>
                          )}
                          {payment.status === "failed" && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                              <LinkIcon className="h-3 w-3 mr-1" />
                              Link
                            </button>
                          )}
                          <button className="text-text-gray hover:text-text-dark text-sm">
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 