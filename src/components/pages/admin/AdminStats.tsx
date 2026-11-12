import { useFormatter, useTranslations } from "use-intl"

interface Props { photos: number; guests: number }

export const AdminStats = ({ photos, guests }: Props) => {
  const t = useTranslations("admin.stats")
  const format = useFormatter()
  return (
    <dl aria-label={t("label")} className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1 rounded-xl bg-surface-2 p-5">
        <dd className="text-title order-first tabular-nums">{format.number(photos)}</dd>
        <dt className="text-body-sm">{t("photos", { count: photos })}</dt>
      </div>
      <div className="flex flex-col gap-1 rounded-xl bg-surface-2 p-5">
        <dd className="text-title order-first tabular-nums">{format.number(guests)}</dd>
        <dt className="text-body-sm">{t("guests", { count: guests })}</dt>
      </div>
    </dl>
  )
}
