export default function CourseDetailLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm">
        {[80, 60, 80].map((w, i) => (
          <div key={i} className="h-4 bg-muted animate-pulse rounded" style={{ width: w }} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        <div>
          <div className="h-6 w-64 bg-muted animate-pulse rounded mb-1" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="flex gap-2 border-b pb-2">
        {[60, 80, 60].map((w, i) => (
          <div key={i} className="h-8 bg-muted animate-pulse rounded-lg" style={{ width: w }} />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
