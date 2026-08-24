export default function CoinDetailsLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="h-10 w-24 animate-pulse rounded border border-zinc-800 bg-zinc-900" />

        <div className="mt-10">
          <div className="mb-3 h-4 w-32 animate-pulse rounded bg-zinc-800" />
          <div className="h-10 w-64 animate-pulse rounded bg-zinc-800" />
          <div className="mt-4 h-5 w-72 animate-pulse rounded bg-zinc-800" />
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="mt-3 h-12 w-48 animate-pulse rounded bg-zinc-800" />
            </div>

            <div className="h-10 w-24 animate-pulse rounded-full bg-zinc-800" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
              <div className="mt-3 h-6 w-20 animate-pulse rounded bg-zinc-800" />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="h-4 w-14 animate-pulse rounded bg-zinc-800" />
              <div className="mt-3 h-6 w-28 animate-pulse rounded bg-zinc-800" />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="mt-3 h-6 w-20 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
