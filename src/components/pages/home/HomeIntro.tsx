import { useTranslations } from "use-intl"

// The occasion, then the one line. The lead and the name live inside the window itself.
export const HomeIntro = () => {
  const t = useTranslations("home")
  return (
    <div className="flex flex-col items-center gap-4 text-center xl:items-start xl:self-end xl:text-left">
      <p className="flex flex-col items-center gap-1 xl:items-start">
        <span className="text-label"><span className="text-text-subtle">{t("occasion")}</span></span>
        <span className="text-body-sm">{t("date")}</span>
      </p>
      <h1 id="home-title" className="text-hero max-w-[12ch] text-balance">
        {t.rich("title", { em: (chunks) => <em>{chunks}</em> })}
      </h1>
    </div>
  )
}
