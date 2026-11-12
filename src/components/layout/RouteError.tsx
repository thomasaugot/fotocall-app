import { useEffect } from "react"
import { useRouteError } from "react-router"
import { useLocale, useTranslations } from "use-intl"
import { PageMeta } from "@/components/layout/PageMeta"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { localizedPath } from "@/i18n/paths"
import { reportError } from "@/lib/sentry"
import { logger } from "@/utils/logger"

export const RouteError = () => {
  const error = useRouteError()
  const t = useTranslations("routeError")
  const locale = useLocale()

  useEffect(() => {
    logger.error("Route error", error)
    reportError(error, { section: "route" })
  }, [error])

  return (
    <section aria-labelledby="page-title" className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 pt-12">
      <PageMeta namespace="routeError" />
      <h1 id="page-title" className="text-title">{t("title")}</h1>
      <p className="text-body max-w-[52ch]">{t("body")}</p>
      <TransitionLink href={localizedPath("home", locale)} className="text-button mt-2 rounded-sm text-primary underline underline-offset-4">
        {t("backHome")}
      </TransitionLink>
    </section>
  )
}
