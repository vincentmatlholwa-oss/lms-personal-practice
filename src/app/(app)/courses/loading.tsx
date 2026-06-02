import { TableSkeleton } from "../../../components/skeleton"

export default function CoursesLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        <div>
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-1" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-28 bg-muted animate-pulse rounded-lg" />
        <div className="h-9 w-36 bg-muted animate-pulse rounded-lg" />
      </div>
      <TableSkeleton rows={6} />
    </div>
  )
}
