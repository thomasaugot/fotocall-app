import { PageMeta } from "@/components/layout/PageMeta"
import { useTranslations } from "use-intl"

export const HomePage = () => {
  const t = useTranslations("home")
  return (
    <>
      <PageMeta namespace="home" />
      <h1 className="text-title">{t("title")}</h1>
    </>
  )
}
