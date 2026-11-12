// no-unit-test: writes to live-region nodes in the DOM on the next animation frame
export function announce(message: string, politeness: "polite" | "assertive" = "polite") {
  const el = document.getElementById(politeness === "assertive" ? "live-assertive" : "live-polite")
  if (!el) return
  el.textContent = ""
  requestAnimationFrame(() => { el.textContent = message })
}
