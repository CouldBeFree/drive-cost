<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm text-text-muted">Analyze your fuel spending and consumption</p>
    </div>

    <!-- Filters -->
    <div class="relative flex flex-wrap items-center gap-2 sm:gap-3">
      <!-- Vehicle Filter (only show if multiple vehicles) -->
      <div v-if="vehicles.length > 1" class="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all hover:border-primary/40">
        <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        <select
          v-model="selectedVehicleId"
          class="border-none bg-transparent pr-8 text-sm font-medium text-text-primary focus:outline-none focus:ring-0"
        >
          <option :value="null">All Vehicles</option>
          <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
            {{ vehicle.make }} {{ vehicle.model }}
          </option>
        </select>
      </div>

      <!-- Period Type Selector -->
      <div class="inline-flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-sm w-full sm:w-auto">
        <button
          @click="periodType = 'all-time'"
          :class="[
            'flex-1 sm:flex-none rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap',
            periodType === 'all-time'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          ]"
        >
          All Time
        </button>
        <button
          @click="periodType = 'year'"
          :class="[
            'flex-1 sm:flex-none rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold transition-all',
            periodType === 'year'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          ]"
        >
          Year
        </button>
        <button
          @click="periodType = 'month'"
          :class="[
            'flex-1 sm:flex-none rounded-lg px-2 sm:px-3 py-1.5 text-xs font-semibold transition-all',
            periodType === 'month'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          ]"
        >
          Month
        </button>
      </div>

      <!-- Year Picker (only show when Year is selected) -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="periodType === 'year'" class="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all hover:border-primary/40">
          <svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <select
            v-model="selectedYear"
            class="border-none bg-transparent text-sm font-medium text-text-primary focus:outline-none focus:ring-0"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </Transition>

      <!-- Month Picker (only show when Month is selected) -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="periodType === 'month'" class="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all hover:border-primary/40">
          <svg class="h-4 w-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <input
            v-model="selectedMonth"
            type="month"
            class="border-none bg-transparent text-sm font-medium text-text-primary focus:outline-none focus:ring-0 min-w-0"
          />
        </div>
      </Transition>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <BaseCard title="Avg. Consumption">
        <p class="text-3xl font-bold text-primary">
          {{ formatNumber(statistics?.avg_consumption) }}
          <span class="text-base font-normal text-text-muted">L/100km</span>
        </p>
      </BaseCard>

      <BaseCard title="Avg. Cost per km">
        <p class="text-3xl font-bold text-secondary">
          {{ formatNumber(statistics?.avg_cost_per_km) }}
          <span class="text-base font-normal text-text-muted">$/km</span>
        </p>
      </BaseCard>

      <BaseCard title="Total Distance">
        <p class="text-3xl font-bold text-success">
          {{ formatInteger(statistics?.total_distance) }}
          <span class="text-base font-normal text-text-muted">km</span>
        </p>
      </BaseCard>

      <BaseCard :title="`Total Expense (${periodLabel})`">
        <p class="text-3xl font-bold text-amber-500">
          {{ formatNumber(statistics?.total_cost) }}
          <span class="text-base font-normal text-text-muted">$</span>
        </p>
      </BaseCard>

      <BaseCard :title="`Total Liters (${periodLabel})`">
        <p class="text-3xl font-bold text-blue-500">
          {{ formatNumber(statistics?.total_fuel) }}
          <span class="text-base font-normal text-text-muted">L</span>
        </p>
      </BaseCard>

      <BaseCard :title="`Fuel Entries (${periodLabel})`">
        <p class="text-3xl font-bold text-purple-500">
          {{ formatInteger(statistics?.entry_count) }}
          <span class="text-base font-normal text-text-muted">entries</span>
        </p>
      </BaseCard>
    </div>

    <!-- Monthly Charts (only show when Year is selected) -->
    <StatChartGrid
      v-if="periodType === 'year' && monthlyStatistics.length > 0"
      :data="monthlyStatistics"
      key-field="month"
      prefix="Monthly"
    />

    <!-- Yearly Charts (only show when All Time is selected) -->
    <StatChartGrid
      v-if="periodType === 'all-time' && yearlyStatistics.length > 0"
      :data="yearlyStatistics"
      key-field="year"
      prefix="Yearly"
      :custom-labels="yearlyStatistics.map(y => y.year.toString())"
    />
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types'
import { formatNumber, formatInteger } from '~/utils/format'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

interface Statistics {
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
  total_fuel: number | null
  total_cost: number | null
  entry_count: number | null
}

interface MonthlyStatistics {
  month: number
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
  total_cost: number | null
  total_fuel: number | null
  entry_count: number | null
}

interface DailyStatistics {
  day: number
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
  total_cost: number | null
  total_fuel: number | null
  entry_count: number | null
}

interface YearlyStatistics {
  year: number
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
  total_cost: number | null
  total_fuel: number | null
  entry_count: number | null
}

const vehicles = ref<Vehicle[]>([])
const selectedVehicleId = ref<number | null>(null)
const periodType = ref<'all-time' | 'year' | 'month'>('month')
const selectedMonth = ref('')
const selectedYear = ref<number>(new Date().getFullYear())
const statistics = ref<Statistics | null>(null)
const monthlyStatistics = ref<MonthlyStatistics[]>([])
const dailyStatistics = ref<DailyStatistics[]>([])
const yearlyStatistics = ref<YearlyStatistics[]>([])

const periodLabel = computed(() => {
  if (periodType.value === 'all-time') return 'All Time'
  if (periodType.value === 'year') return selectedYear.value.toString()
  if (periodType.value === 'month') {
    const [year, month] = selectedMonth.value.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
  }
  return ''
})

// Generate available years (current year and 5 years back)
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = 0; i <= 5; i++) {
    years.push(currentYear - i)
  }
  return years
})

// Set current month as default
const now = new Date()
selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

const loadVehicles = async () => {
  try {
    const response = await $fetch<{ data: Vehicle[] }>('/api/vehicles')
    vehicles.value = response.data
    
    // If only one vehicle, auto-select it
    if (vehicles.value.length === 1 && vehicles.value[0]) {
      selectedVehicleId.value = vehicles.value[0].id
    }
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  }
}

interface StatisticsQuery {
  vehicle_id?: number
  month?: string
  year?: number
  monthly?: 'true'
  daily?: 'true'
  yearly?: 'true'
}

const loadStatistics = async () => {
  try {
    const baseParams: StatisticsQuery = {}

    if (selectedVehicleId.value) {
      baseParams.vehicle_id = selectedVehicleId.value
    }

    if (periodType.value === 'month') {
      baseParams.month = selectedMonth.value
    } else if (periodType.value === 'year') {
      baseParams.year = selectedYear.value
    }

    const response = await $fetch<{ data: Statistics }>('/api/statistics', { params: baseParams })
    statistics.value = response.data

    // Load monthly breakdown if year is selected
    if (periodType.value === 'year') {
      const monthlyResponse = await $fetch<{ data: MonthlyStatistics[] }>('/api/statistics', {
        params: { ...baseParams, monthly: 'true' },
      })
      monthlyStatistics.value = monthlyResponse.data
    } else {
      monthlyStatistics.value = []
    }

    // Load daily breakdown if month is selected
    if (periodType.value === 'month') {
      const dailyResponse = await $fetch<{ data: DailyStatistics[] }>('/api/statistics', {
        params: { ...baseParams, daily: 'true' },
      })
      dailyStatistics.value = dailyResponse.data
    } else {
      dailyStatistics.value = []
    }

    // Load yearly breakdown if all-time is selected
    if (periodType.value === 'all-time') {
      const yearlyParams: StatisticsQuery = { yearly: 'true' }
      if (selectedVehicleId.value) yearlyParams.vehicle_id = selectedVehicleId.value
      const yearlyResponse = await $fetch<{ data: YearlyStatistics[] }>('/api/statistics', { params: yearlyParams })
      yearlyStatistics.value = yearlyResponse.data
    } else {
      yearlyStatistics.value = []
    }
  } catch (error) {
    console.error('Failed to load statistics:', error)
  }
}

// Watch for filter changes and reload statistics
watch([selectedVehicleId, periodType, selectedMonth, selectedYear], () => {
  loadStatistics()
})

onMounted(() => {
  loadVehicles()
  loadStatistics()
})
</script>
