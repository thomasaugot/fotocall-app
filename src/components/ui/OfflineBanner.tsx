import { useTranslations } from "use-intl"
import { IconWifiOff } from "@/components/ui/Icons"
import { useOnline } from "@/hooks/useOnline"

export const OfflineBanner = () => {
  const t = useTranslations("pwa")
  const online = useOnline()
  if (online) return null
  return (
    <div role="status" className="z-toast fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 shadow-lg">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
        <IconWifiOff className="h-5 w-5 text-text" />
      </span>
      <p className="text-body-sm"><span className="text-on-ink">{t("offline")}</span></p>
    </div>
  )
}
