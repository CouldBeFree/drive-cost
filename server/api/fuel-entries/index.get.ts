import { getFuelEntriesByUser, getFuelEntriesByVehicle } from '~~/server/services/fuelEntryService'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const vehicleId = query.vehicle_id ? Number(query.vehicle_id) : null

  const entries = vehicleId
    ? await getFuelEntriesByVehicle(vehicleId)
    : await getFuelEntriesByUser(session.user.id)

  return { data: entries }
})
