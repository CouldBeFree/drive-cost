import { query, queryOne } from '../index'
import type { Vehicle, VehicleCreate } from '~~/app/types'

export async function findAllVehicles(userId: number): Promise<Vehicle[]> {
  return query<Vehicle>(`
    SELECT id, user_id, make, model, year, license_plate, created_at, updated_at
    FROM vehicles
    WHERE user_id = $1
    ORDER BY created_at DESC
  `, [userId])
}

export async function findVehicleById(id: number, userId: number): Promise<Vehicle | null> {
  return queryOne<Vehicle>(`
    SELECT id, user_id, make, model, year, license_plate, created_at, updated_at
    FROM vehicles
    WHERE id = $1 AND user_id = $2
  `, [id, userId])
}

export async function insertVehicle(data: VehicleCreate): Promise<Vehicle | null> {
  return queryOne<Vehicle>(`
    INSERT INTO vehicles (user_id, make, model, year, license_plate)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, make, model, year, license_plate, created_at, updated_at
  `, [data.user_id, data.make, data.model, data.year, data.license_plate])
}

export async function updateVehicle(id: number, userId: number, data: Partial<VehicleCreate>): Promise<Vehicle | null> {
  return queryOne<Vehicle>(`
    UPDATE vehicles
    SET make = $3, model = $4, year = $5, license_plate = $6, updated_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING id, user_id, make, model, year, license_plate, created_at, updated_at
  `, [id, userId, data.make, data.model, data.year, data.license_plate])
}

export async function deleteVehicle(id: number, userId: number): Promise<boolean> {
  const result = await query(`
    DELETE FROM vehicles WHERE id = $1 AND user_id = $2 RETURNING id
  `, [id, userId])
  return result.length > 0
}
