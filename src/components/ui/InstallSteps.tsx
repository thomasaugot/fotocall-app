import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconAddHome, IconCheck, IconShare } from "@/components/ui/Icons"
import { Modal } from "@/components/ui/Modal"

const STEPS = [
  { key: "step1", Icon: IconShare },
  { key: "step2", Icon: IconAddHome },
  { key: "step3", Icon: IconCheck },
] as const

// iPhone Safari cannot install from a button: the three taps, shown one under the other.
export const InstallSteps = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const t = useTranslations("pwa")
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("howTitle")} size="sm">
      <ol className="flex flex-col gap-5">
        {STEPS.map(({ key, Icon }) => (
          <li key={key} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-2">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
            </span>
            <p className="text-body">{t(key)}</p>
          </li>
        ))}
      </ol>
      <Button size="lg" className="mt-8 w-full" onClick={onClose}>{t("understood")}</Button>
    </Modal>
  )
}
