"use client"

import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || "An unexpected error occurred during authentication."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try again
          </button>
          <Link
            href="/signin"
            className="inline-flex h-10 items-center justify-center rounded-lg border bg-background px-5 text-sm font-medium shadow-sm hover:bg-accent transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
