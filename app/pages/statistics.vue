<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-text-primary">Statistics</h2>
      <p class="text-sm text-text-muted">Analyze your fuel spending and consumption</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <BaseCard title="Avg. Consumption">
        <p class="text-3xl font-bold text-primary">— <span class="text-base font-normal text-text-muted">L/100km</span></p>
      </BaseCard>

      <BaseCard title="Avg. Cost per km">
        <p class="text-3xl font-bold text-secondary">— <span class="text-base font-normal text-text-muted">$/km</span></p>
      </BaseCard>

      <BaseCard title="Total Distance">
        <p class="text-3xl font-bold text-success">— <span class="text-base font-normal text-text-muted">km</span></p>
      </BaseCard>
    </div>

    <BaseCard title="Spending Over Time" description="Monthly fuel expenditure">
      <div class="flex h-48 items-center justify-center">
        <p class="text-sm text-text-muted">Charts will be available once you have fuel entry data.</p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})
</script>
