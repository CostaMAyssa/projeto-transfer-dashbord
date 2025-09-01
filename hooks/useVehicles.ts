import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

export type Vehicle = {
  id: string
  name: string
  type: string
  passengers: number
  luggage: number
  year: number | null
  license_plate: string | null
  status: 'active' | 'maintenance' | 'inactive'
  image_url: string | null
  created_at: string | null
  updated_at: string | null
}

export type VehicleInsert = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>

export function useVehicles() {
  return useSWR('vehicles', async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar veículos:', error)
      throw error
    }
    return data as Vehicle[]
  })
}

export function useVehicle(id: string) {
  return useSWR(id ? `vehicle-${id}` : null, async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar veículo:', error)
      throw error
    }
    return data as Vehicle
  })
}

export async function createVehicle(vehicle: Partial<VehicleInsert>) {
  try {
    // Garantir que todos os campos obrigatórios estejam presentes
    if (!vehicle.name || !vehicle.type || !vehicle.passengers || !vehicle.luggage || !vehicle.status) {
      throw new Error('Campos obrigatórios faltando')
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([
        {
          name: vehicle.name,
          type: vehicle.type,
          passengers: vehicle.passengers,
          luggage: vehicle.luggage,
          year: vehicle.year || null,
          license_plate: vehicle.license_plate || null,
          status: vehicle.status,
          image_url: vehicle.image_url || null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar veículo:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro ao criar veículo:', error)
    throw error
  }
}

export async function updateVehicle(id: string, vehicle: Partial<VehicleInsert>) {
  const { data, error } = await supabase
    .from('vehicles')
    .update({
      name: vehicle.name,
      type: vehicle.type,
      passengers: vehicle.passengers,
      luggage: vehicle.luggage,
      year: vehicle.year || null,
      license_plate: vehicle.license_plate || null,
      status: vehicle.status,
      image_url: vehicle.image_url || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar veículo:', error)
    throw error
  }

  return data
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar veículo:', error)
    throw error
  }
} 