"use client";

import { useState, useEffect } from "react";
import CoinCard from "./components/CoinCard";
import SkeletonCard from "./components/SkeletonCard";
import type { Coin, CoinApiData } from "./types";

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadCoins() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,the-open-network&vs_currencies=usd&include_24hr_change=true",
        );

        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
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
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadCoins();

    const interval = setInterval(() => {
      loadCoins();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function increasePrice(symbol: string) {
    setCoins((currentCoins) => {
      return currentCoins.map((currentCoin) => {
        if (currentCoin.symbol === symbol) {
          return {
            ...currentCoin,
            price: currentCoin.price + 1000,
          };
        }

        return currentCoin;
      });
    });
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

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <p>Не удалось загрузить данные</p>
          ) : (
            coins.map((coin) => (
              <CoinCard
                key={coin.symbol}
                coin={coin}
                increasePrice={increasePrice}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
