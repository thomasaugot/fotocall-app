import { useState } from "react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconDownload, IconPrint } from "@/components/ui/Icons"
import { Input } from "@/components/ui/Input"
import { OliveBranch } from "@/components/ui/OliveBranch"
import { useQrCode } from "@/hooks/useQrCode"
import { useQrExport } from "@/hooks/useQrExport"
import { svgToDataUrl } from "@/utils/data-url"

type Version = "plain" | "framed"

// The two QR versions: the bare code, or the framed card for the tables. The preview is the
// version you will download; the address under them feeds both.
export const AdminQr = () => {
  const t = useTranslations("admin.qr")
  const tRoot = useTranslations()
  const tHome = useTranslations("home")
  const qr = useQrCode()
  const actions = useQrExport(qr)
  const [version, setVersion] = useState<Version>("framed")
  const src = qr.svg && qr.target ? svgToDataUrl(qr.svg) : null

  return (
    <section aria-labelledby="admin-qr-title" className="flex flex-col gap-6">
      <h2 id="admin-qr-title" className="text-heading">{t("title")}</h2>

      <div role="group" aria-label={t("versions")} className="flex rounded-full bg-surface-2 p-1">
        {(["framed", "plain"] as const).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={version === key ? "filled" : "bare"}
            aria-pressed={version === key}
            className={`flex-1 ${version === key ? "" : "text-text-muted"}`}
            onClick={() => setVersion(key)}
          >
            {key === "framed" ? t("framed") : t("plain")}
          </Button>
        ))}
      </div>

      {qr.isError && <p role="alert" className="text-body-sm"><span className="text-danger">{t("error")}</span></p>}

      {src && version === "framed" && (
        <figure className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 rounded-xl bg-surface px-8 pt-8 pb-6 text-center shadow-lg">
          <span className="text-label"><span className="text-text-subtle">{tHome("occasion")}</span></span>
          <span className="text-wordmark">{tRoot("brand")}</span>
          <img src={src} alt={t("alt", { url: qr.target ?? "" })} width={512} height={512} className="aspect-square w-full" />
          <span className="text-signature">{t("printTitle")}</span>
          <span aria-hidden="true" className="flex items-center gap-2 pt-1">
            <OliveBranch className="h-6 w-6 -scale-x-100" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            <OliveBranch className="h-6 w-6" />
          </span>
        </figure>
      )}
      {src && version === "plain" && (
        <img src={src} alt={t("alt", { url: qr.target ?? "" })} width={512} height={512} className="mx-auto aspect-square w-full max-w-sm rounded-xl bg-surface p-4 shadow-lg" />
      )}

      <div className="flex flex-col gap-3">
        {version === "framed" ? (
          <>
            <Button size="lg" disabled={!actions.ready} icon={<IconDownload className="h-5 w-5" />} onClick={() => void actions.downloadCard()}>{t("card")}</Button>
            <Button variant="outlined" disabled={!actions.ready} icon={<IconPrint className="h-5 w-5" />} onClick={actions.print}>{t("print")}</Button>
          </>
        ) : (
          <>
            <Button size="lg" disabled={!actions.ready} icon={<IconDownload className="h-5 w-5" />} onClick={() => void actions.downloadPng()}>{t("png")}</Button>
            <Button variant="outlined" disabled={!actions.ready} icon={<IconDownload className="h-5 w-5" />} onClick={actions.downloadSvg}>{t("svg")}</Button>
          </>
        )}
      </div>

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
    </section>
  )
}
