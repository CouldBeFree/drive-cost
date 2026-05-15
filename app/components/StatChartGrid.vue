<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <BaseCard :title="`${prefix} Consumption`">
      <MonthlyBarChart
        :data="bucketData('avg_consumption')"
        :custom-labels="customLabels"
        bar-color="bg-primary"
        :value-formatter="formatNumber"
      />
    </BaseCard>

    <BaseCard :title="`${prefix} Cost per km`">
      <MonthlyBarChart
        :data="bucketData('avg_cost_per_km')"
        :custom-labels="customLabels"
        bar-color="bg-secondary"
        :value-formatter="formatNumber"
      />
    </BaseCard>

    <BaseCard :title="`${prefix} Distance`">
      <MonthlyBarChart
        :data="bucketData('total_distance')"
        :custom-labels="customLabels"
        bar-color="bg-success"
        :value-formatter="formatInteger"
      />
    </BaseCard>

    <BaseCard :title="`${prefix} Expense`">
      <MonthlyBarChart
        :data="bucketData('total_cost')"
        :custom-labels="customLabels"
        bar-color="bg-warning"
        :value-formatter="formatNumber"
      />
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { formatNumber, formatInteger } from '~/utils/format'

type StatField = 'avg_consumption' | 'avg_cost_per_km' | 'total_distance' | 'total_cost'

export interface BucketStat {
  avg_consumption: number | null
  avg_cost_per_km: number | null
  total_distance: number | null
  total_cost: number | null
  [bucketKey: string]: number | null
}

interface Props {
  data: BucketStat[]
  /** Name of the bucket key inside each row (e.g. `month`, `day`, `year`). */
  keyField: string
  /** Card title prefix (e.g. "Monthly", "Daily", "Yearly"). */
  prefix: string
  /** Optional explicit x-axis labels; when omitted, the chart falls back to month names. */
  customLabels?: string[]
}

const props = defineProps<Props>()

const bucketData = (field: StatField) =>
  props.data.map(row => ({
    month: (row[props.keyField] as number | null) ?? 0,
    value: row[field],
  }))
</script>
