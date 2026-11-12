export type Photo = {
  id: string
  ownerId: string
  guestName: string
  url: string
  storagePath: string
  width: number
  height: number
  createdAt: string
}

export type PreparedImage = {
  blob: Blob
  mime: string
  width: number
  height: number
}

export type NewPhoto = PreparedImage & {
  ownerId: string
  guestName: string
}
