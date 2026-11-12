// The album is laid out like a real one: leaves of prints, each leaf following one of these
// row patterns (prints per row). Leaves are filled from the oldest photo, so a leaf never
// reshuffles when a new photo arrives: only the newest leaf grows.
export const LEAF_TEMPLATES = [[1, 2], [2, 2], [2, 1]] as const

// 14-PERFORMANCE "Long lists": leaves shown at first and added by each "Ver más".
export const LEAVES_PER_STEP = 8

// The first prints of the first leaf are the first screen: loaded eagerly, high priority.
export const PRIORITY_PHOTOS = 2

// width / height: below = portrait, above = landscape, between = square-ish.
export const PORTRAIT_BELOW = 0.9
export const LANDSCAPE_ABOVE = 1.15

// A photo under an hour old reads "hace 5 minutos"; after that, the time of day.
export const RELATIVE_TIME_MS = 60 * 60 * 1000

// Signed URLs live 1 h and every refetch signs new ones: keep the first one for 45 min so the
// same picture is not downloaded again every 30 s.
export const SIGNED_URL_REUSE_MS = 45 * 60 * 1000

// A horizontal drag this long, and clearly more sideways than vertical, changes photo.
export const SWIPE_MIN_PX = 48
export const SWIPE_SIDEWAYS_RATIO = 1.5
