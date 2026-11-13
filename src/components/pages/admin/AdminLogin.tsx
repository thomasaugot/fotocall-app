import { useState, type SubmitEvent } from "react"
import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconCheck } from "@/components/ui/Icons"
import { Input } from "@/components/ui/Input"
import { appConfig } from "@/config/app.config"
import { useAdminLink } from "@/hooks/useAdminLink"
import { announce } from "@/utils/announce"

// No password: the admin's email receives a link that signs them in on this page.
export const AdminLogin = () => {
  const t = useTranslations("admin.login")
  const [email, setEmail] = useState(appConfig.adminEmail ?? "")
  const link = useAdminLink()

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    link.mutate(email, {
      onSuccess: () => announce(t("sent", { email: email.trim() })),
      onError: () => announce(t("error"), "assertive"),
    })
  }

  return (
    <section aria-labelledby="admin-title" className="mx-auto flex w-full max-w-md flex-col gap-10 px-5 pt-14 pb-20">
      <div className="flex flex-col gap-3">
        <h1 id="admin-title" className="text-title">{t("title")}</h1>
        <p className="text-body">{t("body")}</p>
      </div>
      {link.isSuccess ? (
        <div role="status" className="flex items-start gap-4 rounded-xl bg-surface p-5 shadow-md">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2">
            <IconCheck className="h-5 w-5 shrink-0 text-success" />
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-body">{t("sent", { email: email.trim() })}</p>
            <Button variant="outlined" size="sm" className="self-start" onClick={() => link.reset()}>{t("again")}</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-8">
          <Input
            label={t("emailLabel")}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={link.isError ? t("error") : undefined}
          />
          <Button type="submit" size="lg" loading={link.isPending} className="w-full">{t("submit")}</Button>
        </form>
      )}
    </section>
  )
}
