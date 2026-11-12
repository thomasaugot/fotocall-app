import { PageLoading } from "@/components/layout/PageLoading"
import { AdminDashboard } from "@/components/pages/admin/AdminDashboard"
import { AdminLogin } from "@/components/pages/admin/AdminLogin"
import { AdminMeta } from "@/components/pages/admin/AdminMeta"
import { useAdminSession } from "@/hooks/useAdminSession"

// Reached by URL only (not in the navbar). A signed-in guest is not an admin: they see the login.
export const AdminPage = () => {
  const session = useAdminSession()
  if (session.isPending) return <PageLoading />
  return (
    <>
      <AdminMeta />
      {session.data?.isAdmin ? <AdminDashboard /> : <AdminLogin />}
    </>
  )
}
