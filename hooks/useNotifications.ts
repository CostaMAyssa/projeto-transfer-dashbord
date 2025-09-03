import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Reservation = Database['public']['Tables']['reservations']['Row']

export interface Notification {
  id: string
  type: 'new_reservation' | 'payment_received' | 'booking_update'
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Buscar notificações existentes
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Buscar reservas recentes (últimas 24 horas)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (error) throw error
      
      // Converter reservas em notificações
      const newNotifications: Notification[] = reservations?.map(reservation => ({
        id: `reservation-${reservation.id}`,
        type: 'new_reservation' as const,
        title: 'Nova Reserva',
        message: `Reserva ${reservation.reservation_number} - ${reservation.customer_name}`,
        data: reservation,
        read: false,
        created_at: reservation.created_at
      })) || []
      
      setNotifications(newNotifications)
      setUnreadCount(newNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Marcar notificação como lida
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }, [])

  // Limpar notificações
  const clearNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Configurar subscription para novas reservas
  useEffect(() => {
    fetchNotifications()

    // Subscription para mudanças em tempo real
    const subscription = supabase
      .channel('reservations-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations'
        },
        (payload) => {
          const newReservation = payload.new as Reservation
          const newNotification: Notification = {
            id: `reservation-${newReservation.id}`,
            type: 'new_reservation',
            title: 'Nova Reserva',
            message: `Reserva ${newReservation.reservation_number} - ${newReservation.customer_name}`,
            data: newReservation,
            read: false,
            created_at: newReservation.created_at
          }
          
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refresh: fetchNotifications
  }
}

// Hook para notificações específicas de reservas
export function useReservationNotifications() {
  const [newReservations, setNewReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNewReservations = async () => {
      try {
        setIsLoading(true)
        
        // Buscar reservas das últimas 2 horas
        const twoHoursAgo = new Date()
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2)
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .gte('created_at', twoHoursAgo.toISOString())
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setNewReservations(data || [])
      } catch (error) {
        console.error('Erro ao buscar novas reservas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewReservations()

    // Subscription para novas reservas
    const subscription = supabase
      .channel('new-reservations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations'
        },
        (payload) => {
          const newReservation = payload.new as Reservation
          setNewReservations(prev => [newReservation, ...prev])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    newReservations,
    isLoading,
    count: newReservations.length
  }
}