"use client"

import { useState } from "react"
import { 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  User,
  CreditCard,
  RefreshCw,
  Filter
} from "lucide-react"

export default function PaymentSchedulesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filter, setFilter] = useState("all")

  // Mock data - será substituído por dados reais do Supabase
  const scheduledPayments = [
    {
      id: "1",
      booking_id: "BK001",
      customer_name: "João Silva", 
      amount: 800.00,
      due_date: "2025-01-11",
      status: "scheduled",
      installment: "2/2",
      method: "card"
    },
    {
      id: "2",
      booking_id: "BK005",
      customer_name: "Ana Costa",
      amount: 300.00,
      due_date: "2025-01-11", 
      status: "overdue",
      installment: "1/1",
      method: "card"
    },
    {
      id: "3",
      booking_id: "BK008",
      customer_name: "Pedro Santos",
      amount: 650.00,
      due_date: "2025-01-12",
      status: "scheduled", 
      installment: "2/3",
      method: "card"
    },
    {
      id: "4",
      booking_id: "BK012",
      customer_name: "Lucia Oliveira",
      amount: 450.00,
      due_date: "2025-01-13",
      status: "processing",
      installment: "1/2",
      method: "card"
    }
  ]

  const todaysPayments = scheduledPayments.filter(p => p.due_date === selectedDate)
  const totalToday = todaysPayments.reduce((sum, p) => sum + p.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "text-blue-600 bg-blue-50"
      case "processing": return "text-yellow-600 bg-yellow-50"
      case "overdue": return "text-red-600 bg-red-50"
      case "completed": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled": return "Agendado"
      case "processing": return "Processando"
      case "overdue": return "Atrasado"
      case "completed": return "Concluído"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return <Clock className="h-4 w-4" />
      case "processing": return <RefreshCw className="h-4 w-4 animate-spin" />
      case "overdue": return <AlertCircle className="h-4 w-4" />
      case "completed": return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-text-dark">Cronograma de Pagamentos</h1>
          <p className="text-text-gray text-sm mt-1">Gerencie parcelas agendadas e vencimentos</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center text-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
          <button className="btn-primary bg-secondary flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Processar Hoje
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Hoje</p>
              <p className="text-2xl font-medium text-text-dark">{todaysPayments.length}</p>
              <p className="text-blue-600 text-sm font-medium">${totalToday.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Esta Semana</p>
              <p className="text-2xl font-medium text-text-dark">18</p>
              <p className="text-green-600 text-sm font-medium">$4,200.00</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Atrasados</p>
              <p className="text-2xl font-medium text-text-dark">5</p>
              <p className="text-red-600 text-sm font-medium">$850.00</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-gray text-sm">Processando</p>
              <p className="text-2xl font-medium text-text-dark">3</p>
              <p className="text-yellow-600 text-sm font-medium">$725.00</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector & Filters */}
      <div className="bg-white rounded-lg p-4 border border-border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-gray" />
            <span className="text-sm font-medium text-text-dark">Data:</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-standard text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-gray" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="input-standard text-sm min-w-[120px]"
            >
              <option value="all">Todos</option>
              <option value="scheduled">Agendados</option>
              <option value="processing">Processando</option>
              <option value="overdue">Atrasados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scheduled Payments List */}
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium text-text-dark">
            Pagamentos para {new Date(selectedDate).toLocaleDateString('pt-BR')}
          </h2>
          <p className="text-text-gray text-sm mt-1">
            {todaysPayments.length} pagamentos agendados • Total: ${totalToday.toFixed(2)}
          </p>
        </div>
        
        <div className="p-6">
          {todaysPayments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-text-gray">Nenhum pagamento agendado para esta data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysPayments.map((payment) => (
                <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-text-gray" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-dark">{payment.customer_name}</h3>
                        <p className="text-sm text-text-gray">Reserva: {payment.booking_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium text-text-dark">${payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-text-gray">Parcela {payment.installment}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {payment.status === "scheduled" && (
                          <>
                            <button className="btn-primary bg-secondary text-sm px-3 py-1">
                              Processar
                            </button>
                            <button className="btn-secondary text-sm px-3 py-1">
                              Reagendar
                            </button>
                          </>
                        )}
                        {payment.status === "overdue" && (
                          <>
                            <button className="btn-primary bg-red-600 text-sm px-3 py-1">
                              Cobrar Agora
                            </button>
                            <button className="btn-secondary text-sm px-3 py-1">
                              Gerar Link
                            </button>
                          </>
                        )}
                        {payment.status === "processing" && (
                          <button className="btn-secondary text-sm px-3 py-1" disabled>
                            Processando...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-border">
        <h3 className="text-lg font-medium text-text-dark mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Processar Todos de Hoje</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium">Cobrar Atrasados</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Atualizar Status</span>
          </button>
        </div>
      </div>
    </div>
  )
} 