import { defaultLocale, type Locale } from "@/config/i18n.config"
import { deepMerge } from "@/utils/deep-merge"

type Json = Record<string, unknown>

// Each file is its own chunk: only the active locale (plus the default fallback) downloads.
const files = import.meta.glob<{ default: Json }>("@/locales/*/*.json")

export const fileKey = (path: string): string => path.split("/").at(-1)?.replace(/\.json$/, "") ?? ""

const loadLocale = async (locale: Locale): Promise<Json> => {
  const own = Object.entries(files).filter(([path]) => path.includes(`/locales/${locale}/`))
  const loaded = await Promise.all(own.map(async ([path, load]) => [fileKey(path), (await load()).default] as const))
  const { common, ...pages } = Object.fromEntries(loaded)
  return { ...(common as Json | undefined), ...pages }
}

export const loadMessages = async (locale: Locale): Promise<Json> =>
  locale === defaultLocale
    ? loadLocale(locale)
    : deepMerge(await loadLocale(defaultLocale), await loadLocale(locale))
