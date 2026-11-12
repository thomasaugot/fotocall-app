import { Button } from "@/components/ui/Button"
import { IconCheck } from "@/components/ui/Icons"
import { useMotionPreference } from "@/hooks/useMotionPreference"
import { useTranslations } from "use-intl"

// Layer 2 of reduced motion (05-ANIMATIONS): the visible app override, persisted by the context.
export const MotionToggle = () => {
  const t = useTranslations("motion")
  const { preference, setPreference } = useMotionPreference()
  const reduced = preference === "reduced"

  return (
    <Button
      variant="outlined"
      size="sm"
      aria-pressed={reduced}
      icon={reduced ? <IconCheck className="h-4 w-4" /> : undefined}
      onClick={() => setPreference(reduced ? "full" : "reduced")}
      className="aria-pressed:border-primary aria-pressed:bg-surface-2"
    >
      {t("reduce")}
    </Button>
  )
}
