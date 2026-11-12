import { useState, type SubmitEvent } from "react"
import { useTranslations } from "use-intl"
import { AdminPasswordField } from "@/components/pages/admin/AdminPasswordField"
import { Button } from "@/components/ui/Button"
import { useAdminSignIn } from "@/hooks/useAdminSignIn"
import { announce } from "@/utils/announce"

export const AdminLogin = () => {
  const t = useTranslations("admin.login")
  const [password, setPassword] = useState("")
  const signIn = useAdminSignIn()

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!password) return
    signIn.mutate(password, { onError: () => announce(t("error"), "assertive") })
  }

  return (
    <section aria-labelledby="admin-title" className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 pt-12 pb-16">
      <div className="flex flex-col gap-3">
        <h1 id="admin-title" className="text-title">{t("title")}</h1>
        <p className="text-body">{t("body")}</p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <AdminPasswordField
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={signIn.isError ? t("error") : undefined}
        />
        <Button type="submit" size="lg" loading={signIn.isPending} className="w-full">{t("submit")}</Button>
      </form>
    </section>
  )
}
