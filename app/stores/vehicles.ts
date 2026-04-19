import { defineStore } from 'pinia'

interface ModelsCache {
  [make: string]: string[]
}

export const useVehiclesStore = defineStore('vehicles', () => {
  const modelsCache = ref<ModelsCache>({})
  const loading = ref(false)

  const fetchModels = async (make: string): Promise<string[]> => {
    // Return cached data if available
    if (modelsCache.value[make]) {
      return modelsCache.value[make]
    }

    loading.value = true
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`
      )
      const data = await response.json()
      const models = data.Results
        .map((item: any) => item.Model_Name)
        .filter((model: string) => model && model.trim())
        .sort()

      // Cache the results
      modelsCache.value[make] = models
      
      return models
    } catch (error) {
      console.error('Failed to fetch models:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  const getModels = (make: string): string[] => {
    return modelsCache.value[make] || []
  }

  const hasModels = (make: string): boolean => {
    return !!modelsCache.value[make]
  }

  return {
    modelsCache,
    loading,
    fetchModels,
    getModels,
    hasModels,
  }
})
