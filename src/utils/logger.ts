import { appConfig } from "@/config/app.config"

type Level = "debug" | "info" | "warn" | "error"
type Sink = Record<Level, (...args: unknown[]) => void>

// Silent in production: errors reach Sentry through reportError (13-MONITORING), never the console.
export const createLogger = (enabled: boolean, sink: Sink = console): Sink => {
  const write = (level: Level) => (...args: unknown[]) => {
    if (enabled) sink[level](...args)
  }
  return { debug: write("debug"), info: write("info"), warn: write("warn"), error: write("error") }
}

export const logger = createLogger(appConfig.isDev)
