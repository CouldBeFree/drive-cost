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
    WITH ranked_entries AS (
      SELECT fe.id, fe.vehicle_id, fe.date, fe.odometer_km, fe.liters, fe.price_per_liter,
             fe.total_cost, fe.is_full_tank, fe.notes, fe.created_at, v.make, v.model,
             ROW_NUMBER() OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as rn
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE v.user_id = $1
    ),
    full_tank_groups AS (
      SELECT *,
             SUM(CASE WHEN is_full_tank THEN 1 ELSE 0 END) 
               OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as full_tank_group
      FROM ranked_entries
    ),
    prev_full_tank AS (
      SELECT vehicle_id, date, odometer_km, full_tank_group,
             LAG(odometer_km) OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km) as prev_full_odometer
      FROM full_tank_groups
      WHERE is_full_tank = true
    ),
    consumption_calc AS (
      SELECT ftg.id, ftg.vehicle_id, ftg.date, ftg.odometer_km, ftg.liters, ftg.price_per_liter,
             ftg.total_cost, ftg.is_full_tank, ftg.notes, ftg.created_at, ftg.make, ftg.model,
             pft.prev_full_odometer,
             SUM(ftg.liters) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_liters_in_group
      FROM full_tank_groups ftg
      LEFT JOIN prev_full_tank pft ON ftg.vehicle_id = pft.vehicle_id 
        AND ftg.date = pft.date 
        AND ftg.odometer_km = pft.odometer_km
    )
    SELECT id, vehicle_id, date, odometer_km, liters, price_per_liter,
           total_cost, is_full_tank, notes, created_at, make, model,
           CASE 
             WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
             THEN (odometer_km - prev_full_odometer)
             ELSE NULL
           END as distance_km,
           CASE 
             WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
             THEN ROUND((total_liters_in_group / (odometer_km - prev_full_odometer) * 100)::numeric, 2)
             ELSE NULL
           END as l_per_100km
    FROM consumption_calc
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
    prev_full_tank AS (
      SELECT odometer_km
      FROM fuel_entries
      WHERE vehicle_id = $1 
        AND is_full_tank = true
        AND (date < $2 OR (date = $2 AND odometer_km < $3))
      ORDER BY date DESC, odometer_km DESC
      LIMIT 1
    ),
    liters_sum AS (
      SELECT COALESCE(SUM(liters), 0) + $4 as total_liters
      FROM fuel_entries
      WHERE vehicle_id = $1
        AND (date > (SELECT COALESCE(MAX(date), '1900-01-01') FROM fuel_entries WHERE vehicle_id = $1 AND is_full_tank = true AND (date < $2 OR (date = $2 AND odometer_km < $3))))
        AND (date < $2 OR (date = $2 AND odometer_km < $3))
    )
    SELECT i.id, i.vehicle_id, i.date, i.odometer_km, i.liters, i.price_per_liter,
           i.total_cost, i.is_full_tank, i.notes, i.created_at, v.make, v.model,
           CASE 
             WHEN i.is_full_tank = true AND p.odometer_km IS NOT NULL AND (i.odometer_km - p.odometer_km) > 0
             THEN (i.odometer_km - p.odometer_km)
             ELSE NULL
           END as distance_km,
           CASE 
             WHEN i.is_full_tank = true AND p.odometer_km IS NOT NULL AND (i.odometer_km - p.odometer_km) > 0
             THEN ROUND((ls.total_liters / (i.odometer_km - p.odometer_km) * 100)::numeric, 2)
             ELSE NULL
           END as l_per_100km
    FROM inserted i
    INNER JOIN vehicles v ON i.vehicle_id = v.id
    LEFT JOIN prev_full_tank p ON true
    CROSS JOIN liters_sum ls
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
    prev_full_tank AS (
      SELECT odometer_km
      FROM fuel_entries
      WHERE vehicle_id = $2 
        AND is_full_tank = true
        AND id != $1
        AND (date < $3 OR (date = $3 AND odometer_km < $4))
      ORDER BY date DESC, odometer_km DESC
      LIMIT 1
    ),
    liters_sum AS (
      SELECT COALESCE(SUM(liters), 0) + $5 as total_liters
      FROM fuel_entries
      WHERE vehicle_id = $2
        AND id != $1
        AND (date > (SELECT COALESCE(MAX(date), '1900-01-01') FROM fuel_entries WHERE vehicle_id = $2 AND is_full_tank = true AND id != $1 AND (date < $3 OR (date = $3 AND odometer_km < $4))))
        AND (date < $3 OR (date = $3 AND odometer_km < $4))
    )
    SELECT u.id, u.vehicle_id, u.date, u.odometer_km, u.liters, u.price_per_liter,
           u.total_cost, u.is_full_tank, u.notes, u.created_at, v.make, v.model,
           CASE 
             WHEN u.is_full_tank = true AND p.odometer_km IS NOT NULL AND (u.odometer_km - p.odometer_km) > 0
             THEN (u.odometer_km - p.odometer_km)
             ELSE NULL
           END as distance_km,
           CASE 
             WHEN u.is_full_tank = true AND p.odometer_km IS NOT NULL AND (u.odometer_km - p.odometer_km) > 0
             THEN ROUND((ls.total_liters / (u.odometer_km - p.odometer_km) * 100)::numeric, 2)
             ELSE NULL
           END as l_per_100km
    FROM updated u
    INNER JOIN vehicles v ON u.vehicle_id = v.id
    LEFT JOIN prev_full_tank p ON true
    CROSS JOIN liters_sum ls
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
