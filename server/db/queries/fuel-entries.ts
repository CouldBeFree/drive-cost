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

export async function findFuelEntriesByUser(userId: number, limit?: number, offset?: number): Promise<FuelEntry[]> {
  const params: any[] = [userId]
  let limitClause = ''
  
  if (limit !== undefined) {
    params.push(limit)
    limitClause = `LIMIT $${params.length}`
    
    if (offset !== undefined) {
      params.push(offset)
      limitClause += ` OFFSET $${params.length}`
    }
  }
  
  return query<FuelEntry>(`
    WITH entries_with_prev AS (
      SELECT fe.id, fe.vehicle_id, fe.date, fe.odometer_km, fe.liters, fe.price_per_liter,
             fe.total_cost, fe.is_full_tank, fe.notes, fe.created_at, v.make, v.model,
             LAG(fe.odometer_km) OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as prev_odometer
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE v.user_id = $1
    )
    SELECT id, vehicle_id, date, odometer_km, liters, price_per_liter,
           total_cost, is_full_tank, notes, created_at, make, model,
           CASE 
             WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
             THEN (odometer_km - prev_odometer)
             ELSE NULL
           END as distance_km,
           CASE 
             WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
             THEN ROUND((liters / (odometer_km - prev_odometer) * 100)::numeric, 2)
             ELSE NULL
           END as l_per_100km
    FROM entries_with_prev
    ORDER BY date DESC, odometer_km DESC
    ${limitClause}
  `, params)
}

export async function countFuelEntriesByUser(userId: number): Promise<number> {
  const result = await queryOne<{ count: string }>(`
    SELECT COUNT(*) as count
    FROM fuel_entries fe
    INNER JOIN vehicles v ON fe.vehicle_id = v.id
    WHERE v.user_id = $1
  `, [userId])
  
  return parseInt(result?.count || '0', 10)
}

export async function insertFuelEntry(data: FuelEntryCreate): Promise<FuelEntry | null> {
  return queryOne<FuelEntry>(`
    WITH inserted AS (
      INSERT INTO fuel_entries (vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank, notes, created_at
    ),
    prev_entry AS (
      SELECT odometer_km
      FROM fuel_entries
      WHERE vehicle_id = $1 AND date < $2
      ORDER BY date DESC, odometer_km DESC
      LIMIT 1
    )
    SELECT i.id, i.vehicle_id, i.date, i.odometer_km, i.liters, i.price_per_liter,
           i.total_cost, i.is_full_tank, i.notes, i.created_at, v.make, v.model,
           CASE 
             WHEN p.odometer_km IS NOT NULL AND (i.odometer_km - p.odometer_km) > 0
             THEN (i.odometer_km - p.odometer_km)
             ELSE NULL
           END as distance_km,
           CASE 
             WHEN p.odometer_km IS NOT NULL AND (i.odometer_km - p.odometer_km) > 0
             THEN ROUND((i.liters / (i.odometer_km - p.odometer_km) * 100)::numeric, 2)
             ELSE NULL
           END as l_per_100km
    FROM inserted i
    INNER JOIN vehicles v ON i.vehicle_id = v.id
    LEFT JOIN prev_entry p ON true
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

export async function updateFuelEntry(id: number, data: FuelEntryCreate): Promise<FuelEntry | null> {
  return queryOne<FuelEntry>(`
    WITH updated AS (
      UPDATE fuel_entries
      SET vehicle_id = $2, date = $3, odometer_km = $4, liters = $5, 
          price_per_liter = $6, total_cost = $7, is_full_tank = $8, notes = $9
      WHERE id = $1
      RETURNING id, vehicle_id, date, odometer_km, liters, price_per_liter, total_cost, is_full_tank, notes, created_at
    ),
    prev_entry AS (
      SELECT odometer_km
      FROM fuel_entries
      WHERE vehicle_id = $2 AND date < $3 AND id != $1
      ORDER BY date DESC, odometer_km DESC
      LIMIT 1
    )
    SELECT u.id, u.vehicle_id, u.date, u.odometer_km, u.liters, u.price_per_liter,
           u.total_cost, u.is_full_tank, u.notes, u.created_at, v.make, v.model,
           CASE 
             WHEN p.odometer_km IS NOT NULL AND (u.odometer_km - p.odometer_km) > 0
             THEN (u.odometer_km - p.odometer_km)
             ELSE NULL
           END as distance_km,
           CASE 
             WHEN p.odometer_km IS NOT NULL AND (u.odometer_km - p.odometer_km) > 0
             THEN ROUND((u.liters / (u.odometer_km - p.odometer_km) * 100)::numeric, 2)
             ELSE NULL
           END as l_per_100km
    FROM updated u
    INNER JOIN vehicles v ON u.vehicle_id = v.id
    LEFT JOIN prev_entry p ON true
  `, [
    id,
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

export async function deleteFuelEntry(id: number): Promise<{ id: number } | null> {
  return queryOne<{ id: number }>(`
    DELETE FROM fuel_entries
    WHERE id = $1
    RETURNING id
  `, [id])
}
