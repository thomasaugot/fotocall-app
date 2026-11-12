import { useEffect, useEffectEvent, useId, useRef, type MouseEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { IconClose } from "@/components/ui/Icons"
import { TOASTER_RAISE_EVENT } from "@/constants/events"
import { useScroll } from "@/hooks/useScroll"
import { useTranslations } from "use-intl"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "full"
}

const SIZE = {
  sm: "w-[min(100%-2rem,26rem)] rounded-xl",
  md: "w-[min(100%-2rem,36rem)] rounded-xl",
  lg: "w-[min(100%-2rem,52rem)] rounded-xl",
  full: "h-dvh max-h-none w-full max-w-none rounded-none",
} as const

// Native <dialog>: focus trap, Escape, focus return, inert page and top layer come free.
export const Modal = ({ isOpen, onClose, title, children, size = "md" }: ModalProps) => {
  const t = useTranslations("modal")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const { lockScroll } = useScroll()
  const lock = useEffectEvent(() => lockScroll())

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return
    dialog.showModal()
    window.dispatchEvent(new Event(TOASTER_RAISE_EVENT))
    const unlock = lock()
    return () => {
      unlock()
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  const handleBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={handleBackdrop}
      className={`m-auto max-h-[calc(100dvh-2rem)] bg-surface p-0 text-text shadow-lg ${SIZE[size]}`}
    >
      <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3">
        <h2 id={titleId} className="text-heading">{title}</h2>
        <Button variant="outlined" size="sm" aria-label={t("close")} icon={<IconClose className="h-4 w-4" />} onClick={onClose} />
      </div>
      <div data-lenis-prevent className="overflow-y-auto px-6 pb-6">
        {children}
      </div>
    </dialog>
  )
}
