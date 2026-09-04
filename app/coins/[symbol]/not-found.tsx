import Link from "next/link";

export default function CoinNotFound() {
  return (
    <main className="app-background min-h-screen px-6 py-10 text-stone-50">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-sm font-medium uppercase text-emerald-200/70">
          Coin Details
        </p>

        <h1 className="text-4xl font-bold tracking-tight">Монета не найдена</h1>

        <p className="mt-3 text-stone-300">
          Такой монеты нет в текущем списке Crypto Cards.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-10 items-center rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-50 hover:bg-emerald-300/20"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
