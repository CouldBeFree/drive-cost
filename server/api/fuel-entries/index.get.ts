import { findFuelEntriesByUser } from '~~/server/db/queries/fuel-entries'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const vehicleId = query.vehicle_id ? Number(query.vehicle_id) : undefined
  const dateFrom = query.date_from ? String(query.date_from) : undefined
  const dateTo = query.date_to ? String(query.date_to) : undefined
  const page = query.page ? Number(query.page) : 1
  const limit = query.limit ? Number(query.limit) : 10
  const offset = (page - 1) * limit

  const result = await findFuelEntriesByUser(session.user.id, limit, offset, vehicleId, dateFrom, dateTo)

  return { 
    data: result.entries,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    }
  }
})
