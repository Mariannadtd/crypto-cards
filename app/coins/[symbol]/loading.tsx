export default function CoinDetailsLoading() {
  return (
    <main className="app-background min-h-screen px-6 py-10 text-stone-50">
      <div className="mx-auto max-w-4xl">
        <div className="h-10 w-24 animate-pulse rounded-md border border-stone-700/70 bg-stone-900/80" />

        <div className="mt-10">
          <div className="mb-3 h-4 w-32 animate-pulse rounded bg-stone-800" />
          <div className="h-10 w-64 animate-pulse rounded bg-stone-800" />
          <div className="mt-4 h-5 w-72 animate-pulse rounded bg-stone-800" />
        </div>

        <section className="mt-8 rounded-lg border border-teal-300/15 bg-stone-900/75 p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-stone-800" />
              <div className="mt-3 h-12 w-48 animate-pulse rounded bg-stone-800" />
            </div>

            <div className="h-10 w-24 animate-pulse rounded-full bg-stone-800" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-700/70 bg-stone-950/50 p-4">
              <div className="h-4 w-16 animate-pulse rounded bg-stone-800" />
              <div className="mt-3 h-6 w-20 animate-pulse rounded bg-stone-800" />
            </div>

            <div className="rounded-lg border border-stone-700/70 bg-stone-950/50 p-4">
              <div className="h-4 w-14 animate-pulse rounded bg-stone-800" />
              <div className="mt-3 h-6 w-28 animate-pulse rounded bg-stone-800" />
            </div>

            <div className="rounded-lg border border-stone-700/70 bg-stone-950/50 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-stone-800" />
              <div className="mt-3 h-6 w-20 animate-pulse rounded bg-stone-800" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
