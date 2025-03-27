export default function Loading() {
  return (
    <div className="flex flex-col">
      <section className="relative">
        <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh] bg-muted animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="container relative -mt-40 z-10">
          <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
            <div className="hidden md:block">
              <div className="overflow-hidden rounded-lg border bg-muted animate-pulse h-[450px]"></div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded-md w-3/4"></div>
              <div className="h-4 bg-muted animate-pulse rounded-md w-1/2"></div>
              <div className="h-20 bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 bg-muted animate-pulse rounded-md w-40"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="h-10 bg-muted animate-pulse rounded-md w-60 mb-8"></div>
        <div className="space-y-4">
          <div className="h-40 bg-muted animate-pulse rounded-md"></div>
          <div className="h-40 bg-muted animate-pulse rounded-md"></div>
        </div>
      </section>
    </div>
  )
}

