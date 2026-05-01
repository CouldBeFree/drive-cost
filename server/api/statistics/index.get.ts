import { getStatistics, getMonthlyStatistics, getDailyStatistics, getYearlyStatistics } from '~~/server/services/statisticsService'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const vehicleId = query.vehicle_id ? Number(query.vehicle_id) : null
  const month = query.month as string | undefined
  const year = query.year ? Number(query.year) : undefined
  const monthly = query.monthly === 'true'
  const daily = query.daily === 'true'
  const yearly = query.yearly === 'true'

  let startDate: string | undefined
  let endDate: string | undefined

  if (month) {
    // month format: YYYY-MM
    const [yearStr, monthNum] = month.split('-')
    startDate = `${yearStr}-${monthNum}-01`
    // Get last day of month
    const lastDay = new Date(Number(yearStr), Number(monthNum), 0).getDate()
    endDate = `${yearStr}-${monthNum}-${String(lastDay).padStart(2, '0')}`
  } else if (year) {
    // year format: YYYY
    startDate = `${year}-01-01`
    endDate = `${year}-12-31`
  }

  if (yearly) {
    // Return yearly breakdown for all time
    const yearlyStats = await getYearlyStatistics({
      userId: session.user.id,
      vehicleId,
    })
    return { data: yearlyStats }
  } else if (daily && month) {
    // Return daily breakdown for the month
    const dailyStats = await getDailyStatistics({
      userId: session.user.id,
      vehicleId,
      startDate,
      endDate,
    })
    console.log('Daily stats query params:', { userId: session.user.id, vehicleId, startDate, endDate })
    console.log('Daily stats result:', dailyStats)
    return { data: dailyStats }
  } else if (monthly && year) {
    // Return monthly breakdown for the year
    const monthlyStats = await getMonthlyStatistics({
      userId: session.user.id,
      vehicleId,
      startDate,
      endDate,
    })
    return { data: monthlyStats }
  } else {
    // Return aggregated statistics
    const statistics = await getStatistics({
      userId: session.user.id,
      vehicleId,
      startDate,
      endDate,
    })
    return { data: statistics }
  }
})
