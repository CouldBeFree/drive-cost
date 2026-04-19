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
