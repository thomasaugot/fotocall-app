import { useId, useRef } from "react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconUpload } from "@/components/ui/Icons"

interface Props {
  onFiles: (files: File[]) => void
  // Compact: a round white key beside the shutter. Otherwise a full-width labelled button.
  compact: boolean
  disabled: boolean
}

// Photos already on the phone: the native picker, several at once. The file input stays
// visually hidden; the designed Button opens it.
export const HomeLibraryUpload = ({ onFiles, compact, disabled }: Props) => {
  const t = useTranslations("home.camera")
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <label htmlFor={id} className="sr-only">{t("libraryLabel")}</label>
      <input
        ref={inputRef}
        id={id}
        name="photos"
        type="file"
        accept="image/*"
        multiple
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          event.target.value = ""
          if (files.length) onFiles(files)
        }}
      />
      <Button
        variant={compact ? "inverse" : "outlined"}
        size="lg"
        disabled={disabled}
        className={compact ? "" : "w-full"}
        aria-label={compact ? t("library") : undefined}
        icon={<IconUpload className="h-5 w-5" />}
        onClick={() => inputRef.current?.click()}
      >
        {compact ? null : t("library")}
      </Button>
    </>
  )
}
