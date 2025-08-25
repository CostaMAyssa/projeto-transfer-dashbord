'use client';

import React, { useState } from 'react';
import { X, Calendar, Filter, Plus, Phone, Mail, FileText, CreditCard, MapPin } from 'lucide-react';
import { useClientInteractions, createClientInteraction, type ClientInteraction } from '@/hooks/useClientInteractions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientHistoryPopupProps {
  client: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    last_interaction?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const interactionTypeLabels = {
  quote: 'Cotação',
  reservation: 'Reserva',
  call: 'Ligação',
  email: 'E-mail',
  note: 'Anotação'
};

const interactionTypeIcons = {
  quote: FileText,
  reservation: MapPin,
  call: Phone,
  email: Mail,
  note: FileText
};

const statusLabels = {
  draft: 'Rascunho',
  sent: 'Enviado',
  accepted: 'Aceito',
  rejected: 'Rejeitado',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
  pending: 'Pendente'
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

export default function ClientHistoryPopup({ client, isOpen, onClose }: ClientHistoryPopupProps) {
  const { interactions, isLoading, mutate } = useClientInteractions(client.id);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    interaction_type: 'note' as const,
    description: '',
    status: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredInteractions = interactions.filter(interaction => {
    if (typeFilter !== 'all' && interaction.interaction_type !== typeFilter) {
      return false;
    }
    
    if (dateFilter !== 'all') {
      const interactionDate = new Date(interaction.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return interactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return interactionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return interactionDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  const handleAddInteraction = async () => {
    if (!newInteraction.description.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createClientInteraction({
        client_id: client.id,
        interaction_type: newInteraction.interaction_type,
        description: newInteraction.description,
        status: newInteraction.status || undefined,
        created_by: 'admin@example.com' // TODO: pegar do contexto de autenticação
      });
      
      setNewInteraction({
        interaction_type: 'note',
        description: '',
        status: ''
      });
      setShowAddForm(false);
      mutate(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao adicionar interação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getLastInteractionDate = () => {
    if (interactions.length === 0) return 'Nenhuma interação';
    return formatDate(interactions[0].created_at);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cliente: {client.full_name}</h2>
            <div className="text-sm text-gray-600 mt-1">
              <p>Email: {client.email}</p>
              <p>Telefone: {client.phone}</p>
              <p>Última Interação: {getLastInteractionDate()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="quote">Cotações</option>
                  <option value="reservation">Reservas</option>
                  <option value="call">Ligações</option>
                  <option value="email">E-mails</option>
                  <option value="note">Anotações</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Todo o período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mês</option>
                </select>
              </div>
            </div>

            {/* Add Interaction Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Adicionar Interação
            </button>
          </div>

          {/* Add Interaction Form */}
          {showAddForm && (
            <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={newInteraction.interaction_type}
                    onChange={(e) => setNewInteraction(prev => ({ 
                      ...prev, 
                      interaction_type: e.target.value as any 
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="note">Anotação</option>
                    <option value="call">Ligação</option>
                    <option value="email">E-mail</option>
                    <option value="quote">Cotação</option>
                    <option value="reservation">Reserva</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status (opcional)
                  </label>
                  <input
                    type="text"
                    value={newInteraction.status}
                    onChange={(e) => setNewInteraction(prev => ({ 
                      ...prev, 
                      status: e.target.value 
                    }))}
                    placeholder="ex: completed, pending"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={newInteraction.description}
                    onChange={(e) => setNewInteraction(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                    placeholder="Descreva a interação..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddInteraction}
                  disabled={isSubmitting || !newInteraction.description.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interactions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Histórico de Interações ({filteredInteractions.length})
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando interações...</p>
              </div>
            ) : filteredInteractions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma interação encontrada.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInteractions.map((interaction) => {
                  const Icon = interactionTypeIcons[interaction.interaction_type];
                  return (
                    <div key={interaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {interactionTypeLabels[interaction.interaction_type]}
                            </span>
                            {interaction.status && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[interaction.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                              }`}>
                                {statusLabels[interaction.status as keyof typeof statusLabels] || interaction.status}
                              </span>
                            )}
                            {interaction.reference_display && (
                              <span className="text-xs text-gray-500">
                                #{interaction.reference_display}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {interaction.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDate(interaction.created_at)}</span>
                            {interaction.created_by && (
                              <span>por {interaction.created_by}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}