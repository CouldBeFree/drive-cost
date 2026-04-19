<template>
  <BaseModal
    :model-value="modelValue"
    size="sm"
    @update:model-value="emit('update:modelValue', false)"
  >
    <div v-if="vehicle">
      <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <svg class="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div class="text-center">
        <h3 class="text-xl font-bold text-text-primary">Delete Vehicle?</h3>
        <p class="mt-2 text-sm text-text-muted">
          Are you sure you want to delete
          <span class="font-semibold text-text-primary">{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</span>?
          This action cannot be undone.
        </p>
      </div>
    </div>
    <template #footer>
      <button
        type="button"
        class="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-background active:scale-95"
        @click="emit('update:modelValue', false)"
      >
        Cancel
      </button>
      <button
        type="button"
        :disabled="loading"
        class="flex-1 rounded-xl bg-error px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-error/90 active:scale-95 disabled:opacity-50"
        @click="emit('confirm')"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Deleting…
        </span>
        <span v-else>Delete</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types'

interface Props {
  modelValue: boolean
  vehicle?: Vehicle | null
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()
</script>
