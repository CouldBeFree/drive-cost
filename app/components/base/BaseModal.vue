<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="onBackdropClick"
    >
      <div
        class="relative w-full animate-in fade-in zoom-in-95 duration-200 rounded-2xl bg-surface p-8 shadow-2xl ring-1 ring-border/50"
        :class="sizeClass"
      >
        <button
          type="button"
          class="absolute right-4 top-4 rounded-lg p-2 text-text-muted transition-all hover:bg-surface-hover hover:text-text-primary active:scale-95"
          @click="close"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div v-if="title || $slots.header" class="mb-6 pr-10">
          <slot name="header">
            <h3 class="text-2xl font-bold text-text-primary tracking-tight">{{ title }}</h3>
            <p v-if="description" class="mt-1 text-sm text-text-muted">{{ description }}</p>
          </slot>
        </div>

        <slot />

        <div v-if="$slots.footer" class="mt-6 flex gap-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true,
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const sizeClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}[props.size]))

const close = () => emit('update:modelValue', false)
const onBackdropClick = () => {
  if (props.closeOnBackdrop) close()
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>
