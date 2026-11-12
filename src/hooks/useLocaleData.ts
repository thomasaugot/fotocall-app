import { useMatches, useRouteLoaderData } from "react-router"
import type { Messages } from "@/types/messages"
import { findLocale } from "@/utils/route-handles"

// Locale + messages from the matched locale branch (its loader ran loadMessages).
export const useLocaleData = () => {
  const locale = findLocale(useMatches())
  const messages = useRouteLoaderData(`locale-${locale}`) as Messages
  return { locale, messages }
}
