type Numeric = number | string | null | undefined

const PLACEHOLDER = '—'

function toFiniteNumber(value: Numeric): number | null {
  if (value == null) return null
  const num = typeof value === 'string' ? parseFloat(value) : value
  return Number.isFinite(num) ? num : null
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Locale-formatted decimal with fixed precision. Tolerates string-typed numbers
 * (pg returns NUMERIC as string) and returns "—" for null/NaN values.
 */
export function formatNumber(value: Numeric, decimals = 2, fallback = PLACEHOLDER): string {
  const num = toFiniteNumber(value)
  if (num === null) return fallback
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Locale-formatted integer. Tolerates string-typed numbers and returns "—" for null/NaN.
 */
export function formatInteger(value: Numeric, fallback = PLACEHOLDER): string {
  const num = toFiniteNumber(value)
  if (num === null) return fallback
  return Math.round(num).toLocaleString('en-US')
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Short numeric date (e.g. "15.05.2026"). Defaults to uk-UA locale.
 */
export function formatDateShort(dateString: string, locale = 'uk-UA'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Compact number rendering: no thousands separator, trims trailing zeros after decimals.
 * Used in dense tables to keep columns narrow (e.g. "120000", "12.5").
 */
export function formatLooseNumber(value: Numeric, fallback = PLACEHOLDER): string {
  const num = toFiniteNumber(value)
  if (num === null) return fallback
  return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '')
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
