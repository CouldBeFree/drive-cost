<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-text-primary">Fuel Entries</h2>
        <p class="text-sm text-text-muted">Track your refueling history</p>
      </div>
      <BaseButton @click="openAddForm">
        + Add Entry
      </BaseButton>
    </div>

    <BaseCard no-padding>
      <BaseTable :columns="columns" :rows="entries" empty-text="No fuel entries yet">
        <template #cell-date="{ value }">
          {{ formatDate(value) }}
        </template>
        <template #cell-make="{ row }">
          {{ (row as FuelEntry).make }} {{ (row as FuelEntry).model }}
        </template>
        <template #cell-odometer_km="{ value }">
          {{ formatNumber(value) }}
        </template>
        <template #cell-distance_km="{ value }">
          {{ value ? formatNumber(value) : '—' }}
        </template>
        <template #cell-liters="{ value }">
          {{ formatNumber(value) }}
        </template>
        <template #cell-price_per_liter="{ value }">
          {{ formatNumber(value) }}
        </template>
        <template #cell-total_cost="{ value }">
          {{ formatNumber(value) }}
        </template>
        <template #cell-l_per_100km="{ value }">
          {{ value ? formatNumber(value) : '—' }}
        </template>
        <template #cell-actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg p-2 text-primary transition-all hover:bg-primary/10 active:scale-95"
              @click="openEditForm(row as FuelEntry)"
              title="Edit entry"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button
              class="rounded-lg p-2 text-error transition-all hover:bg-error/10 active:scale-95"
              @click="confirmDelete(row as FuelEntry)"
              title="Delete entry"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Delete Fuel Entry Modal -->
    <BaseModal
      :model-value="!!entryToDelete"
      size="sm"
      @update:model-value="entryToDelete = null"
    >
      <div v-if="entryToDelete">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
          <svg class="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div class="text-center">
          <h3 class="text-xl font-bold text-text-primary">Delete Fuel Entry?</h3>
          <p class="mt-2 text-sm text-text-muted">
            Are you sure you want to delete this fuel entry from
            <span class="font-semibold text-text-primary">{{ formatDate(entryToDelete.date) }}</span>?
            This action cannot be undone.
          </p>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-background active:scale-95"
          @click="entryToDelete = null"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="deleteLoading"
          class="flex-1 rounded-xl bg-error px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-error/90 active:scale-95 disabled:opacity-50"
          @click="handleDelete"
        >
          <span v-if="deleteLoading" class="flex items-center justify-center gap-2">
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

    <!-- Fuel Entry Form Modal (Add/Edit) -->
    <FuelEntryFormModal
      :model-value="showEntryForm"
      :entry="entryToEdit"
      :vehicles="vehicles"
      @update:model-value="showEntryForm = false"
      @submit="handleEntrySubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { FuelEntry, Vehicle } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const showEntryForm = ref(false)
const entryToEdit = ref<FuelEntry | null>(null)
const entryToDelete = ref<FuelEntry | null>(null)
const deleteLoading = ref(false)
const vehicles = ref<Vehicle[]>([])

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'make', label: 'Vehicle' },
  { key: 'odometer_km', label: 'Odometer (km)' },
  { key: 'distance_km', label: 'Distance (km)' },
  { key: 'liters', label: 'Liters' },
  { key: 'price_per_liter', label: 'Price/L' },
  { key: 'total_cost', label: 'Total Cost' },
  { key: 'l_per_100km', label: 'L/100km' },
  { key: 'actions', label: 'Actions' },
]

const entries = ref<FuelEntry[]>([])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatNumber = (value: number) => {
  const num = Number(value)
  return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '')
}

const openAddForm = () => {
  entryToEdit.value = null
  showEntryForm.value = true
}

const openEditForm = (entry: FuelEntry) => {
  entryToEdit.value = entry
  showEntryForm.value = true
}

const confirmDelete = (entry: FuelEntry) => {
  entryToDelete.value = entry
}

const handleDelete = async () => {
  if (!entryToDelete.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/fuel-entries/${entryToDelete.value.id}`, { method: 'DELETE' })
    entryToDelete.value = null
    await loadFuelEntries()
  } catch (error: any) {
    console.error('Failed to delete fuel entry:', error)
    alert(error.data?.message || 'Failed to delete fuel entry')
  } finally {
    deleteLoading.value = false
  }
}

const handleEntrySubmit = async (data: { vehicle_id: number; date: string; odometer_km: number; liters: number; price_per_liter: number; total_cost: number }) => {
  try {
    if (entryToEdit.value) {
      const response = await $fetch<{ data: FuelEntry }>(`/api/fuel-entries/${entryToEdit.value.id}`, {
        method: 'PUT',
        body: {
          ...data,
          is_full_tank: true,
        },
      })
      const idx = entries.value.findIndex(e => e.id === entryToEdit.value!.id)
      if (idx !== -1 && response.data) entries.value[idx] = response.data
    } else {
      const response = await $fetch<{ data: FuelEntry }>('/api/fuel-entries', {
        method: 'POST',
        body: {
          ...data,
          is_full_tank: true,
        },
      })
      if (response.data) entries.value.unshift(response.data)
    }
    showEntryForm.value = false
  } catch (error: any) {
    console.error('Failed to save fuel entry:', error)
    alert(error.data?.message || 'Failed to save fuel entry')
  }
}

const loadVehicles = async () => {
  try {
    const response = await $fetch<{ data: Vehicle[] }>('/api/vehicles')
    vehicles.value = response.data
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  }
}

const loadFuelEntries = async () => {
  try {
    const response = await $fetch<{ data: FuelEntry[] }>('/api/fuel-entries')
    entries.value = response.data
  } catch (error) {
    console.error('Failed to load fuel entries:', error)
  }
}

onMounted(() => {
  loadVehicles()
  loadFuelEntries()
})
</script>
