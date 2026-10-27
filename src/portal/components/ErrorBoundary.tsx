import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  // oxlint-disable-next-line typescript/no-explicit-any -- any is acceptable here
  componentDidCatch(error: Error, errorInfo: any) {
    // Log to console in dev, could send to error tracking service
    console.error("React Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-6 p-4 bg-red-50 rounded-lg">
                <summary className="cursor-pointer font-semibold text-red-900 mb-2">Error Details (Dev Only)</summary>
                <pre className="text-xs text-red-800 overflow-auto">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              type="button"
              onClick={() => {
                window.location.href = "/"
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to homepage
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
