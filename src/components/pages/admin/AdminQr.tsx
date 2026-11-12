import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconDownload, IconPrint } from "@/components/ui/Icons"
import { Input } from "@/components/ui/Input"
import { useQrCode } from "@/hooks/useQrCode"
import { useQrExport } from "@/hooks/useQrExport"
import { svgToDataUrl } from "@/utils/data-url"

export const AdminQr = () => {
  const t = useTranslations("admin.qr")
  const qr = useQrCode()
  const actions = useQrExport(qr)

  return (
    <section aria-labelledby="admin-qr-title" className="flex flex-col gap-6">
      <h2 id="admin-qr-title" className="text-heading">{t("title")}</h2>
      <Input
        label={t("urlLabel")}
        hint={t("urlHint")}
        error={qr.invalid ? t("urlError") : undefined}
        name="qr-url"
        type="url"
        inputMode="url"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        value={qr.input}
        onChange={(event) => qr.setInput(event.target.value)}
      />
      {qr.isError && <p role="alert" className="text-body-sm"><span className="text-danger">{t("error")}</span></p>}
      {qr.svg && qr.target && (
        <img
          src={svgToDataUrl(qr.svg)}
          alt={t("alt", { url: qr.target })}
          width={512}
          height={512}
          className="aspect-square w-full max-w-sm self-center rounded-lg shadow-md"
        />
      )}
      <div className="flex flex-col gap-3">
        <Button disabled={!actions.ready} icon={<IconDownload className="h-5 w-5" />} onClick={actions.downloadPng}>{t("png")}</Button>
        <Button variant="outlined" disabled={!actions.ready} icon={<IconDownload className="h-5 w-5" />} onClick={actions.downloadSvg}>{t("svg")}</Button>
        <Button variant="outlined" disabled={!actions.ready} icon={<IconPrint className="h-5 w-5" />} onClick={actions.print}>{t("print")}</Button>
      </div>
    </section>
  )
}
