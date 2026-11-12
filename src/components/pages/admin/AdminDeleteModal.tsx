import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"

interface Props {
  isOpen: boolean
  count: number
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

export const AdminDeleteModal = ({ isOpen, count, loading, onConfirm, onClose }: Props) => {
  const t = useTranslations("admin.delete")
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("title")} size="sm">
      <div className="flex flex-col gap-6">
        <p className="text-body">{t("body", { count })}</p>
        <div className="flex flex-col gap-3">
          <Button size="lg" loading={loading} onClick={onConfirm} className="w-full">
            <span>{t("confirm")}</span>
          </Button>
          <Button variant="outlined" size="lg" onClick={onClose} className="w-full">{t("cancel")}</Button>
        </div>
      </div>
    </Modal>
  )
}
