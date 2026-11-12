// no-unit-test: clicks a download link, which needs a real DOM
// Saves a Blob through a temporary link (the browser's own download, nothing leaves the device).
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
