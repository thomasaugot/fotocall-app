import { useTranslations } from "use-intl"

// Same job as layout/PageMeta (React 19 hoists these into <head>); kept here so the admin area
// does not touch the shared layout files. noindex is already global (index.html).
export const AdminMeta = () => {
  const t = useTranslations("admin.meta")
  return (
    <>
      <title>{t("title")}</title>
      <meta name="description" content={t("description")} />
    </>
  )
}
