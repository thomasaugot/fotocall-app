import { useTranslations } from "use-intl"

export const Footer = () => {
  const t = useTranslations("footer")
  return (
    <footer className="mx-auto w-full max-w-5xl px-5 pt-20 pb-32">
      <p className="text-body-sm max-w-[40ch]">{t("privacy")}</p>
    </footer>
  )
}
