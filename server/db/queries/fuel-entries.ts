import { query, queryOne } from '../index'
import type { FuelEntry, FuelEntryCreate } from '~~/app/types'

export async function findFuelEntriesByVehicle(vehicleId: number): Promise<FuelEntry[]> {
  return query<FuelEntry>(`
    SELECT id, vehicle_id, date, odometer_km, liters, price_per_liter,
           total_cost, is_full_tank, notes, created_at
    FROM fuel_entries
    WHERE vehicle_id = $1
    ORDER BY date DESC, odometer_km DESC
  `, [vehicleId])
}

export async function findAllFuelEntries(): Promise<FuelEntry[]> {
  return query<FuelEntry>(`
    SELECT id, vehicle_id, date, odometer_km, liters, price_per_liter,
           total_cost, is_full_tank, notes, created_at
    FROM fuel_entries
    ORDER BY date DESC, odometer_km DESC
  `)
}

export async function insertFuelEntry(data: FuelEntryCreate): Promise<FuelEntry | null> {
  return queryOne<FuelEntry>(`
    INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank, notes, created_at
  `, [
    data.vehicle_id,
    data.date,
    data.odometer_km,
    data.liters,
    data.price_per_liter,
    data.total_cost,
    data.is_full_tank,
    data.notes ?? null,
  ])
}
