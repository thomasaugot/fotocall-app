// "data:image/png;base64,..." to a Blob. Done by hand: fetch() of a data: URL is blocked by the CSP.
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const match = /^data:([^;,]+);base64,(.*)$/s.exec(dataUrl)
  if (!match) throw new Error("Not a base64 data URL")
  const binary = atob(match[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: match[1] })
}

export const svgToDataUrl = (svg: string): string => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
