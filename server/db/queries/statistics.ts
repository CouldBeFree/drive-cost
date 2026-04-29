import { query } from '../index'

interface StatisticsParams {
  userId: number
  vehicleId?: number | null
  startDate?: string
  endDate?: string
}

interface StatisticsResult {
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
  total_fuel: number | null
  total_cost: number | null
}

export async function calculateStatistics(params: StatisticsParams): Promise<StatisticsResult> {
  const { userId, vehicleId, startDate, endDate } = params
  
  let whereConditions = ['v.user_id = $1']
  const queryParams: any[] = [userId]
  let paramIndex = 2

  if (vehicleId) {
    whereConditions.push(`fe.vehicle_id = $${paramIndex}`)
    queryParams.push(vehicleId)
    paramIndex++
  }

  if (startDate && endDate) {
    whereConditions.push(`fe.date >= $${paramIndex}`)
    queryParams.push(startDate)
    paramIndex++
    whereConditions.push(`fe.date <= $${paramIndex}`)
    queryParams.push(endDate)
    paramIndex++
  }

  const whereClause = whereConditions.join(' AND ')

  const result = await query<StatisticsResult>(`
    WITH entries_with_prev AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        LAG(fe.odometer_km) OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as prev_odometer
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    calculated AS (
      SELECT 
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (odometer_km - prev_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (liters / (odometer_km - prev_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (total_cost / (odometer_km - prev_odometer))
          ELSE NULL
        END as cost_per_km,
        liters,
        total_cost
      FROM entries_with_prev
    )
    SELECT 
      ROUND(AVG(l_per_100km)::numeric, 2) as avg_consumption,
      ROUND(AVG(cost_per_km)::numeric, 2) as avg_cost_per_km,
      SUM(distance_km) as total_distance,
      ROUND(SUM(liters)::numeric, 2) as total_fuel,
      ROUND(SUM(total_cost)::numeric, 2) as total_cost
    FROM calculated
    WHERE distance_km IS NOT NULL
  `, queryParams)

  return result[0] || {
    avg_consumption: null,
    avg_cost_per_km: null,
    total_distance: null,
    total_fuel: null,
    total_cost: null,
  }
}

interface MonthlyStatisticsResult {
  month: number
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
}

export async function calculateMonthlyStatistics(params: StatisticsParams): Promise<MonthlyStatisticsResult[]> {
  const { userId, vehicleId, startDate, endDate } = params
  
  let whereConditions = ['v.user_id = $1']
  const queryParams: any[] = [userId]
  let paramIndex = 2

  if (vehicleId) {
    whereConditions.push(`fe.vehicle_id = $${paramIndex}`)
    queryParams.push(vehicleId)
    paramIndex++
  }

  if (startDate && endDate) {
    whereConditions.push(`fe.date >= $${paramIndex}`)
    queryParams.push(startDate)
    paramIndex++
    whereConditions.push(`fe.date <= $${paramIndex}`)
    queryParams.push(endDate)
    paramIndex++
  }

  const whereClause = whereConditions.join(' AND ')

  const result = await query<MonthlyStatisticsResult>(`
    WITH entries_with_prev AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        EXTRACT(MONTH FROM fe.date)::INTEGER as month,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        LAG(fe.odometer_km) OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as prev_odometer
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    calculated AS (
      SELECT 
        month,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (odometer_km - prev_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (liters / (odometer_km - prev_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (total_cost / (odometer_km - prev_odometer))
          ELSE NULL
        END as cost_per_km
      FROM entries_with_prev
    )
    SELECT 
      month,
      ROUND(AVG(l_per_100km)::numeric, 2) as avg_consumption,
      ROUND(AVG(cost_per_km)::numeric, 2) as avg_cost_per_km,
      SUM(distance_km) as total_distance
    FROM calculated
    WHERE distance_km IS NOT NULL
    GROUP BY month
    ORDER BY month
  `, queryParams)

  return result
}

interface DailyStatisticsResult {
  day: number
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
}

export async function calculateDailyStatistics(params: StatisticsParams): Promise<DailyStatisticsResult[]> {
  const { userId, vehicleId, startDate, endDate } = params
  
  let whereConditions = ['v.user_id = $1']
  const queryParams: any[] = [userId]
  let paramIndex = 2

  if (vehicleId) {
    whereConditions.push(`fe.vehicle_id = $${paramIndex}`)
    queryParams.push(vehicleId)
    paramIndex++
  }

  if (startDate && endDate) {
    whereConditions.push(`fe.date >= $${paramIndex}`)
    queryParams.push(startDate)
    paramIndex++
    whereConditions.push(`fe.date <= $${paramIndex}`)
    queryParams.push(endDate)
    paramIndex++
  }

  const whereClause = whereConditions.join(' AND ')

  const result = await query<DailyStatisticsResult>(`
    WITH entries_with_prev AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        EXTRACT(DAY FROM fe.date)::INTEGER as day,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        LAG(fe.odometer_km) OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as prev_odometer
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    calculated AS (
      SELECT 
        day,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (odometer_km - prev_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (liters / (odometer_km - prev_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (total_cost / (odometer_km - prev_odometer))
          ELSE NULL
        END as cost_per_km
      FROM entries_with_prev
    )
    SELECT 
      day,
      ROUND(AVG(l_per_100km)::numeric, 2) as avg_consumption,
      ROUND(AVG(cost_per_km)::numeric, 2) as avg_cost_per_km,
      SUM(distance_km) as total_distance
    FROM calculated
    WHERE distance_km IS NOT NULL
    GROUP BY day
    ORDER BY day
  `, queryParams)

  return result
}

interface YearlyStatisticsResult {
  year: number
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
}

export async function calculateYearlyStatistics(params: StatisticsParams): Promise<YearlyStatisticsResult[]> {
  const { userId, vehicleId } = params
  
  let whereConditions = ['v.user_id = $1']
  const queryParams: any[] = [userId]
  let paramIndex = 2

  if (vehicleId) {
    whereConditions.push(`fe.vehicle_id = $${paramIndex}`)
    queryParams.push(vehicleId)
    paramIndex++
  }

  const whereClause = whereConditions.join(' AND ')

  const result = await query<YearlyStatisticsResult>(`
    WITH entries_with_prev AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        EXTRACT(YEAR FROM fe.date)::INTEGER as year,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        LAG(fe.odometer_km) OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as prev_odometer
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    calculated AS (
      SELECT 
        year,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (odometer_km - prev_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (liters / (odometer_km - prev_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN prev_odometer IS NOT NULL AND (odometer_km - prev_odometer) > 0
          THEN (total_cost / (odometer_km - prev_odometer))
          ELSE NULL
        END as cost_per_km
      FROM entries_with_prev
    )
    SELECT 
      year,
      ROUND(AVG(l_per_100km)::numeric, 2) as avg_consumption,
      ROUND(AVG(cost_per_km)::numeric, 2) as avg_cost_per_km,
      SUM(distance_km) as total_distance
    FROM calculated
    WHERE distance_km IS NOT NULL
    GROUP BY year
    ORDER BY year
  `, queryParams)

  return result
}
