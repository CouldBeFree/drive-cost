export function parseId(value: unknown): number {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID parameter' })
  }
  return id
}

export function requireBody<T>(body: T | null | undefined): T {
  if (!body || (typeof body === 'object' && Object.keys(body as object).length === 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Request body is required' })
  }
  return body
}
