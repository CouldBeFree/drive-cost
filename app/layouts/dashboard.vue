<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        @click="mobileMenuOpen = false"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      />
    </Transition>

    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'hidden lg:flex flex-col border-r border-border bg-surface transition-all duration-300',
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

    <!-- Mobile Sidebar Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="mobileMenuOpen"
        class="fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-surface lg:hidden"
      >
        <div class="border-b border-border px-4 py-3 flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <IconFuelPump class="h-4 w-4 text-white" />
            </div>
            <span class="text-lg font-semibold text-text-primary">DriveCost</span>
          </NuxtLink>
          <button
            @click="mobileMenuOpen = false"
            class="p-2 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto p-3">
          <ul class="space-y-1">
            <li v-for="item in items" :key="item.to">
              <NuxtLink
                :to="item.to"
                @click="mobileMenuOpen = false"
                :class="[
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  route.path === item.to
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                ]"
              >
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="border-t border-border p-3 space-y-1">
          <NuxtLink
            to="/settings"
            @click="mobileMenuOpen = false"
            :class="[
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              route.path === '/settings'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            ]"
          >
            <IconSettings class="h-5 w-5 flex-shrink-0" />
            <span>Settings</span>
          </NuxtLink>
          
          <button
            @click="handleLogout"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <IconLogout class="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </Transition>

    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Mobile Header -->
      <header class="border-b border-border bg-surface px-4 py-3 lg:px-6 lg:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Mobile Menu Button -->
            <button
              @click="mobileMenuOpen = true"
              class="lg:hidden p-2 -ml-2 rounded-lg text-text-primary hover:bg-surface-hover transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="text-lg lg:text-xl font-semibold text-text-primary">{{ pageTitle }}</h1>
          </div>
          
          <!-- Desktop User Info -->
          <div class="hidden sm:flex items-center gap-3">
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
          
          <!-- Mobile User Avatar Only -->
          <div class="sm:hidden">
            <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <IconUser class="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6">
        <slot />
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 backdrop-blur-sm">
        <ul class="flex items-center justify-around px-2 py-2">
          <li v-for="item in items" :key="item.to" class="flex-1">
            <NuxtLink
              :to="item.to"
              :class="[
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors',
                route.path === item.to
                  ? 'text-primary font-medium'
                  : 'text-text-muted',
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span class="text-[10px]">{{ item.label }}</span>
            </NuxtLink>
          </li>
          <li class="flex-1">
            <NuxtLink
              to="/settings"
              :class="[
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors',
                route.path === '/settings'
                  ? 'text-primary font-medium'
                  : 'text-text-muted',
              ]"
            >
              <IconSettings class="h-5 w-5 flex-shrink-0" />
              <span class="text-[10px]">Settings</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
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
const mobileMenuOpen = ref(false)
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
