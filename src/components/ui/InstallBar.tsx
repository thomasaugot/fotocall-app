import { useState } from "react"
import { useTranslations } from "use-intl"
import { BrandMark } from "@/components/ui/BrandMark"
import { Button } from "@/components/ui/Button"
import { IconClose, IconDownload } from "@/components/ui/Icons"
import { useLoaderGone } from "@/hooks/useAppReady"
import { InstallSteps } from "@/components/ui/InstallSteps"
import { useInstallPrompt } from "@/hooks/useInstallPrompt"

// A bar fixed to the bottom of the screen, under the thumb, until the guest installs or says
// "not now". Only when the browser offers install, or on iOS Safari (which never does: a hint
// instead). Never while the loader is up, gone for good once installed or dismissed.
export const InstallBar = () => {
  const t = useTranslations("pwa")
  const loaderGone = useLoaderGone()
  const { offer, install, dismiss } = useInstallPrompt()
  const [stepsOpen, setStepsOpen] = useState(false)
  if (!loaderGone || offer === "none") return null

  return (
    <>
    <aside
      aria-label={t("installTitle")}
      className="z-toast fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] mx-auto grid max-w-md [grid-template-columns:auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-4 rounded-xl bg-primary p-4 pr-2 shadow-lg"
      data-ground="ink"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface">
        <BrandMark className="h-7 w-7" />
      </span>
      <p className="flex min-w-0 flex-col gap-0.5">
        <span className="text-button leading-snug text-on-primary">{t("installTitle")}</span>
        <span className="text-body-sm"><span className="text-on-primary/80">{offer === "ios-hint" ? t("iosHint") : t("installBody")}</span></span>
      </p>
      <Button variant="bare" size="sm" aria-label={t("installDismiss")} icon={<IconClose className="h-5 w-5 text-on-primary" />} onClick={dismiss} className="-mt-2" />
      {offer === "prompt" && (
        <Button variant="inverse" size="sm" icon={<IconDownload className="h-4 w-4" />} onClick={() => void install()} className="col-span-full mr-2">{t("install")}</Button>
      )}
      {offer === "ios-hint" && (
        <Button variant="inverse" size="sm" onClick={() => setStepsOpen(true)} className="col-span-full mr-2">{t("how")}</Button>
      )}
    </aside>
    <InstallSteps isOpen={stepsOpen} onClose={() => setStepsOpen(false)} />
    </>
  )
}
