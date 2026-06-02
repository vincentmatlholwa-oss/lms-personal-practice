import Link from "next/link"
import { Home, LayoutDashboard } from "lucide-react"

export default function AppNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-muted-foreground">404</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-8">
          This page does not exist or you may not have access to it.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border bg-background px-5 text-sm font-medium shadow-sm hover:bg-accent transition-all"
          >
            <Home className="w-4 h-4 mr-2" /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}
