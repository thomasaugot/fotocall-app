import { RELATIVE_TIME_MS } from "@/constants/gallery"
import type { PhotoTimeKind } from "@/types/album"

const dayKey = (date: Date, timeZone: string): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date)

// How a photo's moment is written under it: "hace 5 minutos", then "13:42", and the weekday
// too once the party's day (in the event's time zone) is over.
export const photoTimeKind = (createdAt: string, now: Date, timeZone: string): PhotoTimeKind => {
  const taken = new Date(createdAt)
  if (now.getTime() - taken.getTime() < RELATIVE_TIME_MS) return "relative"
  return dayKey(taken, timeZone) === dayKey(now, timeZone) ? "time" : "day"
}

// A phone whose clock runs behind would read "dentro de 2 minutos": never earlier than the photo.
export const notBefore = (now: Date, createdAt: string): Date => {
  const taken = new Date(createdAt)
  return now.getTime() < taken.getTime() ? taken : now
}
