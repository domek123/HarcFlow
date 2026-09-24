export function DevelopmentProfileSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-6 gap-4 border-b bg-muted/40 px-4 py-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-4 animate-pulse rounded bg-muted" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-4 border-b px-4 py-4 last:border-b-0"
        >
          {Array.from({ length: 6 }).map((__, cellIndex) => (
            <div
              key={cellIndex}
              className="h-4 animate-pulse rounded bg-muted"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
