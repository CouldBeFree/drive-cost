<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead>
        <tr class="border-b border-border">
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="border-b border-border transition-colors last:border-0 hover:bg-surface-hover"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-text-primary"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] ?? '—' }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-text-muted">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  rows: Record<string, any>[]
  emptyText?: string
}

withDefaults(defineProps<Props>(), {
  emptyText: 'No data available',
})
</script>
