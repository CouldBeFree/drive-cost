import { getVehicleById } from '~~/server/services/vehicleService'
import { parseId } from '~~/server/utils/validate'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = parseId(getRouterParam(event, 'id'))
  const vehicle = await getVehicleById(id, session.user.id)

  if (!vehicle) {
    throw createError({ statusCode: 404, statusMessage: 'Vehicle not found' })
  }

  return { data: vehicle }
})
