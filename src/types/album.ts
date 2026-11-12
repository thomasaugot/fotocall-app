import type { Photo } from "@/types/photo"

export type Orientation = "portrait" | "landscape" | "square"

export type AlbumPhoto = Photo & { orientation: Orientation; priority: boolean }

export type AlbumRow = { id: string; kind: "solo" | "duo"; flip: boolean; photos: AlbumPhoto[] }

export type AlbumLeaf = { id: string; rows: AlbumRow[] }

export type AlbumCounts = { photos: number; guests: number }

export type PhotoPlace = { photo: Photo; prev: Photo | null; next: Photo | null }

export type PhotoTimeKind = "relative" | "time" | "day"

export type SwipeMove = "prev" | "next" | null

export type ViewerDirection = -1 | 0 | 1
