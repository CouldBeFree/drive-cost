import { deleteFuelEntry } from '~~/server/services/fuelEntryService'
import { queryOne } from '~~/server/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid fuel entry ID' })
  }

  // Verify ownership through vehicle
  const entry = await queryOne<{ vehicle_id: number }>(`
    SELECT fe.vehicle_id
    FROM fuel_entries fe
    INNER JOIN vehicles v ON fe.vehicle_id = v.id
    WHERE fe.id = $1 AND v.user_id = $2
  `, [id, session.user.id])

  if (!entry) {
    throw createError({ statusCode: 403, statusMessage: 'Fuel entry not found or access denied' })
  }

  await deleteFuelEntry(id)
  return { success: true }
})
