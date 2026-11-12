import { useFormatter } from "use-intl"
import { appConfig } from "@/config/app.config"
import { notBefore, photoTimeKind } from "@/utils/photo-time"

interface GalleryTimeProps {
  createdAt: string
  now: Date
}

const CLOCK = { hour: "2-digit", minute: "2-digit" } as const

// "hace 5 min" while the photo is fresh, then the time of day, then the day as well.
export const GalleryTime = ({ createdAt, now }: GalleryTimeProps) => {
  const format = useFormatter()
  const kind = photoTimeKind(createdAt, now, appConfig.timeZone)
  const taken = new Date(createdAt)

  return (
    <time dateTime={createdAt} className="text-body-sm shrink-0">
      {kind === "relative" && format.relativeTime(taken, { now: notBefore(now, createdAt), style: "short" })}
      {kind === "time" && format.dateTime(taken, CLOCK)}
      {kind === "day" && format.dateTime(taken, { weekday: "short", ...CLOCK })}
    </time>
  )
}
