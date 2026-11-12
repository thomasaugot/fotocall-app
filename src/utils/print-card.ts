import type { PrintCardText, QrColors } from "@/types/admin"

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }
export const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (c) => ESCAPES[c])

// A single printable sheet: the QR big, the call to action, the app name. Every value is escaped;
// the svg is the qrcode library's own output. Colours come from the theme (QrColors), never literals.
export const buildPrintCardHtml = (svg: string, text: PrintCardText, colors: QrColors, lang: string): string => `<!doctype html>
<html lang="${escapeHtml(lang)}"><head><meta charset="utf-8"><title>${escapeHtml(text.appName)}</title>
<style>
@page { margin: 16mm; }
html, body { margin: 0; height: 100%; background: ${colors.light}; color: ${colors.dark}; }
body { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10mm; font-family: Georgia, serif; text-align: center; }
h1 { margin: 0; font-size: 34pt; line-height: 1.1; }
.qr { width: 130mm; height: 130mm; }
.qr svg { width: 100%; height: 100%; display: block; }
p { margin: 0; font-size: 18pt; }
small { font-size: 11pt; word-break: break-all; }
</style></head>
<body>
<h1>${escapeHtml(text.title)}</h1>
<div class="qr">${svg}</div>
<p>${escapeHtml(text.appName)}</p>
<small>${escapeHtml(text.url)}</small>
</body></html>`
