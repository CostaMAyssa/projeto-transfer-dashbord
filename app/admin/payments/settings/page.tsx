"use client"

import { useState } from "react"
import { 
  Settings,
  CreditCard,
  RefreshCw,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  DollarSign
} from "lucide-react"

export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState("templates")

  // Mock data - será substituído por dados reais do Supabase
  const [paymentTemplates, setPaymentTemplates] = useState([
    {
      id: "1",
      name: "Padrão 20/80",
      deposit_percentage: 20,
      balance_percentage: 80,
      description: "20% de entrada + 80% no dia do serviço",
      is_default: true
    },
    {
      id: "2", 
      name: "À vista",
      deposit_percentage: 100,
      balance_percentage: 0,
      description: "100% no ato da contratação",
      is_default: false
    },
    {
      id: "3",
      name: "Sem entrada",
      deposit_percentage: 0,
      balance_percentage: 100,
      description: "100% no dia do serviço",
      is_default: false
    }
  ])

  const [retrySettings, setRetrySettings] = useState({
    max_retries: 3,
    retry_intervals: [4, 24, 72], // em horas
    send_notifications: true,
    auto_generate_links: true
  })

  const [refundPolicies, setRefundPolicies] = useState({
    allow_partial_refunds: true,
    deposit_refund_window: 24, // horas
    full_refund_window: 48, // horas
    cancellation_fee_percentage: 10
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-text-dark">Configurações de Pagamento</h1>
          <p className="text-text-gray text-sm mt-1">Configure templates, políticas e automações</p>
        </div>
        <button className="btn-primary bg-secondary flex items-center text-sm">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-border">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "templates"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-text-gray hover:text-text-dark"
              }`}
            >
              Templates de Divisão
            </button>
            <button
              onClick={() => setActiveTab("retries")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "retries"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-text-gray hover:text-text-dark"
              }`}
            >
              Configurações de Retry
            </button>
            <button
              onClick={() => setActiveTab("policies")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "policies"
                  ? "border-secondary text-secondary"
                  : "border-transparent text-text-gray hover:text-text-dark"
              }`}
            >
              Políticas de Reembolso
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-text-dark">Templates de Divisão</h2>
                <button className="btn-primary bg-secondary flex items-center text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentTemplates.map((template) => (
                  <div key={template.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-text-dark">{template.name}</h3>
                      <div className="flex gap-2">
                        <button className="text-text-gray hover:text-text-dark">
                          <Edit className="h-4 w-4" />
                        </button>
                        {!template.is_default && (
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-gray">Entrada:</span>
                        <span className="text-sm font-medium text-text-dark">{template.deposit_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-gray">Saldo:</span>
                        <span className="text-sm font-medium text-text-dark">{template.balance_percentage}%</span>
                      </div>
                      <p className="text-sm text-text-gray mt-2">{template.description}</p>
                      
                      {template.is_default && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Padrão
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Example */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-4">Exemplo Visual - Template Padrão (20/80)</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white rounded p-4 text-center">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Entrada</p>
                    <p className="text-lg font-bold text-green-600">20%</p>
                    <p className="text-xs text-text-gray">No ato da contratação</p>
                  </div>
                  <div className="text-text-gray">+</div>
                  <div className="flex-1 bg-white rounded p-4 text-center">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Saldo</p>
                    <p className="text-lg font-bold text-blue-600">80%</p>
                    <p className="text-xs text-text-gray">No dia do serviço</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Retries Tab */}
          {activeTab === "retries" && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-text-dark">Configurações de Retry</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Número máximo de tentativas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={retrySettings.max_retries}
                      onChange={(e) => setRetrySettings({...retrySettings, max_retries: parseInt(e.target.value)})}
                      className="input-standard w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Intervalos entre tentativas (horas)
                    </label>
                    <div className="space-y-2">
                      {retrySettings.retry_intervals.map((interval, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm text-text-gray w-16">Retry {index + 1}:</span>
                          <input
                            type="number"
                            min="1"
                            value={interval}
                            onChange={(e) => {
                              const newIntervals = [...retrySettings.retry_intervals]
                              newIntervals[index] = parseInt(e.target.value)
                              setRetrySettings({...retrySettings, retry_intervals: newIntervals})
                            }}
                            className="input-standard flex-1"
                          />
                          <span className="text-sm text-text-gray">horas</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="send_notifications"
                      checked={retrySettings.send_notifications}
                      onChange={(e) => setRetrySettings({...retrySettings, send_notifications: e.target.checked})}
                      className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                    />
                    <label htmlFor="send_notifications" className="text-sm font-medium text-text-dark">
                      Enviar notificações por e-mail
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="auto_generate_links"
                      checked={retrySettings.auto_generate_links}
                      onChange={(e) => setRetrySettings({...retrySettings, auto_generate_links: e.target.checked})}
                      className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                    />
                    <label htmlFor="auto_generate_links" className="text-sm font-medium text-text-dark">
                      Gerar links de pagamento automaticamente
                    </label>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Cronograma de Retry</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Falha inicial → Retry em {retrySettings.retry_intervals[0]}h → 
                          Retry em {retrySettings.retry_intervals[1]}h → 
                          Retry em {retrySettings.retry_intervals[2]}h → Link manual
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-text-dark">Políticas de Reembolso</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allow_partial_refunds"
                      checked={refundPolicies.allow_partial_refunds}
                      onChange={(e) => setRefundPolicies({...refundPolicies, allow_partial_refunds: e.target.checked})}
                      className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                    />
                    <label htmlFor="allow_partial_refunds" className="text-sm font-medium text-text-dark">
                      Permitir reembolsos parciais
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Janela para reembolso da entrada (horas)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={refundPolicies.deposit_refund_window}
                      onChange={(e) => setRefundPolicies({...refundPolicies, deposit_refund_window: parseInt(e.target.value)})}
                      className="input-standard w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Janela para reembolso total (horas)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={refundPolicies.full_refund_window}
                      onChange={(e) => setRefundPolicies({...refundPolicies, full_refund_window: parseInt(e.target.value)})}
                      className="input-standard w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Taxa de cancelamento (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={refundPolicies.cancellation_fee_percentage}
                      onChange={(e) => setRefundPolicies({...refundPolicies, cancellation_fee_percentage: parseInt(e.target.value)})}
                      className="input-standard w-full"
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Regras de Reembolso</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Até {refundPolicies.deposit_refund_window}h: reembolso da entrada</li>
                      <li>• Até {refundPolicies.full_refund_window}h: reembolso total</li>
                      <li>• Após {refundPolicies.full_refund_window}h: taxa de {refundPolicies.cancellation_fee_percentage}%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 