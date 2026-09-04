import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FALLBACK_COINS,
  SUPPORTED_COIN_SYMBOLS,
  getCoins,
} from "../../lib/getCoins";
import { formatChange } from "../../utils/formatChange";
import { formatPrice } from "../../utils/formatPrice";

type CoinDetailsPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export function generateStaticParams() {
  return SUPPORTED_COIN_SYMBOLS.map((symbol) => ({
    symbol,
  }));
}

export const dynamicParams = false;

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

  let coins = FALLBACK_COINS;

  try {
    coins = await getCoins();
  } catch {
    coins = FALLBACK_COINS;
  }

  const coin = coins.find((coin) => coin.symbol === normalizedSymbol);

  if (!coin) {
    notFound();
  }

  const changeIsPositive = coin.change >= 0;

  return (
    <main className="app-background min-h-screen px-6 py-10 text-stone-50">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-md border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-50 hover:bg-emerald-300/20"
        >
          Назад
        </Link>

        <header className="mt-10">
          <p className="mb-2 text-sm font-medium uppercase text-emerald-200/70">
            Coin Details
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            {coin.name} ({coin.symbol})
          </h1>

          <p className="mt-3 text-stone-300">
            Live market snapshot from CoinGecko
          </p>
        </header>

        <section className="mt-8 rounded-lg border border-teal-300/15 bg-stone-900/75 p-6 shadow-xl shadow-emerald-950/10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm text-stone-500">Current price</p>

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
            <div className="rounded-lg border border-stone-700/70 bg-stone-950/50 p-4">
              <p className="text-sm text-stone-500">Symbol</p>
              <p className="mt-2 text-lg font-semibold">{coin.symbol}</p>
            </div>

            <div className="rounded-lg border border-stone-700/70 bg-stone-950/50 p-4">
              <p className="text-sm text-stone-500">Name</p>
              <p className="mt-2 text-lg font-semibold">{coin.name}</p>
            </div>

            <div className="rounded-lg border border-stone-700/70 bg-stone-950/50 p-4">
              <p className="text-sm text-stone-500">24h change</p>
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
