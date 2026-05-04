<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Fuel Entries</h1>
        <p class="text-sm text-text-muted">Track your refueling history</p>
      </div>
      <BaseButton @click="openAddForm">
        + Add Entry
      </BaseButton>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="flex flex-wrap items-center gap-2">
        <!-- Vehicle Filter (only show if multiple vehicles) -->
        <div v-if="vehicles.length > 1" class="min-w-[140px]">
          <select
            v-model="selectedVehicleId"
            class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option :value="null">All Vehicles</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.make }} {{ vehicle.model }}
            </option>
          </select>
        </div>

        <!-- Date From -->
        <div class="flex flex-col gap-1 min-w-[140px]">
          <label class="text-xs font-medium text-text-muted px-1">From</label>
          <input
            v-model="dateFrom"
            type="date"
            class="date-input-custom w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Date To -->
        <div class="flex flex-col gap-1 min-w-[140px]">
          <label class="text-xs font-medium text-text-muted px-1">To</label>
          <input
            v-model="dateTo"
            type="date"
            class="date-input-custom w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-all hover:border-primary hover:text-primary whitespace-nowrap"
        >
          Clear
        </button>
      </div>
    </BaseCard>

    <BaseCard no-padding>
      <div class="overflow-x-auto">
        <TableSkeleton v-if="loading" :rows="10" :columns="9" />
        <BaseTable v-else :columns="columns" :rows="filteredEntries" empty-text="No fuel entries found">
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
        <template #cell-is_full_tank="{ value }">
          <span v-if="value" class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Full
          </span>
          <span v-else class="inline-flex items-center gap-1 rounded-full bg-text-muted/10 px-2 py-1 text-xs font-medium text-text-muted">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Partial
          </span>
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
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 sm:px-6 py-4">
        <div class="text-xs sm:text-sm text-text-muted">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} entries
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="rounded-lg border border-border px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-text-primary transition-all hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          
          <div class="hidden sm:flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'border border-border text-text-primary hover:bg-surface'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <div class="sm:hidden text-xs text-text-muted">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="rounded-lg border border-border px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-text-primary transition-all hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
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
    
    <!-- Toast Container -->
    <ToastContainer />
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
  { key: 'is_full_tank', label: 'Full Tank' },
  { key: 'l_per_100km', label: 'L/100km' },
  { key: 'actions', label: 'Actions' },
]

const entries = ref<FuelEntry[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedVehicleId = ref<number | null>(null)
const dateFrom = ref('')
const dateTo = ref('')
const toast = useToast()

const hasActiveFilters = computed(() => {
  // Don't count auto-selected single vehicle as active filter
  const hasVehicleFilter = vehicles.value.length > 1 && selectedVehicleId.value !== null
  return searchQuery.value || hasVehicleFilter || dateFrom.value || dateTo.value
})

const filteredEntries = computed(() => {
  // Pagination and filtering already handled by backend
  return entries.value
})

const clearFilters = () => {
  searchQuery.value = ''
  // Only clear vehicle filter if user has multiple vehicles
  if (vehicles.value.length > 1) {
    selectedVehicleId.value = null
  }
  dateFrom.value = ''
  dateTo.value = ''
}

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
  
  const entryId = entryToDelete.value.id
  const entryIndex = entries.value.findIndex(e => e.id === entryId)
  const deletedEntry = entryIndex > -1 ? entries.value[entryIndex] : null
  
  // Optimistic update
  if (entryIndex > -1) {
    entries.value.splice(entryIndex, 1)
  }
  entryToDelete.value = null
  
  try {
    await $fetch(`/api/fuel-entries/${entryId}`, { method: 'DELETE' })
    toast.success('Fuel entry deleted successfully')
    await loadFuelEntries()
  } catch (error: any) {
    console.error('Failed to delete fuel entry:', error)
    toast.error(error.data?.message || 'Failed to delete fuel entry')
    // Revert optimistic update
    if (deletedEntry && entryIndex > -1) {
      entries.value.splice(entryIndex, 0, deletedEntry)
    }
  } finally {
    deleteLoading.value = false
  }
}

const handleEntrySubmit = async (data: { vehicle_id: number; date: string; odometer_km: number; liters: number; price_per_liter: number; total_cost: number; is_full_tank: boolean }) => {
  try {
    if (entryToEdit.value) {
      const response = await $fetch<{ data: FuelEntry }>(`/api/fuel-entries/${entryToEdit.value.id}`, {
        method: 'PUT',
        body: data,
      })
      
      // Optimistic update
      const index = entries.value.findIndex(e => e.id === entryToEdit.value!.id)
      if (index > -1) {
        entries.value[index] = response.data
      }
      
      toast.success('Fuel entry updated successfully')
      await loadFuelEntries()
    } else {
      const response = await $fetch<{ data: FuelEntry }>('/api/fuel-entries', {
        method: 'POST',
        body: data,
      })
      
      // Optimistic update
      entries.value.unshift(response.data)
      
      toast.success('Fuel entry created successfully')
      await loadFuelEntries()
    }
    showEntryForm.value = false
  } catch (error: any) {
    console.error('Failed to save fuel entry:', error)
    toast.error(error.data?.message || 'Failed to save fuel entry')
  }
}

const loadVehicles = async () => {
  try {
    const response = await $fetch<{ data: Vehicle[] }>('/api/vehicles')
    vehicles.value = response.data
    
    // Auto-select single vehicle
    if (vehicles.value.length === 1 && vehicles.value[0]) {
      selectedVehicleId.value = vehicles.value[0].id
    }
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  }
}

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(0)
const totalItems = ref(0)

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, start + maxVisible - 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const loadFuelEntries = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      limit: itemsPerPage.value
    }
    
    if (selectedVehicleId.value) {
      params.vehicle_id = selectedVehicleId.value
    }
    
    if (dateFrom.value) {
      params.date_from = dateFrom.value
    }
    
    if (dateTo.value) {
      params.date_to = dateTo.value
    }
    
    const response = await $fetch<{ 
      data: FuelEntry[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>('/api/fuel-entries', { params })
    
    entries.value = response.data
    totalPages.value = response.pagination.totalPages
    totalItems.value = response.pagination.total
  } catch (error) {
    console.error('Failed to load fuel entries:', error)
    toast.error('Failed to load fuel entries')
  } finally {
    loading.value = false
  }
}

// Watch filters and reload
watch([selectedVehicleId, dateFrom, dateTo], () => {
  currentPage.value = 1
  loadFuelEntries()
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadFuelEntries()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadFuelEntries()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadFuelEntries()
  }
}

onMounted(() => {
  loadVehicles()
  loadFuelEntries()
})
</script>

<style scoped>
/* Hide date input browser UI when empty */
.date-input-custom::-webkit-datetime-edit-text,
.date-input-custom::-webkit-datetime-edit-month-field,
.date-input-custom::-webkit-datetime-edit-day-field,
.date-input-custom::-webkit-datetime-edit-year-field {
  color: transparent;
  width: 0;
  padding: 0;
}

.date-input-custom:valid::-webkit-datetime-edit-text,
.date-input-custom:valid::-webkit-datetime-edit-month-field,
.date-input-custom:valid::-webkit-datetime-edit-day-field,
.date-input-custom:valid::-webkit-datetime-edit-year-field {
  color: inherit;
  width: auto;
  padding: initial;
}

/* Ensure calendar icon is always clickable */
.date-input-custom::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
