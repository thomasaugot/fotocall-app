import { useEffect } from "react"
import { Outlet } from "react-router"
import { IntlProvider } from "use-intl"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { PageShell } from "@/components/layout/PageShell"
import { Providers } from "@/components/layout/Providers"
import { SkipLink } from "@/components/ui/SkipLink"
import { appConfig } from "@/config/app.config"
import { useLocaleData } from "@/hooks/useLocaleData"
import { createMessageFallback, handleIntlError } from "@/utils/intl-handlers"

const messageFallback = createMessageFallback(appConfig.isDev)

export const RootLayout = () => {
  const { locale, messages } = useLocaleData()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      timeZone={appConfig.timeZone}
      onError={handleIntlError}
      getMessageFallback={messageFallback}
    >
      <Providers>
        <SkipLink targetId="main-content" />
        <Navbar />
        <PageShell>
          <Outlet />
        </PageShell>
        <Footer />
      </Providers>
    </IntlProvider>
  )
}
