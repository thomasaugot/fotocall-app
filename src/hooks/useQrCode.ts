import { useDeferredValue, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { qrSvg } from "@/services/qr"
import { resolveCssColor } from "@/utils/css-color"
import { normalizeQrTarget } from "@/utils/qr-target"
import { readQrColors } from "@/utils/qr-colors"
import type { QrColors } from "@/types/admin"

const currentColors = (): QrColors => readQrColors(getComputedStyle(document.documentElement), resolveCssColor)

// The address behind the QR (the app's own origin until edited) and its SVG. `target` is null
// while the field holds something that is not a web address.
export const useQrCode = () => {
  const [input, setInput] = useState(() => window.location.origin)
  const deferred = useDeferredValue(input)
  const target = normalizeQrTarget(deferred)

  const query = useQuery({
    queryKey: ["admin-qr", target],
    enabled: target !== null,
    staleTime: Infinity,
    queryFn: async () => {
      const colors = currentColors()
      return { colors, svg: await qrSvg(target as string, colors) }
    },
  })

  return {
    input,
    setInput,
    invalid: normalizeQrTarget(input) === null,
    target,
    svg: query.data?.svg,
    colors: query.data?.colors,
    isError: query.isError,
  }
}
