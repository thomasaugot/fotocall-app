// no-unit-test: prints through a hidden iframe, which needs a real browser
// Prints a standalone HTML document without touching the page: a hidden iframe, removed afterwards.
export const printHtml = (html: string): void => {
  const frame = document.createElement("iframe")
  frame.setAttribute("aria-hidden", "true")
  frame.tabIndex = -1
  frame.style.position = "fixed"
  frame.style.width = "0"
  frame.style.height = "0"
  frame.style.border = "0"
  frame.onload = () => {
    const win = frame.contentWindow
    if (!win) return frame.remove()
    win.addEventListener("afterprint", () => frame.remove())
    win.focus()
    win.print()
  }
  frame.srcdoc = html
  document.body.append(frame)
}
