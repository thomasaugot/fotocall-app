import { useTranslations } from "use-intl"
import { Button } from "@/components/ui/Button"
import { IconRefresh, IconUpload, IconWifiOff } from "@/components/ui/Icons"
import { runUploadQueue, useUploadQueue } from "@/hooks/useUploadQueue"
import { discardStuck, refreshCounts, retryStuck } from "@/services/upload-queue"
import { useUploadQueueStore } from "@/stores/upload-queue-store"

const sync = { onChange: (c: { waiting: number; stuck: number }) => useUploadQueueStore.getState().setCounts(c) }

// Photos still on this phone: a small chip at the bottom while they wait or go up. A refused one
// gets its two answers right there.
export const UploadQueueChip = () => {
  const t = useTranslations("queue")
  const { counts, sending } = useUploadQueue()
  if (counts.waiting === 0 && counts.stuck === 0) return null

  return (
    <div role="status" className="z-toast fixed inset-x-3 bottom-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl bg-text py-2.5 pr-2.5 pl-4 shadow-lg">
      {counts.stuck > 0 ? (
        <>
          <span className="text-body-sm"><span className="text-surface">{t("stuck", { count: counts.stuck })}</span></span>
          <Button variant="inverse" size="sm" onClick={() => void retryStuck().then(() => refreshCounts(sync)).then(runUploadQueue)}>{t("retry")}</Button>
          <Button variant="bare" size="sm" className="text-surface" onClick={() => void discardStuck().then(() => refreshCounts(sync))}>{t("discard")}</Button>
        </>
      ) : (
        <span className="inline-flex items-center gap-2 py-1.5 pr-2">
          {sending ? <IconUpload className="h-4 w-4 shrink-0 animate-pulse text-surface" /> : <IconWifiOff className="h-4 w-4 shrink-0 text-surface" />}
          <span className="text-body-sm"><span className="text-surface">{sending ? t("sending", { count: counts.waiting }) : t("waiting", { count: counts.waiting })}</span></span>
          {!sending && (
            <Button variant="bare" size="sm" aria-label={t("retry")} className="text-surface" icon={<IconRefresh className="h-4 w-4" />} onClick={() => void runUploadQueue()} />
          )}
        </span>
      )}
    </div>
  )
}
