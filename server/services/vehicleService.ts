import {
  findAllVehicles,
  findVehicleById,
  insertVehicle,
  updateVehicle,
  deleteVehicle,
} from '../db/queries/vehicles'
import type { Vehicle, VehicleCreate } from '~~/app/types'

export async function getAllVehicles(userId: number): Promise<Vehicle[]> {
  return findAllVehicles(userId)
}

export async function getVehicleById(id: number, userId: number): Promise<Vehicle | null> {
  return findVehicleById(id, userId)
}

export async function createVehicle(data: VehicleCreate): Promise<Vehicle> {
  const vehicle = await insertVehicle(data)
  if (!vehicle) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create vehicle' })
  }
  return vehicle
}

export async function editVehicle(id: number, userId: number, data: Partial<VehicleCreate>): Promise<Vehicle> {
  const existing = await findVehicleById(id, userId)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Vehicle not found' })
  }

  const vehicle = await updateVehicle(id, userId, data)
  if (!vehicle) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update vehicle' })
  }
  return vehicle
}

export async function removeVehicle(id: number, userId: number): Promise<void> {
  const deleted = await deleteVehicle(id, userId)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Vehicle not found' })
  }
}
