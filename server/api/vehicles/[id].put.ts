import { editVehicle } from '~~/server/services/vehicleService'
import { parseId } from '~~/server/utils/validate'
import type { VehicleCreate } from '~~/app/types'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id
  const id = parseId(getRouterParam(event, 'id'))
  const body = await readBody<VehicleCreate>(event)

  if (!body.make || !body.model || !body.year) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: make, model, year' })
  }

  const vehicle = await editVehicle(id, userId, body)
  return { data: vehicle }
})
