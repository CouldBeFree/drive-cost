<template>
  <div class="w-full max-w-md">
    <div class="rounded-xl border-0 bg-transparent p-8">
      <div class="mb-4 flex items-center justify-center gap-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <IconFuelPump class="h-5 w-5 text-white" />
        </div>
        <span class="text-xl font-semibold text-text-primary">DriveCost</span>
      </div>

      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-text-primary">Create an account</h1>
        <p class="mt-2 text-sm text-text-secondary">Start tracking your fuel expenses today</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
          {{ error }}
        </div>
        <BaseInput
          v-model="state.name"
          type="text"
          label="Full name"
          placeholder="Enter your name"
          required
        />

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
              placeholder="Create a password"
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

        <div>
          <label class="mb-1.5 block text-sm font-medium text-text-primary">
            Confirm password
            <span class="text-error">*</span>
          </label>
          <div class="relative">
            <input
              v-model="state.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              required
              class="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted transition-colors hover:text-text-secondary"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <IconEye v-if="!showConfirmPassword" class="h-5 w-5" />
              <IconEyeOff v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <BaseButton type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Create account' }}
        </BaseButton>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-transparent px-2 text-text-muted">Or continue with</span>
          </div>
        </div>

        <a
          href="/api/auth/google"
          class="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>
      </form>

      <p class="mt-8 text-center text-sm text-text-secondary">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-primary hover:underline">
          Sign in
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const { register, loading } = useAuth()

const handleSubmit = async () => {
  try {
    error.value = ''
    
    if (state.password !== state.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }
    
    if (state.password.length < 6) {
      error.value = 'Password must be at least 6 characters'
      return
    }
    
    await register(state.name, state.email, state.password)
  } catch (err: any) {
    error.value = err.message || 'Registration failed'
  }
}
</script>
