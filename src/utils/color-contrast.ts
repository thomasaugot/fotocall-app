export type Rgb = { r: number; g: number; b: number }

const channel = (value: number): number => {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export const luminance = ({ r, g, b }: Rgb): number => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

// WCAG contrast ratio, 1 to 21.
export const contrastRatio = (a: Rgb, b: Rgb): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0")

export const rgbToHex = ({ r, g, b }: Rgb): string => `#${hex2(r)}${hex2(g)}${hex2(b)}`
