"use client"

import { RefreshCw, AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-background">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Critical error</h1>
            <p className="text-muted-foreground mb-2">
              Something went wrong. Please try again.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-8 font-mono">
              {error.digest ?? error.message}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={reset}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try again
              </button>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-6 text-sm font-medium shadow-sm hover:bg-accent transition-all"
              >
                <Home className="w-4 h-4 mr-2" /> Go home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
