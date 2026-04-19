import { findAllFuelEntries, findFuelEntriesByVehicle, insertFuelEntry } from '../db/queries/fuel-entries'
import type { FuelEntry, FuelEntryCreate } from '~~/app/types'

export async function getAllFuelEntries(): Promise<FuelEntry[]> {
  return findAllFuelEntries()
}

export async function getFuelEntriesByVehicle(vehicleId: number): Promise<FuelEntry[]> {
  return findFuelEntriesByVehicle(vehicleId)
}

export async function createFuelEntry(data: FuelEntryCreate): Promise<FuelEntry> {
  const entry = await insertFuelEntry(data)
  if (!entry) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create fuel entry' })
  }
  return entry
}
