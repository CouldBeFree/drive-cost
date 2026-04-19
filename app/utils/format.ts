export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function formatKm(km: number): string {
  return `${formatNumber(km, 0)} km`
}

export function formatLiters(liters: number): string {
  return `${formatNumber(liters, 2)} L`
}

export function formatConsumption(lPer100km: number): string {
  return `${formatNumber(lPer100km, 1)} L/100km`
}
