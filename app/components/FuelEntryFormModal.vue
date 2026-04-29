<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEditMode ? 'Edit Fuel Entry' : 'Add Fuel Entry'"
    :description="isEditMode ? 'Update fuel entry details' : 'Record your refueling'"
    @update:model-value="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Vehicle Selection -->
      <div class="group">
        <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          Vehicle
        </label>
        <div class="relative">
          <select
            v-model="formData.vehicle_id"
            required
            class="w-full appearance-none rounded-xl border-2 border-border bg-background px-4 py-3 pr-10 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            <option value="" disabled>Select vehicle</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Date Field -->
      <div>
        <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Date
        </label>
        <input
          v-model="formData.date"
          type="date"
          required
          class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <!-- Odometer & Liters Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Odometer (km)
          </label>
          <input
            v-model.number="formData.odometer_km"
            type="number"
            min="0"
            step="1"
            required
            placeholder="120000"
            class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div>
          <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            Liters
          </label>
          <input
            v-model.number="formData.liters"
            type="number"
            min="0"
            step="1"
            required
            placeholder="45.5"
            class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      <!-- Price per Liter & Total Cost Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Price/L
          </label>
          <input
            v-model.number="formData.price_per_liter"
            type="number"
            min="0"
            step="1"
            required
            placeholder="1.45"
            class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div>
          <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            Total Cost
          </label>
          <input
            :value="totalCost"
            type="number"
            min="0"
            step="1"
            required
            disabled
            placeholder="65.98"
            class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          class="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-background active:scale-95"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ isEditMode ? 'Saving…' : 'Adding…' }}
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg v-if="isEditMode" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {{ isEditMode ? 'Save Changes' : 'Add Entry' }}
          </span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { FuelEntry, Vehicle } from '~/types'

interface Props {
  modelValue: boolean
  entry?: FuelEntry | null
  vehicles: Vehicle[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { vehicle_id: number; date: string; odometer_km: number; liters: number; price_per_liter: number; total_cost: number }]
}>()

const isEditMode = computed(() => !!props.entry)
const loading = ref(false)

const formData = reactive({
  vehicle_id: '' as number | '',
  date: '',
  odometer_km: 0,
  liters: 0,
  price_per_liter: 0,
})

const totalCost = computed(() => {
  return Number((formData.liters * formData.price_per_liter).toFixed(2))
})

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  formData.vehicle_id = ''
  formData.date = ''
  formData.odometer_km = 0
  formData.liters = 0
  formData.price_per_liter = 0
}

const handleSubmit = () => {
  if (!formData.vehicle_id) return
  
  emit('submit', {
    vehicle_id: formData.vehicle_id as number,
    date: formData.date,
    odometer_km: formData.odometer_km,
    liters: formData.liters,
    price_per_liter: formData.price_per_liter,
    total_cost: totalCost.value,
  })
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.entry) {
    const entry = props.entry
    formData.vehicle_id = entry.vehicle_id
    formData.date = new Date(entry.date).toISOString().split('T')[0] || ''
    formData.odometer_km = parseFloat(entry.odometer_km.toString())
    formData.liters = parseFloat(entry.liters.toString())
    formData.price_per_liter = parseFloat(entry.price_per_liter.toString())
  } else if (!isOpen) {
    resetForm()
  }
})
</script>
