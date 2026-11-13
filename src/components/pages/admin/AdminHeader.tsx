import { useFormatter, useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconLogOut } from "@/components/ui/Icons"
import { useAdminSignOut } from "@/hooks/useAdminSignOut"

interface Props { photos: number; guests: number; hidden: number }

// The title and the three numbers that matter, set large in the display face beside it.
export const AdminHeader = ({ photos, guests, hidden }: Props) => {
  const t = useTranslations("admin")
  const format = useFormatter()
  const signOut = useAdminSignOut()
  const stats = [
    { value: photos, label: t("stats.photos", { count: photos }) },
    { value: guests, label: t("stats.guests", { count: guests }) },
    { value: hidden, label: t("stats.hidden", { count: hidden }) },
  ]

  return (
    <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        <p className="text-label"><span className="text-text-subtle">{t("dashboard.eyebrow")}</span></p>
        <h1 className="text-hero"><em>{t("dashboard.title")}</em></h1>
      </div>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
        <dl aria-label={t("stats.label")} className="flex gap-8 md:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dd className="text-title order-first tabular-nums">{format.number(stat.value)}</dd>
              <dt className="text-body-sm">{stat.label}</dt>
            </div>
          ))}
        </dl>
        <Button variant="outlined" size="sm" icon={<IconLogOut className="h-4 w-4" />} onClick={signOut}>{t("dashboard.signOut")}</Button>
      </div>
    </header>
  )
}
