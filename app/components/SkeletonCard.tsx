export default function SkeletonCard() {
  return (
    <article className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-5 w-24 rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-12 rounded bg-zinc-800" />
        </div>

        <div className="h-10 w-10 rounded-full bg-zinc-800" />
      </div>

      <div className="h-8 w-32 rounded bg-zinc-800" />
      <div className="mt-3 h-4 w-16 rounded bg-zinc-800" />
    </article>
  );
}
