import { createFuelEntry } from '~~/server/services/fuelEntryService'
import type { FuelEntryCreate } from '~~/app/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<FuelEntryCreate>(event)

  if (!body.vehicle_id || !body.date || !body.odometer_km || !body.liters || !body.price_per_liter) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const entry = await createFuelEntry(body)
  return { data: entry }
})
