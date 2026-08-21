import CryptoDashboard from "./components/CryptoDashboard";
import { getCoins } from "./lib/getCoins";
import type { Coin } from "./types";

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
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-zinc-500">
            Crypto Cards
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Cryptocurrency market
          </h1>

          <p className="mt-3 text-zinc-400">Current prices and market data</p>
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
