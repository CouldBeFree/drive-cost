<template>
  <div class="h-48">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface MonthlyData {
  month: number
  value: number | null
}

interface Props {
  data: MonthlyData[]
  barColor?: string
  valueFormatter?: (value: number | null) => string
  customLabels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  barColor: 'bg-primary',
  valueFormatter: (value: number | null) => value?.toString() ?? '—',
})

const defaultMonthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Mirror of the Tailwind tokens defined in tailwind.config.ts
const BAR_COLOR_MAP: Record<string, string> = {
  'bg-primary': '#3b82f6',
  'bg-secondary': '#8b5cf6',
  'bg-success': '#10b981',
  'bg-warning': '#f59e0b',
  'bg-error': '#ef4444',
}

const getBarColorValue = (): string => {
  return BAR_COLOR_MAP[props.barColor] || BAR_COLOR_MAP['bg-primary']!
}

const chartData = computed(() => {
  // If custom labels provided, use data as-is with those labels
  if (props.customLabels) {
    const labels = props.customLabels
    const values = props.data.map(d => d.value ?? 0)
    
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: getBarColorValue(),
          borderRadius: 4,
          barThickness: 20,
        }
      ]
    }
  }
  
  // Otherwise use default month labels
  const values = defaultMonthLabels.map((_, index) => {
    const month = index + 1
    const monthData = props.data.find(d => d.month === month)
    return monthData?.value ?? 0
  })

  return {
    labels: defaultMonthLabels,
    datasets: [
      {
        data: values,
        backgroundColor: getBarColorValue(),
        borderRadius: 4,
        barThickness: 20,
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return props.valueFormatter(context.parsed.y)
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  }
}
</script>
