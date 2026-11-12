import { useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { IconAlert, IconCheck, IconClose, IconInfo, IconWarning } from "@/components/ui/Icons"
import { TOAST_DURATION } from "@/constants/toast"
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { useToastStore } from "@/stores/toast-store"
import type { Toast } from "@/types/toast"
import { announce } from "@/utils/announce"
import { initDropIn } from "@/utils/animations/drop-in"
import { useTranslations } from "use-intl"

const ICON = { success: IconCheck, error: IconAlert, warning: IconWarning, info: IconInfo } as const
const TONE = { success: "text-success", error: "text-danger", warning: "text-warning", info: "text-info" } as const

export const ToastItem = ({ toast }: { toast: Toast }) => {
  const t = useTranslations("toast")
  const dismiss = useToastStore((s) => s.dismiss)
  const { preference } = useMotionPreference()
  const rootRef = useGSAPAnimations<HTMLLIElement>(() => ({
    critical: [(root) => initDropIn(root, preference === "reduced")],
  }), [preference])

  // The timer starts on MOUNT, i.e. once the loader has gone: the toast keeps its full time.
  useEffect(() => {
    announce(toast.message, toast.type === "error" ? "assertive" : "polite")
    const timer = window.setTimeout(() => dismiss(toast.id), TOAST_DURATION[toast.type])
    return () => window.clearTimeout(timer)
  }, [toast, dismiss])

  const Icon = ICON[toast.type]

  return (
    <li ref={rootRef}>
      <div
        data-anim="drop-in"
        className="invisible flex w-[min(100vw-2rem,26rem)] items-center gap-3 rounded-xl border border-border bg-surface py-2 pr-2 pl-4 shadow-md"
      >
        <Icon className={`h-[1.15rem] w-[1.15rem] shrink-0 ${TONE[toast.type]}`} />
        <p className="text-body grow">{toast.message}</p>
        <Button
          variant="outlined"
          size="sm"
          className="border-transparent"
          aria-label={t("dismiss")}
          icon={<IconClose className="h-4 w-4" />}
          onClick={() => dismiss(toast.id)}
        />
      </div>
    </li>
  )
}
