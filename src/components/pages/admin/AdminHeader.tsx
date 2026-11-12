import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconLogOut } from "@/components/ui/Icons"
import { useAdminSignOut } from "@/hooks/useAdminSignOut"

export const AdminHeader = () => {
  const t = useTranslations("admin.dashboard")
  const signOut = useAdminSignOut()
  return (
    <header className="flex flex-col items-start gap-4">
      <h1 className="text-title">{t("title")}</h1>
      <Button variant="outlined" icon={<IconLogOut className="h-5 w-5" />} onClick={signOut}>{t("signOut")}</Button>
    </header>
  )
}
