<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BaseCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-text-muted">{{ stat.label }}</p>
            <p class="mt-1 text-2xl font-semibold text-text-primary">{{ stat.value }}</p>
          </div>
          <div :class="['flex h-10 w-10 items-center justify-center rounded-lg', stat.bgColor]">
            <span :class="['text-lg', stat.textColor]">{{ stat.icon }}</span>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard title="Recent Fuel Entries" description="Latest refueling records">
        <p class="text-sm text-text-muted">No fuel entries yet. Start by adding your first entry.</p>
      </BaseCard>

      <BaseCard title="Fuel Consumption Trend" description="L/100km over time">
        <p class="text-sm text-text-muted">Chart will appear once you have enough data.</p>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const stats = [
  { label: 'Total Vehicles', value: '0', icon: '🚗', bgColor: 'bg-primary/10', textColor: 'text-primary' },
  { label: 'Fuel Entries', value: '0', icon: '⛽', bgColor: 'bg-success/10', textColor: 'text-success' },
  { label: 'Avg. Consumption', value: '— L/100km', icon: '📊', bgColor: 'bg-secondary/10', textColor: 'text-secondary' },
  { label: 'Total Spent', value: '$0.00', icon: '💰', bgColor: 'bg-error/10', textColor: 'text-error' },
]
</script>
