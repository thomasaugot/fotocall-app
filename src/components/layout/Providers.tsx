import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { PageLoader } from "@/components/layout/PageLoader"
import { LiveRegion } from "@/components/ui/LiveRegion"
import { Toaster } from "@/components/ui/Toaster"
import { AppReadyProvider } from "@/contexts/AppReadyContext"
import { ScrollProvider } from "@/contexts/ScrollContext"
import { TransitionProvider } from "@/contexts/TransitionContext"
import { MotionPreferenceProvider } from "@/contexts/MotionPreferenceContext"

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppReadyProvider>
        <ScrollProvider>
          <TransitionProvider>
            <MotionPreferenceProvider>
              <PageLoader />
              {children}
              <Toaster />
              <LiveRegion />
            </MotionPreferenceProvider>
          </TransitionProvider>
        </ScrollProvider>
      </AppReadyProvider>
    </QueryClientProvider>
  )
}
