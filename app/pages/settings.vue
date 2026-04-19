<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold text-text-primary">Settings</h2>
      <p class="text-sm text-text-muted">Configure your preferences</p>
    </div>

    <BaseCard title="General" description="Application preferences">
      <div class="max-w-md space-y-4">
        <BaseInput
          v-model="currency"
          label="Currency"
          placeholder="USD"
        />
        <BaseInput
          v-model="distanceUnit"
          label="Distance Unit"
          placeholder="km"
        />
        <BaseButton>Save Changes</BaseButton>
      </div>
    </BaseCard>

    <BaseCard title="Data" description="Manage your data">
      <p class="text-sm text-text-muted">Export and import functionality will be available in a future update.</p>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const currency = ref('USD')
const distanceUnit = ref('km')
</script>
