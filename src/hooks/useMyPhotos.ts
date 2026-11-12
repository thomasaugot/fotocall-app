import { useGuestSession } from "@/hooks/useGuestSession"
import { usePhotos } from "@/hooks/usePhotos"
import { ownPhotos } from "@/utils/own-photos"

export const useMyPhotos = () => {
  const photos = usePhotos()
  const session = useGuestSession()
  return ownPhotos(photos.data, session.data)
}
