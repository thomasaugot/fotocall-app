import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { reportError } from "@/lib/sentry"
import messages from "@/locales/es/common.json"
import { logger } from "@/utils/logger"

// The last net, around <RouterProvider>: providers or the layout itself broke. It sits OUTSIDE
// the IntlProvider (that lives in the router), so it reads the default locale's JSON directly
// and links home with a plain <a> (13-MONITORING).
const copy = messages.appError

interface Props { children: ReactNode }
interface State { failed: boolean }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("App crashed", error)
    reportError(error, { section: "app", componentStack: info.componentStack })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main id="main-content" className="flex min-h-svh flex-col items-start justify-center gap-4 bg-bg px-6">
        <h1 className="text-title">{copy.title}</h1>
        <p className="text-body max-w-[52ch]">{copy.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Button onClick={() => window.location.reload()}>{copy.reload}</Button>
          <a href="/" className="keyboard-focus-ring text-button rounded-sm text-primary underline underline-offset-4">
            {copy.home}
          </a>
        </div>
      </main>
    )
  }
}
