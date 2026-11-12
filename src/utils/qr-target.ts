// The address the QR opens: only http(s), normalised; anything else is refused (null).
export const normalizeQrTarget = (input: string): string | null => {
  const text = input.trim()
  if (!text) return null
  try {
    const url = new URL(text)
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}
