<template>
  <aside class="flex w-60 flex-col border-r border-border bg-surface">
    <div class="flex h-14 items-center gap-2 border-b border-border px-5">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
        DC
      </div>
      <span class="text-lg font-semibold text-text-primary">DriveCost</span>
    </div>

    <nav class="flex-1 space-y-1 p-3">
      <NuxtLink
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        active-class="!bg-primary/10 !text-primary"
      >
        <component :is="item.icon" class="h-5 w-5" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="border-t border-border p-3 space-y-1">
      <NuxtLink
        to="/settings"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        active-class="!bg-primary/10 !text-primary"
      >
        <IconSettings class="h-5 w-5" />
        Settings
      </NuxtLink>
      
      <button
        @click="handleLogout"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
      >
        <IconLogout class="h-5 w-5" />
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import IconDashboard from '~/components/icons/IconDashboard.vue'
import IconFuel from '~/components/icons/IconFuel.vue'
import IconCar from '~/components/icons/IconCar.vue'
import IconChart from '~/components/icons/IconChart.vue'
import IconSettings from '~/components/icons/IconSettings.vue'
import IconLogout from '~/components/icons/IconLogout.vue'

const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: IconDashboard },
  { label: 'Fuel Entries', to: '/fuel-entries', icon: IconFuel },
  { label: 'Vehicles', to: '/vehicles', icon: IconCar },
  { label: 'Statistics', to: '/statistics', icon: IconChart },
]
</script>
