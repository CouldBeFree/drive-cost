import { createVehicle } from '~~/server/services/vehicleService'
import type { VehicleCreate } from '~~/app/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<Omit<VehicleCreate, 'user_id'>>(event)

  if (!body.make || !body.model || !body.year || !body.license_plate) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: make, model, year, license_plate' })
  }

  const vehicleData: VehicleCreate = {
    user_id: session.user.id,
    make: body.make,
    model: body.model,
    year: body.year,
    license_plate: body.license_plate,
  }

  const vehicle = await createVehicle(vehicleData)
  return { data: vehicle }
})
