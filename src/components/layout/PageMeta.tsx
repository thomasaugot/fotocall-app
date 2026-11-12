import { useTranslations } from "use-intl"

type MetaNamespace = "home" | "gallery" | "notFound" | "routeError"

// React 19 hoists these into <head>. The title also feeds the route announcer (08).
export const PageMeta = ({ namespace }: { namespace: MetaNamespace }) => {
  const t = useTranslations(`${namespace}.meta`)
  return (
    <>
      <title>{t("title")}</title>
      <meta name="description" content={t("description")} />
    </>
  )
}
