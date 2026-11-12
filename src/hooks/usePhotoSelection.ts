import { useState } from "react"
import { pruneSelection, selectionState, toggleId } from "@/utils/photo-selection"

// Which photos the admin ticked. `ids` are the photos currently in the album: a photo that
// disappears (deleted, refreshed) drops out of the selection by itself.
export const usePhotoSelection = (ids: readonly string[]) => {
  const [raw, setRaw] = useState<Set<string>>(new Set())
  const selected = pruneSelection(raw, ids)
  return {
    selected,
    count: selected.size,
    state: selectionState(selected.size, ids.length),
    toggle: (id: string) => setRaw(toggleId(selected, id)),
    selectAll: () => setRaw(new Set(ids)),
    clear: () => setRaw(new Set()),
  }
}
