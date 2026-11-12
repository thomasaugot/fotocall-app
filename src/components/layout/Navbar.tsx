import { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import { BrandMark } from "@/components/ui/BrandMark"
import { TransitionLink } from "@/components/ui/TransitionLink"
import { NAV_HIDE_AFTER_PX, NAV_LINKS, NAV_SOLID_AFTER_PX } from "@/constants/nav"
import { fadeNavBackground } from "@/utils/animations/nav-background"
import { isSamePage } from "@/utils/paths"
import { useLocale, useTranslations } from "use-intl"
import { localizedPath } from "@/i18n/paths"

export const Navbar = () => {
  const t = useTranslations()
  const locale = useLocale()
  const { pathname } = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  // build-navbar: plain scroll listener mounted once, transition set in JS, local variables.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    header.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    header.style.willChange = "transform"

    let lastScrollY = 0
    let isHidden = false
    let isSolid = false

    const handleScroll = () => {
      const y = window.scrollY
      if (y < lastScrollY && isHidden) {
        header.style.transform = "translateY(0)"
        isHidden = false
      } else if (y > lastScrollY && y > NAV_HIDE_AFTER_PX && !isHidden) {
        header.style.transform = `translateY(-${header.offsetHeight}px)`
        isHidden = true
      }
      const solid = y > NAV_SOLID_AFTER_PX
      if (solid !== isSolid) {
        isSolid = solid
        fadeNavBackground(header, solid)
      }
      lastScrollY = y
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      header.style.transform = ""
      header.style.transition = ""
      header.style.willChange = ""
    }
  }, [])

  return (
    <header ref={headerRef} role="banner" aria-label={t("brand")} className="z-nav fixed inset-x-0 top-0 h-16">
      <div data-anim="nav-bg" aria-hidden="true" className="invisible absolute inset-0 bg-surface/90 shadow-sm backdrop-blur-md" />
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-4">
        <TransitionLink href={localizedPath("home", locale)} className="text-wordmark flex items-center gap-2 rounded-full py-2 text-text">
          <BrandMark className="h-6 w-6" />
          {t("brand")}
        </TransitionLink>
        <nav aria-label={t("nav.label")}>
          <ul className="flex items-center">
            {NAV_LINKS.map(({ routeKey, labelKey }) => {
              const href = localizedPath(routeKey, locale)
              const isActive = isSamePage(href, pathname)
              return (
                <li key={routeKey}>
                  <TransitionLink
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className="text-button inline-flex h-10 items-center rounded-full px-3 text-text-muted transition-colors duration-150 hover:text-text aria-[current=page]:bg-surface-2 aria-[current=page]:text-text"
                  >
                    {t(`nav.${labelKey}`)}
                  </TransitionLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
