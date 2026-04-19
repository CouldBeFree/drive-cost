<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-text-primary">Fuel Entries</h2>
        <p class="text-sm text-text-muted">Track your refueling history</p>
      </div>
      <BaseButton @click="showAddForm = true">
        + Add Entry
      </BaseButton>
    </div>

    <BaseCard no-padding>
      <BaseTable :columns="columns" :rows="entries" empty-text="No fuel entries yet">
        <template #cell-total_cost="{ value }">
          {{ value ? `$${Number(value).toFixed(2)}` : '—' }}
        </template>
        <template #cell-is_full_tank="{ value }">
          <span
            :class="value ? 'text-success' : 'text-text-muted'"
            class="text-xs font-medium"
          >
            {{ value ? 'Full' : 'Partial' }}
          </span>
        </template>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { FuelEntry } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const showAddForm = ref(false)

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'odometer_km', label: 'Odometer (km)' },
  { key: 'liters', label: 'Liters' },
  { key: 'price_per_liter', label: 'Price/L' },
  { key: 'total_cost', label: 'Total Cost' },
  { key: 'is_full_tank', label: 'Tank' },
]

const entries = ref<FuelEntry[]>([])
</script>
