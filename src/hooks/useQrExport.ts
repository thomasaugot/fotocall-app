import { useLocale, useTranslations } from "use-intl"
import { QR_PNG_FILE, QR_SVG_FILE } from "@/constants/admin"
import { qrPng } from "@/services/qr"
import { showToast } from "@/stores/toast-store"
import type { QrColors } from "@/types/admin"
import { downloadBlob } from "@/utils/download-blob"
import { logger } from "@/utils/logger"
import { buildPrintCardHtml } from "@/utils/print-card"
import { printHtml } from "@/utils/print-frame"

interface QrSource { target: string | null; svg?: string; colors?: QrColors }

export const useQrExport = ({ target, svg, colors }: QrSource) => {
  const t = useTranslations("admin.qr")
  const root = useTranslations()
  const locale = useLocale()
  const ready = target !== null && !!svg && !!colors
  const guard = (): { target: string; svg: string; colors: QrColors } | null =>
    target !== null && svg && colors ? { target, svg, colors } : null

  const fail = (error: unknown) => {
    logger.error("qr export failed", error)
    showToast(t("error"), "error")
  }

  const downloadPng = async () => {
    const src = guard()
    if (!src) return
    try {
      downloadBlob(await qrPng(src.target, src.colors), QR_PNG_FILE)
      showToast(t("pngSaved"), "success")
    } catch (error) { fail(error) }
  }

  const downloadSvg = () => {
    const src = guard()
    if (!src) return
    downloadBlob(new Blob([src.svg], { type: "image/svg+xml" }), QR_SVG_FILE)
    showToast(t("svgSaved"), "success")
  }

  const print = () => {
    const src = guard()
    if (!src) return
    try {
      printHtml(buildPrintCardHtml(src.svg, { title: t("printTitle"), appName: root("brand"), url: src.target }, src.colors, locale))
    } catch (error) { fail(error) }
  }

  return { ready, downloadPng, downloadSvg, print }
}
