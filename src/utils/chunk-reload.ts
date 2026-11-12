export const CHUNK_RELOAD_KEY = "chunk-reload-at"
const WINDOW_MS = 10_000

// After a deploy an open tab asks for chunks that no longer exist (13-MONITORING). Reload once to
// fetch the new index.html; never twice within 10 s, so a genuinely missing chunk cannot loop.
export const shouldReloadForChunk = (now: number, lastReloadAt: string | null): boolean => {
  const last = Number(lastReloadAt ?? 0)
  return !Number.isFinite(last) || now - last >= WINDOW_MS
}
