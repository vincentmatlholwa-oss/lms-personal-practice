export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 lg:p-8 space-y-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-3 w-60 bg-muted rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
            <div className="h-3 w-3/4 bg-muted rounded" />
            <div className="h-2 w-full bg-muted rounded" />
            <div className="h-2 w-1/2 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
