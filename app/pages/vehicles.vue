<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-text-primary">Your Vehicles</h2>
        <p class="text-sm text-text-muted">Manage your registered vehicles</p>
      </div>
      <BaseButton @click="openAddForm">
        + Add Vehicle
      </BaseButton>
    </div>

    <!-- Loading state -->
    <div v-if="vehiclesLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="n in 3"
        :key="n"
        class="h-44 animate-pulse rounded-2xl bg-surface"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="vehicles.length === 0"
      class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface py-16 text-center"
    >
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      </div>
      <p class="text-base font-semibold text-text-primary">No vehicles yet</p>
      <p class="mt-1 text-sm text-text-muted">Add your first vehicle to start tracking fuel</p>
      <BaseButton class="mt-6" @click="openAddForm">+ Add Vehicle</BaseButton>
    </div>

    <!-- Vehicle cards grid -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
      >
        <!-- Colored header band -->
        <div class="relative overflow-hidden bg-gradient-to-br from-primary/8 to-primary/3 px-5 pt-5 pb-4">
          <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

          <!-- Decorative car silhouette -->
          <svg class="absolute right-0 -bottom-3 h-24 w-44 text-primary/10" viewBox="0 0 200 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M170 45 C168 35 160 25 148 22 L120 18 C112 16 100 10 88 10 L60 10 C48 10 36 16 28 24 L18 34 C12 36 8 40 8 46 L8 56 C8 58 10 60 12 60 L24 60 C24 68 31 74 39 74 C47 74 54 68 54 60 L130 60 C130 68 137 74 145 74 C153 74 160 68 160 60 L172 60 C176 60 178 58 178 54 L178 50 C178 47 174 46 170 45 Z M39 68 C35 68 32 65 32 61 C32 57 35 54 39 54 C43 54 46 57 46 61 C46 65 43 68 39 68 Z M145 68 C141 68 138 65 138 61 C138 57 141 54 145 54 C149 54 152 57 152 61 C152 65 149 68 145 68 Z M80 22 L88 12 C94 10 106 10 112 12 L124 22 L80 22 Z M40 22 L48 14 C52 11 58 10 64 10 L76 10 L68 22 L40 22 Z"/>
          </svg>

          <!-- Top row: icon + year + actions -->
          <div class="mb-3 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-text-secondary ring-1 ring-border/50">
                {{ vehicle.year }}
              </span>
              <button class="rounded-lg bg-white/70 p-2 text-primary shadow-sm ring-1 ring-border/40 transition-all hover:bg-primary hover:text-white hover:shadow-md active:scale-95" @click="openEditForm(vehicle)">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </button>
              <button class="rounded-lg bg-white/70 p-2 text-error shadow-sm ring-1 ring-border/40 transition-all hover:bg-error hover:text-white hover:shadow-md active:scale-95" @click="confirmDelete(vehicle)">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Make & Model -->
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-widest text-primary/70">{{ vehicle.make }}</p>
            <h3 class="mt-0.5 text-2xl font-bold leading-tight text-text-primary">{{ vehicle.model }}</h3>
          </div>
        </div>

        <!-- Bottom content -->
        <div class="px-5 py-4">
          <!-- License plate -->
          <div class="mb-4 flex items-center gap-2">
            <svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="font-mono text-sm font-semibold tracking-widest text-text-primary">{{ vehicle.license_plate || '—' }}</span>
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-background">
            <div class="px-3 py-2.5 text-center">
              <p class="text-lg font-bold text-text-primary">—</p>
              <p class="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">Fills</p>
            </div>
            <div class="px-3 py-2.5 text-center">
              <p class="text-lg font-bold text-text-primary">—</p>
              <p class="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">L/100km</p>
            </div>
            <div class="px-3 py-2.5 text-center">
              <p class="text-lg font-bold text-text-primary">—</p>
              <p class="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">Total km</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Vehicle Modal -->
    <DeleteConfirmModal
      :model-value="!!vehicleToDelete"
      :vehicle="vehicleToDelete"
      :loading="deleteLoading"
      @update:model-value="vehicleToDelete = null"
      @confirm="handleDelete"
    />

    <!-- Vehicle Form Modal (Add/Edit) -->
    <VehicleFormModal
      :model-value="showVehicleForm"
      :vehicle="vehicleToEdit"
      @update:model-value="showVehicleForm = false"
      @submit="handleVehicleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const vehiclesStore = useVehiclesStore()
const showVehicleForm = ref(false)
const vehicleToEdit = ref<Vehicle | null>(null)

const openEditForm = (vehicle: Vehicle) => {
  vehicleToEdit.value = vehicle
  showVehicleForm.value = true
}

const openAddForm = () => {
  vehicleToEdit.value = null
  showVehicleForm.value = true
}

const handleVehicleSubmit = async (data: { make: string; model: string; year: number; license_plate: string }) => {
  try {
    const payload = {
      ...data,
      license_plate: data.license_plate.toUpperCase(),
    }
    
    if (vehicleToEdit.value) {
      const response = await $fetch<{ data: Vehicle }>(`/api/vehicles/${vehicleToEdit.value.id}`, {
        method: 'PUT',
        body: payload,
      })
      const idx = vehicles.value.findIndex(v => v.id === vehicleToEdit.value!.id)
      if (idx !== -1 && response.data) vehicles.value[idx] = response.data
    } else {
      const response = await $fetch<{ data: Vehicle }>('/api/vehicles', {
        method: 'POST',
        body: payload,
      })
      if (response.data) vehicles.value.unshift(response.data)
    }
    showVehicleForm.value = false
  } catch (error: any) {
    console.error('Failed to save vehicle:', error)
    alert(error.data?.message || 'Failed to save vehicle')
  }
}

const vehicleToDelete = ref<Vehicle | null>(null)
const deleteLoading = ref(false)

const confirmDelete = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle
}

const handleDelete = async () => {
  if (!vehicleToDelete.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/vehicles/${vehicleToDelete.value.id}`, { method: 'DELETE' })
    vehicles.value = vehicles.value.filter(v => v.id !== vehicleToDelete.value!.id)
    vehicleToDelete.value = null
  } catch (error: any) {
    console.error('Failed to delete vehicle:', error)
    alert(error.data?.message || 'Failed to delete vehicle')
  } finally {
    deleteLoading.value = false
  }
}


const vehicles = ref<Vehicle[]>([])
const vehiclesLoading = ref(true)

const loadVehicles = async () => {
  vehiclesLoading.value = true
  try {
    const response = await $fetch<{ data: Vehicle[] }>('/api/vehicles')
    vehicles.value = response.data
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  } finally {
    vehiclesLoading.value = false
  }
}

onMounted(() => loadVehicles())
</script>
