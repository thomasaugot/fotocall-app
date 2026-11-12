import { useTranslations } from "use-intl"
import { BrandMark } from "@/components/ui/BrandMark"

export const BrandLockup = ({ className = "" }: { className?: string }) => {
  const t = useTranslations()
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark className="h-7 w-7" />
      <span className="text-wordmark">{t("brand")}</span>
    </span>
  )
}
