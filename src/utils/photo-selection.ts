export const toggleId = (selected: ReadonlySet<string>, id: string): Set<string> => {
  const next = new Set(selected)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

// Keeps only ids that still exist (a deleted or refreshed photo must not stay selected).
export const pruneSelection = (selected: ReadonlySet<string>, ids: readonly string[]): Set<string> => {
  const alive = new Set(ids)
  return new Set([...selected].filter((id) => alive.has(id)))
}

export type SelectionState = "none" | "some" | "all"

export const selectionState = (selectedCount: number, total: number): SelectionState =>
  selectedCount === 0 || total === 0 ? "none" : selectedCount >= total ? "all" : "some"
