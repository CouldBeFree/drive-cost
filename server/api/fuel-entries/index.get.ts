import { getFuelEntriesByUser, getFuelEntriesByVehicle, getTotalFuelEntriesByUser } from '~~/server/services/fuelEntryService'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const vehicleId = query.vehicle_id ? Number(query.vehicle_id) : null
  const page = query.page ? Number(query.page) : 1
  const limit = query.limit ? Number(query.limit) : 10
  const offset = (page - 1) * limit

  const entries = vehicleId
    ? await getFuelEntriesByVehicle(vehicleId)
    : await getFuelEntriesByUser(session.user.id, limit, offset)

  const total = vehicleId ? entries.length : await getTotalFuelEntriesByUser(session.user.id)
  const totalPages = Math.ceil(total / limit)

  return { 
    data: entries,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }
})
