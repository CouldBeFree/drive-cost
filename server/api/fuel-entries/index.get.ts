import { getAllFuelEntries, getFuelEntriesByVehicle } from '~~/server/services/fuelEntryService'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const vehicleId = query.vehicle_id ? Number(query.vehicle_id) : null

  const entries = vehicleId
    ? await getFuelEntriesByVehicle(vehicleId)
    : await getAllFuelEntries()

  return { data: entries }
})
