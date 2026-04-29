import { calculateStatistics, calculateMonthlyStatistics, calculateDailyStatistics, calculateYearlyStatistics } from '../db/queries/statistics'

interface StatisticsParams {
  userId: number
  vehicleId?: number | null
  startDate?: string
  endDate?: string
}

export async function getStatistics(params: StatisticsParams) {
  return calculateStatistics(params)
}

export async function getMonthlyStatistics(params: StatisticsParams) {
  return calculateMonthlyStatistics(params)
}

export async function getDailyStatistics(params: StatisticsParams) {
  return calculateDailyStatistics(params)
}

export async function getYearlyStatistics(params: StatisticsParams) {
  return calculateYearlyStatistics(params)
}
