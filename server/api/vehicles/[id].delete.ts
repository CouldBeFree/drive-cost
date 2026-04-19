import { removeVehicle } from '~~/server/services/vehicleService'
import { parseId } from '~~/server/utils/validate'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id
  const id = parseId(getRouterParam(event, 'id'))
  await removeVehicle(id, userId)
  return { data: { success: true } }
})
