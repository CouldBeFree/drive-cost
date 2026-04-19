<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <IconFuelPump class="h-4 w-4 text-white" />
            </div>
            <span class="text-lg font-semibold text-text-primary">DriveCost</span>
          </NuxtLink>

          <nav class="hidden items-center gap-8 md:flex">
            <a href="#features" class="text-sm text-text-secondary transition-colors hover:text-text-primary">
              Features
            </a>
            <a href="#how-it-works" class="text-sm text-text-secondary transition-colors hover:text-text-primary">
              How it Works
            </a>
          </nav>

          <div class="flex items-center gap-4">
            <template v-if="user">
              <span class="text-sm text-text-secondary">{{ user.name }}</span>
              <NuxtLink to="/dashboard">
                <BaseButton>Dashboard</BaseButton>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" class="text-sm text-text-secondary transition-colors hover:text-text-primary">
                Sign in
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <BaseButton>Get Started</BaseButton>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <section class="py-20 lg:py-32">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 class="text-balance text-4xl font-bold leading-tight text-text-primary lg:text-5xl">
              Know exactly how much every kilometer costs you
            </h1>
            <p class="mt-6 text-lg text-text-secondary">
              Track fuel expenses, calculate consumption, and get detailed insights into your vehicle's cost per kilometer. Make informed decisions about your driving habits.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/dashboard">
                <BaseButton>Start Tracking</BaseButton>
              </NuxtLink>
              <NuxtLink to="/dashboard">
                <BaseButton variant="outline">View Demo</BaseButton>
              </NuxtLink>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-surface p-6 shadow-card">
            <div class="mb-6 flex items-center gap-2">
              <IconBarChart class="h-5 w-5 text-primary" />
              <span class="font-medium text-text-primary">Fuel Dashboard</span>
            </div>

            <div class="mb-6 grid grid-cols-2 gap-4">
              <div class="rounded-lg bg-background p-4">
                <p class="mb-1 text-xs text-text-muted">Avg Consumption</p>
                <p class="text-xl font-bold text-primary">7.2 L/100km</p>
              </div>
              <div class="rounded-lg bg-background p-4">
                <p class="mb-1 text-xs text-text-muted">Cost per KM</p>
                <p class="text-xl font-bold text-text-primary">$0.14</p>
              </div>
            </div>

            <div class="mb-4">
              <div class="mb-2 flex justify-between text-sm">
                <span class="text-text-secondary">This Month</span>
                <span class="font-medium text-text-primary">$287.50</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-background">
                <div class="h-full w-[82%] rounded-full bg-primary" />
              </div>
              <div class="mt-1 flex justify-between text-xs text-text-muted">
                <span>2,050 km</span>
                <span>Target: 2,500 km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="bg-surface py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2 class="text-3xl font-bold text-text-primary">
            Everything you need to track fuel costs
          </h2>
          <p class="mt-4 text-text-secondary">
            Simple yet powerful tools to understand your vehicle's fuel consumption and costs.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="rounded-xl border border-border bg-surface p-6 shadow-card transition-colors hover:border-primary/50"
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <component :is="feature.icon" class="h-6 w-6 text-primary" />
            </div>
            <h3 class="mb-2 font-semibold text-text-primary">{{ feature.title }}</h3>
            <p class="text-sm text-text-secondary">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2 class="text-3xl font-bold text-text-primary">How it works</h2>
          <p class="mt-4 text-text-secondary">Get started in three simple steps</p>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="step in steps" :key="step.number" class="text-center">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span class="font-bold text-white">{{ step.number }}</span>
            </div>
            <h3 class="mb-2 font-semibold text-text-primary">{{ step.title }}</h3>
            <p class="text-sm text-text-secondary">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-surface py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold text-text-primary">Powerful dashboard and insights</h2>
          <p class="mt-4 text-text-secondary">See all your fuel data at a glance</p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-xl border border-border bg-surface p-6 shadow-card">
            <h4 class="mb-4 font-medium text-text-primary">Recent Entries</h4>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <div>
                  <p class="text-text-primary">Shell Station</p>
                  <p class="text-xs text-text-muted">45.2L • $68.50</p>
                </div>
                <span class="text-text-secondary">Today</span>
              </div>
              <div class="flex justify-between text-sm">
                <div>
                  <p class="text-text-primary">Petro Canada</p>
                  <p class="text-xs text-text-muted">42.8L • $64.20</p>
                </div>
                <span class="text-text-secondary">3 days ago</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-surface p-6 shadow-card">
            <h4 class="mb-2 font-medium text-text-primary">This Month</h4>
            <div class="space-y-2">
              <div>
                <p class="text-xs text-text-muted">Total Spent</p>
                <p class="text-2xl font-bold text-text-primary">$287.50</p>
              </div>
              <div>
                <p class="text-xs text-text-muted">Distance</p>
                <p class="text-xl font-semibold text-text-primary">2,050 km</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-surface p-6 shadow-card">
            <h4 class="mb-2 font-medium text-text-primary">Efficiency</h4>
            <div class="space-y-2">
              <div>
                <p class="text-xs text-text-muted">Avg Consumption</p>
                <p class="text-2xl font-bold text-primary">7.2 L/100km</p>
              </div>
              <div>
                <p class="text-xs text-text-muted">Cost per KM</p>
                <p class="text-xl font-semibold text-text-primary">$0.14</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-text-primary">
          Start tracking your fuel expenses today
        </h2>
        <p class="mt-4 text-text-secondary">
          Join thousands of drivers who are saving money by understanding their fuel costs better.
        </p>
        <div class="mt-8">
          <NuxtLink to="/dashboard">
            <BaseButton>Get Started</BaseButton>
          </NuxtLink>
        </div>
      </div>
    </section>

    <footer class="border-t border-border bg-surface py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-4">
          <div>
            <div class="mb-4 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <IconFuelPump class="h-4 w-4 text-white" />
              </div>
              <span class="text-lg font-semibold text-text-primary">DriveCost</span>
            </div>
            <p class="text-sm text-text-secondary">
              Smart fuel tracking for better driving decisions.
            </p>
          </div>

          <div>
            <h4 class="mb-4 font-medium text-text-primary">Product</h4>
            <ul class="space-y-2 text-sm text-text-secondary">
              <li><a href="#features" class="hover:text-text-primary">Features</a></li>
              <li><a href="#" class="hover:text-text-primary">Pricing</a></li>
              <li><a href="#" class="hover:text-text-primary">API</a></li>
            </ul>
          </div>

          <div>
            <h4 class="mb-4 font-medium text-text-primary">Company</h4>
            <ul class="space-y-2 text-sm text-text-secondary">
              <li><a href="#" class="hover:text-text-primary">About</a></li>
              <li><a href="#" class="hover:text-text-primary">Blog</a></li>
              <li><a href="#" class="hover:text-text-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 class="mb-4 font-medium text-text-primary">Support</h4>
            <ul class="space-y-2 text-sm text-text-secondary">
              <li><a href="#" class="hover:text-text-primary">Help Center</a></li>
              <li><a href="#" class="hover:text-text-primary">Privacy</a></li>
              <li><a href="#" class="hover:text-text-primary">Terms</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-12 border-t border-border pt-8 text-center text-sm text-text-muted">
          &copy; {{ currentYear }} DriveCost. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import IconFuelPump from '~/components/icons/IconFuelPump.vue'
import IconClipboard from '~/components/icons/IconClipboard.vue'
import IconCalculator from '~/components/icons/IconCalculator.vue'
import IconTrending from '~/components/icons/IconTrending.vue'
import IconBarChart from '~/components/icons/IconBarChart.vue'

definePageMeta({
  layout: 'landing',
})

const features = [
  {
    icon: IconClipboard,
    title: 'Track Fuel Entries',
    description: 'Easily log fuel purchases with amount, price, and odometer readings.',
  },
  {
    icon: IconCalculator,
    title: 'Auto Calculations',
    description: 'Automatic fuel consumption calculations in L/100km or MPG.',
  },
  {
    icon: IconTrending,
    title: 'Cost per KM',
    description: 'Get detailed insights into how much each kilometer costs you.',
  },
  {
    icon: IconBarChart,
    title: 'Monthly Statistics',
    description: 'Detailed charts and reports to track trends over time.',
  },
]

const { user, fetchSession } = useAuth()
const currentYear = new Date().getFullYear()

onMounted(() => {
  fetchSession()
})

const steps = [
  {
    number: 1,
    title: 'Add Fuel Entry',
    description: 'Log your fuel purchase with amount, price, and current odometer reading.',
  },
  {
    number: 2,
    title: 'Track Distance',
    description: 'Continue driving and add your next fuel entry to calculate distance traveled.',
  },
  {
    number: 3,
    title: 'Get Insights',
    description: 'View detailed analytics on consumption, costs, and efficiency trends.',
  },
]
</script>
