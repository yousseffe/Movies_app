export default function Loading() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mx-auto mb-4"></div>
          <div className="h-6 w-full max-w-3xl bg-muted animate-pulse rounded-md mx-auto"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-muted animate-pulse mb-4"></div>
                  <div className="h-6 w-40 bg-muted animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded-md mb-4"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

