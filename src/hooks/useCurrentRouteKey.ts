import { useMatches } from "react-router"
import { findRouteKey } from "@/utils/route-handles"

export const useCurrentRouteKey = () => findRouteKey(useMatches())
