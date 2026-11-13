// QR for print: 2048 px square PNG; the on-screen preview is just the SVG scaled by CSS.
export const QR_PNG_SIZE = 2048
export const QR_MARGIN_MODULES = 2
// Dark on light, never below this ratio (a phone camera needs strong contrast to lock on).
export const QR_MIN_CONTRAST = 4.5

export const QR_PNG_FILE = "fotocall-qr.png"
export const QR_SVG_FILE = "fotocall-qr.svg"
export const QR_CARD_FILE = "fotocall-qr-tarjeta.png"
export const ZIP_FILE = "fotocall-fotos.zip"

// Photos fetched at once when zipping: enough to be quick, few enough not to starve a phone.
export const ZIP_CONCURRENCY = 6

// Theme tokens the QR is drawn with (read at runtime, never hard-coded).
export const QR_DARK_TOKEN = "--color-text"
export const QR_LIGHT_TOKEN = "--color-surface"
