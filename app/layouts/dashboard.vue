<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <aside
      :class="[
        'flex flex-col border-r border-border bg-surface transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      ]"
    >
      <div class="border-b border-border px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <IconFuelPump class="h-4 w-4 text-white" />
          </div>
          <span v-if="!collapsed" class="text-lg font-semibold text-text-primary">DriveCost</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 overflow-y-auto p-3">
        <ul class="space-y-1">
          <li v-for="item in items" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                route.path === item.to
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                collapsed ? 'justify-center' : '',
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span v-if="!collapsed">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="border-t border-border p-3 space-y-1">
        <NuxtLink
          to="/settings"
          :class="[
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
            route.path === '/settings'
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            collapsed ? 'justify-center' : '',
          ]"
        >
          <IconSettings class="h-5 w-5 flex-shrink-0" />
          <span v-if="!collapsed">Settings</span>
        </NuxtLink>
        
        <button
          @click="handleLogout"
          :class="[
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary',
            collapsed ? 'justify-center' : '',
          ]"
        >
          <IconLogout class="h-5 w-5 flex-shrink-0" />
          <span v-if="!collapsed">Logout</span>
        </button>
      </div>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="border-b border-border bg-surface px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-text-primary">{{ pageTitle }}</h1>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <IconUser class="h-4 w-4 text-primary" />
              </div>
              <div class="text-sm">
                <p class="font-medium text-text-primary">{{ user.name }}</p>
                <p class="text-xs text-text-muted">{{ user.plan }}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconFuelPump from '~/components/icons/IconFuelPump.vue'
import IconDashboard from '~/components/icons/IconDashboard.vue'
import IconClipboard from '~/components/icons/IconClipboard.vue'
import IconChart from '~/components/icons/IconChart.vue'
import IconCar from '~/components/icons/IconCar.vue'
import IconSettings from '~/components/icons/IconSettings.vue'
import IconUser from '~/components/icons/IconUser.vue'
import IconLogout from '~/components/icons/IconLogout.vue'

const route = useRoute()
const collapsed = ref(false)
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
}

const items = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    to: '/dashboard',
  },
  {
    label: 'Fuel Entries',
    icon: IconClipboard,
    to: '/fuel-entries',
  },
  {
    label: 'Statistics',
    icon: IconChart,
    to: '/statistics',
  },
  {
    label: 'Vehicles',
    icon: IconCar,
    to: '/vehicles',
  },
]

const user = {
  name: 'Alex Morgan',
  plan: 'Pro Plan',
}

const pageTitle = computed(() => {
  const currentItem = items.find(item => item.to === route.path)
  return currentItem?.label || 'Dashboard'
})
</script>
