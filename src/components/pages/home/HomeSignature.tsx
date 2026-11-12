import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconEdit } from "@/components/ui/Icons"

interface Props {
  name: string
  // While the name is being typed: what is in the field so far.
  draft: string | null
  onEdit: () => void
}

// The margin of the print, signed. While the guest types, it writes along with them.
export const HomeSignature = ({ name, draft, onEdit }: Props) => {
  const t = useTranslations("home.intro")
  const typing = draft !== null
  return (
    <div className="flex w-full items-center gap-1">
      <p aria-hidden={typing || undefined} className="text-signature min-w-0 truncate py-1">
        {!typing && <span className="sr-only">{t("signedAs")} </span>}
        <span className="text-text">{typing ? draft || t("nameLabel") : name}</span>
      </p>
      {!typing && (
        <Button variant="bare" size="md" aria-label={t("change")} icon={<IconEdit className="h-5 w-5" />} onClick={onEdit} />
      )}
    </div>
  )
}
