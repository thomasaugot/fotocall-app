type Json = Record<string, unknown>

const isPlainObject = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value)

// The default locale is the fallback layer; the active locale is merged on top of it.
export const deepMerge = (base: Json, override: Json): Json => {
  const result: Json = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const current = result[key]
    result[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value
  }
  return result
}
