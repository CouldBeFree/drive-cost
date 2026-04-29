import { updateFuelEntry } from '~~/server/services/fuelEntryService'
import { findVehicleById } from '~~/server/db/queries/vehicles'
import type { FuelEntryCreate } from '~~/app/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid fuel entry ID' })
  }

  const body = await readBody<FuelEntryCreate>(event)

  if (!body.vehicle_id || !body.date || !body.odometer_km || !body.liters || !body.price_per_liter) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const vehicle = await findVehicleById(body.vehicle_id, session.user.id)
  if (!vehicle) {
    throw createError({ statusCode: 403, statusMessage: 'Vehicle not found or access denied' })
  }

  const entry = await updateFuelEntry(id, {
    ...body,
    is_full_tank: body.is_full_tank ?? true,
  })
  return { data: entry }
})
