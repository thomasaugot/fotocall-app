import { useState, type ChangeEvent } from "react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconEye, IconEyeOff } from "@/components/ui/Icons"
import { Input } from "@/components/ui/Input"

interface Props {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const AdminPasswordField = ({ value, onChange, error }: Props) => {
  const t = useTranslations("admin.login")
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        label={t("passwordLabel")}
        name="password"
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete="current-password"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        required
        className="pr-12"
      />
      <Button
        variant="bare"
        size="sm"
        aria-label={visible ? t("hide") : t("show")}
        aria-pressed={visible}
        icon={visible ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
        onClick={() => setVisible(!visible)}
        className="absolute top-5 right-0 text-text-muted"
      />
    </div>
  )
}
