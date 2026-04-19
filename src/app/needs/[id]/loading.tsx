import { Skeleton } from "@/components/ui/Skeleton"

export default function NeedDetailLoading() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Media & Story */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
            
            <div className="flex flex-col gap-6">
              <Skeleton className="h-12 w-3/4" />
              
              {/* Impact Highlight */}
              <div className="p-6 bg-surface-variant/30 border border-outline-variant rounded-2xl flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Pledge & Profile Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Pledge Card */}
            <div className="p-8 rounded-3xl bg-surface border-2 border-outline-variant/20 shadow-xl flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between mt-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-outline-variant/30">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>

              <Skeleton className="h-14 w-full rounded-full" />

              <div className="p-4 bg-surface-variant/30 rounded-2xl">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Tradesperson Profile Quick View */}
            <div className="p-6 rounded-3xl bg-surface-variant/30 border border-outline-variant flex flex-col gap-4">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            {/* Recent Backers */}
            <div className="p-6 rounded-3xl bg-surface border border-outline-variant flex flex-col gap-4">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="pt-4 first:pt-0 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}