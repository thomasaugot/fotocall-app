import { useRef, type ComponentProps, type MouseEvent } from "react"
import { Link, useLocation } from "react-router"
import { usePageTransition } from "@/hooks/usePageTransition"
import { useScroll } from "@/hooks/useScroll"
import { isExternalHref, isSamePage } from "@/utils/paths"
import { preloadRoute } from "@/utils/preload-route"

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "to"> & { href: string }

export const TransitionLink = ({
  href, onClick, onPointerEnter, onPointerDown, className, ...rest
}: TransitionLinkProps) => {
  const { pathname } = useLocation()
  const { navigateTo, isTransitioning } = usePageTransition()
  const { scrollToTopSmooth } = useScroll()
  const preloaded = useRef(false)
  const external = isExternalHref(href)
  const samePage = !external && isSamePage(href, pathname)

  const preload = () => {
    if (preloaded.current || external || samePage) return
    preloaded.current = true
    void preloadRoute(href)
  }

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (rest.download || (rest.target && rest.target !== "_self")) return
    if (external) return
    if (samePage) {
      event.preventDefault()
      scrollToTopSmooth()
      onClick?.(event)
      return
    }
    event.preventDefault()
    if (isTransitioning) return
    await navigateTo(href)
    onClick?.(event)
  }

  return (
    <Link
      {...rest}
      to={href}
      className={className ? `keyboard-focus-ring ${className}` : "keyboard-focus-ring"}
      onClick={handleClick}
      onPointerEnter={(event) => { preload(); onPointerEnter?.(event) }}
      onPointerDown={(event) => { preload(); onPointerDown?.(event) }}
    />
  )
}
