import {
  insertFuelEntry,
  updateFuelEntry as updateFuelEntryQuery,
  deleteFuelEntry as deleteFuelEntryQuery,
} from '../db/queries/fuel-entries'
import type { FuelEntry, FuelEntryCreate } from '~~/app/types'

export async function createFuelEntry(data: FuelEntryCreate): Promise<FuelEntry> {
  const entry = await insertFuelEntry(data)
  if (!entry) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create fuel entry' })
  }
  return entry
}

export async function updateFuelEntry(id: number, data: FuelEntryCreate): Promise<FuelEntry> {
  const entry = await updateFuelEntryQuery(id, data)
  if (!entry) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update fuel entry' })
  }
  return entry
}

export async function deleteFuelEntry(id: number): Promise<void> {
  const result = await deleteFuelEntryQuery(id)
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Fuel entry not found' })
  }
}
