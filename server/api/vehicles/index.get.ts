import { getAllVehicles } from '~~/server/services/vehicleService'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const vehicles = await getAllVehicles(session.user.id)
  return { data: vehicles }
})
