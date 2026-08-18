"use client";

import { useCallback, useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import SkeletonCard from "./components/SkeletonCard";
import Button from "./components/UI/Button";
import type { Coin, CoinApiData } from "./types";

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadCoins = useCallback(async function () {
    setRefreshing(true);
    setError("");

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,the-open-network&vs_currencies=usd&include_24hr_change=true",
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Слишком много запросов. Подожди немного и попробуй снова.",
          );
        }

        throw new Error("Ошибка загрузки данных.");
      }

      const data: CoinApiData = await response.json();

      const newCoins: Coin[] = [
        {
          name: "Bitcoin",
          symbol: "BTC",
          price: data.bitcoin.usd,
          change: data.bitcoin.usd_24h_change,
        },
        {
          name: "Ethereum",
          symbol: "ETH",
          price: data.ethereum.usd,
          change: data.ethereum.usd_24h_change,
        },
        {
          name: "Solana",
          symbol: "SOL",
          price: data.solana.usd,
          change: data.solana.usd_24h_change,
        },
        {
          name: "Toncoin",
          symbol: "TON",
          price: data["the-open-network"].usd,
          change: data["the-open-network"].usd_24h_change,
        },
      ];

      setCoins(newCoins);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

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

          {lastUpdated && (
            <p className="mt-2 text-sm text-zinc-500">
              Последнее обновление: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </header>

        {error && !loading && (
          <p className="mb-5 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <Button onClick={loadCoins} disabled={refreshing} className="mb-5">
          {refreshing ? "Обновляется..." : "Обновить"}
        </Button>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
          ) : coins.length > 0 ? (
            coins.map((coin) => <CoinCard key={coin.symbol} coin={coin} />)
          ) : (
            <p>Не удалось загрузить данные</p>
          )}
        </section>
      </div>
    </main>
  );
}
