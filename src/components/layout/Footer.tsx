import { MotionToggle } from "@/components/ui/MotionToggle"
import { useTranslations } from "use-intl"

export const Footer = () => {
  const t = useTranslations("footer")
  return (
    <footer className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 pt-16 pb-10 md:flex-row md:items-center md:justify-between">
      <p className="text-body-sm max-w-[40ch]">{t("privacy")}</p>
      <MotionToggle />
    </footer>
  )
}
