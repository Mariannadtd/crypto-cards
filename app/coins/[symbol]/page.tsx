import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoins } from "../../lib/getCoins";
import { formatChange } from "../../utils/formatChange";
import { formatPrice } from "../../utils/formatPrice";

type CoinDetailsPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export async function generateMetadata({
  params,
}: CoinDetailsPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const normalizedSymbol = symbol.toUpperCase();

  return {
    title: `${normalizedSymbol} | Crypto Cards`,
    description: `Market details for ${normalizedSymbol}`,
  };
}

export default async function CoinDetailsPage({
  params,
}: CoinDetailsPageProps) {
  const { symbol } = await params;
  const normalizedSymbol = symbol.toUpperCase();

  const coins = await getCoins();
  const coin = coins.find((coin) => coin.symbol === normalizedSymbol);

  if (!coin) {
    notFound();
  }

  const changeIsPositive = coin.change >= 0;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex rounded border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Назад
        </Link>

        <header className="mt-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-zinc-500">
            Coin Details
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            {coin.name} ({coin.symbol})
          </h1>

          <p className="mt-3 text-zinc-400">
            Live market snapshot from CoinGecko
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm text-zinc-500">Current price</p>

              <p className="mt-2 text-4xl font-bold">
                ${formatPrice(coin.price)}
              </p>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                changeIsPositive
                  ? "bg-emerald-950 text-emerald-300"
                  : "bg-red-950 text-red-300"
              }`}
            >
              {formatChange(coin.change)}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-500">Symbol</p>
              <p className="mt-2 text-lg font-semibold">{coin.symbol}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-500">Name</p>
              <p className="mt-2 text-lg font-semibold">{coin.name}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-500">24h change</p>
              <p
                className={`mt-2 text-lg font-semibold ${
                  changeIsPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatChange(coin.change)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
