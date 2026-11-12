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
const TONE = { success: "bg-success", error: "bg-danger", warning: "bg-warning", info: "bg-info" } as const

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
        className="invisible flex w-[min(100vw-2rem,26rem)] items-center gap-3 rounded-full bg-surface p-2 shadow-lg"
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TONE[toast.type]}`}>
          <Icon className="h-5 w-5 text-on-primary" />
        </span>
        <p className="text-body grow">{toast.message}</p>
        <Button
          variant="bare"
          size="sm"
          aria-label={t("dismiss")}
          icon={<IconClose className="h-4 w-4" />}
          onClick={() => dismiss(toast.id)}
        />
      </div>
    </li>
  )
}
