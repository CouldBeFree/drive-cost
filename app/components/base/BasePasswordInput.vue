<template>
  <div>
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-text-primary">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        :type="visible ? 'text' : 'password'"
        :placeholder="placeholder"
        :required="required"
        class="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted transition-colors hover:text-text-secondary"
        @click="visible = !visible"
      >
        <IconEye v-if="!visible" class="h-5 w-5" />
        <IconEyeOff v-else class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconEye from '~/components/icons/IconEye.vue'
import IconEyeOff from '~/components/icons/IconEyeOff.vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const visible = ref(false)
</script>
