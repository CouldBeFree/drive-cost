<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEditMode ? 'Edit Vehicle' : 'Add Vehicle'"
    :description="isEditMode ? 'Update your vehicle details' : 'Fill in your vehicle details'"
    @update:model-value="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Make Field -->
      <div class="group">
        <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Make
        </label>
        <div class="relative">
          <select
            v-model="formData.make"
            @change="onMakeChange"
            required
            class="w-full appearance-none rounded-xl border-2 border-border bg-background px-4 py-3 pr-10 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            <option value="" disabled>Select manufacturer</option>
            <option v-for="make in makes" :key="make" :value="make">{{ make }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Model Field -->
      <div class="group">
        <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Model
        </label>
        <div class="relative">
          <select
            v-model="formData.model"
            :disabled="!formData.make || vehiclesStore.loading"
            required
            class="w-full appearance-none rounded-xl border-2 border-border bg-background px-4 py-3 pr-10 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              {{ vehiclesStore.loading ? 'Loading models...' : !formData.make ? 'Select make first' : 'Select model' }}
            </option>
            <option v-for="model in modelsList" :key="model" :value="model">{{ model }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg v-if="vehiclesStore.loading" class="h-5 w-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Year & License Plate Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Year
          </label>
          <input
            v-model.number="formData.year"
            type="number"
            min="1900"
            :max="currentYear"
            required
            placeholder="2020"
            class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div>
          <label class="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <svg class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Plate
          </label>
          <input
            v-model="formData.license_plate"
            type="text"
            :required="!isEditMode"
            placeholder="AA 1234 BB"
            class="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
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
            {{ isEditMode ? 'Save Changes' : 'Add Vehicle' }}
          </span>
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Vehicle } from '~/types'

interface Props {
  modelValue: boolean
  vehicle?: Vehicle | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { make: string; model: string; year: number; license_plate: string }]
}>()

const vehiclesStore = useVehiclesStore()
const currentYear = new Date().getFullYear()

const isEditMode = computed(() => !!props.vehicle)

const modelsList = ref<string[]>([])
const loading = ref(false)

const formData = reactive({
  make: '',
  model: '',
  year: currentYear,
  license_plate: '',
})

const makes = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet',
  'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC',
  'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini',
  'Land Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda', 'McLaren',
  'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Polestar', 'Porsche',
  'Ram', 'Rivian', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen',
  'Volvo'
]

const onMakeChange = async () => {
  formData.model = ''
  if (formData.make) {
    modelsList.value = await vehiclesStore.fetchModels(formData.make)
  } else {
    modelsList.value = []
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  formData.make = ''
  formData.model = ''
  formData.year = currentYear
  formData.license_plate = ''
  modelsList.value = []
}

const handleSubmit = () => {
  emit('submit', {
    make: formData.make,
    model: formData.model,
    year: formData.year,
    license_plate: formData.license_plate,
  })
}

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.vehicle) {
    formData.make = props.vehicle.make
    formData.model = props.vehicle.model
    formData.year = props.vehicle.year
    formData.license_plate = props.vehicle.license_plate ?? ''
    modelsList.value = await vehiclesStore.fetchModels(props.vehicle.make)
  } else if (!isOpen) {
    resetForm()
  }
})
</script>
