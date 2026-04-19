<template>
  <div class="rounded-lg border border-border bg-surface shadow-card">
    <div v-if="title || $slots.header" class="flex items-center justify-between border-b border-border px-5 py-4">
      <div>
        <h3 v-if="title" class="text-base font-semibold text-text-primary">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-0.5 text-sm text-text-muted">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.header">
        <slot name="header" />
      </div>
    </div>
    <div :class="noPadding ? '' : 'p-5'">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  noPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  noPadding: false,
})
</script>
