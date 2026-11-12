import { useEffect } from "react"
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from "react-router"
import { appConfig } from "@/config/app.config"
import type { ErrorContext } from "@/types/error-reporter"
import { createErrorReporter } from "@/utils/error-reporter"

// The ONLY file that names the Sentry SDK, and only inside import(): a static import puts ~100 KB
// in the first page (13-MONITORING, 14-PERFORMANCE budget). A build without a DSN never loads it.
export const sentryEnabled = !!appConfig.sentryDsn && appConfig.isProd

const reporter = createErrorReporter()

export const startErrorReporting = (): void => {
  if (!sentryEnabled || !appConfig.sentryDsn) return
  const dsn = appConfig.sentryDsn
  void reporter.start(async () => {
    const Sentry = await import("@sentry/react")
    Sentry.init({
      dsn,
      environment: appConfig.siteUrl,
      tracesSampleRate: 0.1,
      // Guests' names and photos never leave for Sentry (11-SECURITY → Logging).
      dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
      ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "ResizeObserver loop completed with undelivered notifications",
        "AbortError",
        "Non-Error promise rejection captured",
      ],
      denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /^safari-(web-)?extension:\/\//],
      integrations: [Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes,
      })],
    })
    return Sentry
  })
}

export const reportError = (error: unknown, extra?: ErrorContext): void => reporter.report(error, extra)
