export type ErrorContext = Record<string, unknown>

/** The one call the app needs from Sentry: anything with this shape can receive the errors. */
export interface ErrorSink {
  captureException: (error: unknown, hint?: { extra?: ErrorContext }) => unknown
}
