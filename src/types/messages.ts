// Declared from the DEFAULT locale's files: a wrong key or namespace is a tsc error.
export type Messages =
  typeof import("@/locales/es/common.json") & {
    home: typeof import("@/locales/es/home.json")
    gallery: typeof import("@/locales/es/gallery.json")
  }
