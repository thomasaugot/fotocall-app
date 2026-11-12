import type { QueryClient } from "@tanstack/react-query"
import { photosQuery } from "@/services/photo-queries"

export const routeModules = {
  gallery: () => import("@/components/pages/gallery/GalleryPage"),
  notFound: () => import("@/components/pages/not-found/NotFoundPage"),
} as const

// A page's primary data, started with its code on intent (14-PERFORMANCE §4).
export const routeData = {
  gallery: (queryClient: QueryClient) => queryClient.prefetchQuery(photosQuery()),
} as const
