<template>
  <header class="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
    <div>
      <h1 class="text-lg font-semibold text-text-primary">
        {{ pageTitle }}
      </h1>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
        U
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/fuel-entries': 'Fuel Entries',
  '/vehicles': 'Vehicles',
  '/statistics': 'Statistics',
  '/settings': 'Settings',
}

const pageTitle = computed(() => pageTitles[route.path] || 'DriveCost')
</script>
