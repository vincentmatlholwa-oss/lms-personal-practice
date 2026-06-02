import { StatCardSkeleton, CardSkeleton } from "../../../components/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        <div>
          <div className="h-6 w-40 bg-muted animate-pulse rounded mb-1" />
          <div className="h-4 w-56 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}
