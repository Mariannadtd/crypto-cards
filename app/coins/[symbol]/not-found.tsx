import Link from "next/link";

export default function CoinNotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-zinc-500">
          Coin Details
        </p>

        <h1 className="text-4xl font-bold tracking-tight">Монета не найдена</h1>

        <p className="mt-3 text-zinc-400">
          Такой монеты нет в текущем списке Crypto Cards.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
