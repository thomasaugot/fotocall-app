import { useQuery } from "@tanstack/react-query"
import { photosQuery } from "@/services/photo-queries"

export const usePhotos = () => useQuery(photosQuery())
