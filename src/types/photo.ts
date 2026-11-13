export type Photo = {
  id: string
  ownerId: string
  guestName: string
  url: string
  // The light grid copy; the full url when the photo has none (uploaded before thumbnails).
  thumbUrl: string
  storagePath: string
  thumbPath: string | null
  width: number
  height: number
  createdAt: string
  // Hidden by the admin: guests never receive it (RLS), the admin sees it marked.
  hidden: boolean
}

export type PreparedImage = {
  blob: Blob
  mime: string
  width: number
  height: number
}

export type PreparedPhoto = PreparedImage & { thumb: PreparedImage }

export type NewPhoto = PreparedPhoto & {
  ownerId: string
  guestName: string
}
