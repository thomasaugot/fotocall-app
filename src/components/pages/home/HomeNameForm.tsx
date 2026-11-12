import { useForm } from "react-hook-form"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { GUEST_NAME_MAX } from "@/constants/upload-limits"
import { announce } from "@/utils/announce"
import { isValidGuestName, normalizeGuestName } from "@/utils/guest-name"

interface Props {
  initialName: string
  onSave: (name: string) => void
  // Every keystroke: the print writes the name on its margin as it is typed.
  onType: (name: string) => void
}

// The first thing the print asks: who signs the photos. Lead up top, the field and its button in
// the lower half, under the thumb.
export const HomeNameForm = ({ initialName, onSave, onType }: Props) => {
  const t = useTranslations("home.intro")
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string }>({
    defaultValues: { name: initialName },
  })

  const submit = handleSubmit(({ name }) => {
    const clean = normalizeGuestName(name)
    onSave(clean)
    announce(`${t("signedAs")} ${clean}`)
  }, () => announce(t("nameError"), "assertive"))

  return (
    <form onSubmit={submit} noValidate className="absolute inset-0 flex flex-col justify-between gap-7 p-6 pt-10">
      <p className="text-body mx-auto max-w-[22ch] text-center">{t("lead")}</p>
      <div className="flex flex-col gap-6">
        <Input
          label={t("nameLabel")}
          hint={t("nameHint")}
          error={errors.name ? t("nameError") : undefined}
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="done"
          maxLength={GUEST_NAME_MAX}
          required
          className="text-signature"
          {...register("name", { validate: isValidGuestName, onChange: (event: { target: { value: string } }) => onType(event.target.value) })}
        />
        <Button type="submit" size="lg" className="w-full">{t("save")}</Button>
      </div>
    </form>
  )
}
