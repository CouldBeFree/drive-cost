<template>
  <div class="w-full max-w-md">
    <div class="rounded-xl border-0 bg-transparent p-8">
      <NuxtLink to="/" class="mb-4 flex items-center justify-center gap-2 transition-opacity hover:opacity-80">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <IconFuelPump class="h-5 w-5 text-white" />
        </div>
        <span class="text-xl font-semibold text-text-primary">DriveCost</span>
      </NuxtLink>

      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p class="mt-2 text-sm text-text-secondary">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="error" class="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
          {{ error }}
        </div>
        <BaseInput
          v-model="state.email"
          type="email"
          label="Email address"
          placeholder="Enter your email"
          required
        />

        <div>
          <label class="mb-1.5 block text-sm font-medium text-text-primary">
            Password
            <span class="text-error">*</span>
          </label>
          <div class="relative">
            <input
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
              class="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted transition-colors hover:text-text-secondary"
              @click="showPassword = !showPassword"
            >
              <IconEye v-if="!showPassword" class="h-5 w-5" />
              <IconEyeOff v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <BaseButton type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </BaseButton>
      </form>

      <p class="mt-8 text-center text-sm text-text-secondary">
        Don't have an account?
        <NuxtLink to="/auth/register" class="text-primary hover:underline">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconFuelPump from '~/components/icons/IconFuelPump.vue'
import IconEye from '~/components/icons/IconEye.vue'
import IconEyeOff from '~/components/icons/IconEyeOff.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'auth',
})

const state = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const error = ref('')
const { login, loading } = useAuth()

const handleLogin = async () => {
  try {
    error.value = ''
    await login(state.email, state.password)
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  }
}
</script>
