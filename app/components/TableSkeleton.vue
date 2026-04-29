<template>
  <div class="animate-pulse">
    <div v-for="i in rows" :key="i" class="flex items-center gap-4 border-b border-border px-6 py-4">
      <div v-for="j in columns" :key="j" class="flex-1">
        <div class="h-4 bg-surface rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 8,
})
</script>
