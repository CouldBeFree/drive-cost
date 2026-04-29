export interface User {
  id: number
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserCreate {
  email: string
  password: string
  name: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface Vehicle {
  id: number
  user_id: number
  make: string
  model: string
  year: number
  license_plate: string
  created_at: string
  updated_at: string
}

export interface VehicleCreate {
  user_id: number
  make: string
  model: string
  year: number
  license_plate: string
}

export interface FuelEntry {
  id: number
  vehicle_id: number
  date: string
  odometer_km: number
  liters: number
  price_per_liter: number
  total_cost: number
  is_full_tank: boolean
  notes: string | null
  created_at: string
  make?: string
  model?: string
  distance_km?: number
  l_per_100km?: number
}

export interface FuelEntryCreate {
  vehicle_id: number
  date: string
  odometer_km: number
  liters: number
  price_per_liter: number
  total_cost: number
  is_full_tank: boolean
  notes?: string
}

export interface FuelConsumption {
  liters_per_100km: number
  cost_per_km: number
  total_distance_km: number
  total_liters: number
  total_cost: number
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
