import type { Metadata } from "next";
import CryptoDashboard from "./components/CryptoDashboard";
import { getCoins } from "./lib/getCoins";
import type { Coin } from "./types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crypto Cards",
  description: "Live cryptocurrency prices for BTC, ETH, SOL and TON",
};

export default async function Home() {
  let initialCoins: Coin[] = [];
  let initialError = "";
  let initialLastUpdated: string | null = null;

  try {
    initialCoins = await getCoins();
    initialLastUpdated = new Date().toISOString();
  } catch (error) {
    if (error instanceof Error) {
      initialError = error.message;
    } else {
      initialError = "Неизвестная ошибка.";
    }
  }

  return (
    <main className="app-background min-h-screen px-6 py-10 text-stone-50">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase text-emerald-200/70">
            Crypto Cards
          </p>

          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-stone-50 sm:text-5xl">
            Cryptocurrency market
          </h1>

          <p className="mt-3 text-stone-300">Current prices and market data</p>
        </header>

        <CryptoDashboard
          initialCoins={initialCoins}
          initialError={initialError}
          initialLastUpdated={initialLastUpdated}
        />
      </div>
    </main>
  );
}
