import { useTranslations } from "use-intl"

export const Footer = () => {
  const t = useTranslations("footer")
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pt-20 pb-32 md:px-8 xl:px-12 xl:pt-10">
      <p className="text-body-sm max-w-[40ch]">{t("privacy")}</p>
    </footer>
  )
}
