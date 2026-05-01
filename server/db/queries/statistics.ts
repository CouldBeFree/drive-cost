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
    WITH ranked_entries AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        fe.is_full_tank,
        ROW_NUMBER() OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as rn
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    full_tank_groups AS (
      SELECT *,
             SUM(CASE WHEN is_full_tank THEN 1 ELSE 0 END) 
               OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as full_tank_group
      FROM ranked_entries
    ),
    prev_full_tank AS (
      SELECT vehicle_id, date, odometer_km, full_tank_group,
             LAG(odometer_km) OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km) as prev_full_odometer
      FROM full_tank_groups
      WHERE is_full_tank = true
    ),
    consumption_calc AS (
      SELECT ftg.id, ftg.vehicle_id, ftg.date, ftg.odometer_km, ftg.liters, ftg.price_per_liter,
             ftg.total_cost, ftg.is_full_tank,
             pft.prev_full_odometer,
             SUM(ftg.liters) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_liters_in_group,
             SUM(ftg.total_cost) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_cost_in_group
      FROM full_tank_groups ftg
      LEFT JOIN prev_full_tank pft ON ftg.vehicle_id = pft.vehicle_id 
        AND ftg.date = pft.date 
        AND ftg.odometer_km = pft.odometer_km
    ),
    calculated AS (
      SELECT 
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (odometer_km - prev_full_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_liters_in_group / (odometer_km - prev_full_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_cost_in_group / (odometer_km - prev_full_odometer))
          ELSE NULL
        END as cost_per_km,
        liters,
        total_cost
      FROM consumption_calc
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
    WITH ranked_entries AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        EXTRACT(MONTH FROM fe.date)::INTEGER as month,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        fe.is_full_tank,
        ROW_NUMBER() OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as rn
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    full_tank_groups AS (
      SELECT *,
             SUM(CASE WHEN is_full_tank THEN 1 ELSE 0 END) 
               OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as full_tank_group
      FROM ranked_entries
    ),
    prev_full_tank AS (
      SELECT vehicle_id, date, odometer_km, full_tank_group,
             LAG(odometer_km) OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km) as prev_full_odometer
      FROM full_tank_groups
      WHERE is_full_tank = true
    ),
    consumption_calc AS (
      SELECT ftg.month, ftg.odometer_km, ftg.is_full_tank,
             pft.prev_full_odometer,
             SUM(ftg.liters) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_liters_in_group,
             SUM(ftg.total_cost) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_cost_in_group
      FROM full_tank_groups ftg
      LEFT JOIN prev_full_tank pft ON ftg.vehicle_id = pft.vehicle_id 
        AND ftg.date = pft.date 
        AND ftg.odometer_km = pft.odometer_km
    ),
    calculated AS (
      SELECT 
        month,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (odometer_km - prev_full_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_liters_in_group / (odometer_km - prev_full_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_cost_in_group / (odometer_km - prev_full_odometer))
          ELSE NULL
        END as cost_per_km
      FROM consumption_calc
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
    WITH ranked_entries AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        EXTRACT(DAY FROM fe.date)::INTEGER as day,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        fe.is_full_tank,
        ROW_NUMBER() OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as rn
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    full_tank_groups AS (
      SELECT *,
             SUM(CASE WHEN is_full_tank THEN 1 ELSE 0 END) 
               OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as full_tank_group
      FROM ranked_entries
    ),
    prev_full_tank AS (
      SELECT vehicle_id, date, odometer_km, full_tank_group,
             LAG(odometer_km) OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km) as prev_full_odometer
      FROM full_tank_groups
      WHERE is_full_tank = true
    ),
    consumption_calc AS (
      SELECT ftg.day, ftg.odometer_km, ftg.is_full_tank,
             pft.prev_full_odometer,
             SUM(ftg.liters) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_liters_in_group,
             SUM(ftg.total_cost) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_cost_in_group
      FROM full_tank_groups ftg
      LEFT JOIN prev_full_tank pft ON ftg.vehicle_id = pft.vehicle_id 
        AND ftg.date = pft.date 
        AND ftg.odometer_km = pft.odometer_km
    ),
    calculated AS (
      SELECT 
        day,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (odometer_km - prev_full_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_liters_in_group / (odometer_km - prev_full_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_cost_in_group / (odometer_km - prev_full_odometer))
          ELSE NULL
        END as cost_per_km
      FROM consumption_calc
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
    WITH ranked_entries AS (
      SELECT 
        fe.id,
        fe.vehicle_id,
        fe.date,
        EXTRACT(YEAR FROM fe.date)::INTEGER as year,
        fe.odometer_km,
        fe.liters,
        fe.price_per_liter,
        fe.total_cost,
        fe.is_full_tank,
        ROW_NUMBER() OVER (PARTITION BY fe.vehicle_id ORDER BY fe.date, fe.odometer_km) as rn
      FROM fuel_entries fe
      INNER JOIN vehicles v ON fe.vehicle_id = v.id
      WHERE ${whereClause}
    ),
    full_tank_groups AS (
      SELECT *,
             SUM(CASE WHEN is_full_tank THEN 1 ELSE 0 END) 
               OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as full_tank_group
      FROM ranked_entries
    ),
    prev_full_tank AS (
      SELECT vehicle_id, date, odometer_km, full_tank_group,
             LAG(odometer_km) OVER (PARTITION BY vehicle_id ORDER BY date, odometer_km) as prev_full_odometer
      FROM full_tank_groups
      WHERE is_full_tank = true
    ),
    consumption_calc AS (
      SELECT ftg.year, ftg.odometer_km, ftg.is_full_tank,
             pft.prev_full_odometer,
             SUM(ftg.liters) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_liters_in_group,
             SUM(ftg.total_cost) OVER (
               PARTITION BY ftg.vehicle_id, ftg.full_tank_group 
               ORDER BY ftg.date, ftg.odometer_km
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
             ) as total_cost_in_group
      FROM full_tank_groups ftg
      LEFT JOIN prev_full_tank pft ON ftg.vehicle_id = pft.vehicle_id 
        AND ftg.date = pft.date 
        AND ftg.odometer_km = pft.odometer_km
    ),
    calculated AS (
      SELECT 
        year,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (odometer_km - prev_full_odometer)
          ELSE NULL
        END as distance_km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_liters_in_group / (odometer_km - prev_full_odometer) * 100)
          ELSE NULL
        END as l_per_100km,
        CASE 
          WHEN is_full_tank = true AND prev_full_odometer IS NOT NULL AND (odometer_km - prev_full_odometer) > 0
          THEN (total_cost_in_group / (odometer_km - prev_full_odometer))
          ELSE NULL
        END as cost_per_km
      FROM consumption_calc
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
