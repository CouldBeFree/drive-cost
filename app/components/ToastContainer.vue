<template>
  <div class="fixed bottom-0 right-0 z-50 p-6 space-y-3 pointer-events-none">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto"
    >
      <Toast
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="remove(toast.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()
</script>
