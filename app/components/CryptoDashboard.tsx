"use client";

import { useState } from "react";
import CoinCard from "./CoinCard";
import Button from "./UI/Button";
import type { Coin } from "../types";

type CryptoDashboardProps = {
  initialCoins: Coin[];
  initialError: string;
  initialLastUpdated: string | null;
};

export default function CryptoDashboard({
  initialCoins,
  initialError,
  initialLastUpdated,
}: CryptoDashboardProps) {
  const [coins, setCoins] = useState<Coin[]>(initialCoins);
  const [error, setError] = useState(initialError);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(
    initialLastUpdated,
  );

  async function loadCoins() {
    setRefreshing(true);
    setError("");

    try {
      const response = await fetch("/api/prices");

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();

        throw new Error(errorData.message ?? "Ошибка загрузки данных.");
      }

      const newCoins: Coin[] = await response.json();

      setCoins(newCoins);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Неизвестная ошибка.");
      }
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <>
      {lastUpdated && (
        <p className="mt-2 text-sm text-zinc-500">
          Последнее обновление: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}

      {error && (
        <p className="mb-5 mt-5 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <Button onClick={loadCoins} disabled={refreshing} className="mb-5 mt-5">
        {refreshing ? "Обновляется..." : "Обновить"}
      </Button>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {coins.length > 0 ? (
          coins.map((coin) => <CoinCard key={coin.symbol} coin={coin} />)
        ) : (
          <p>Не удалось загрузить данные</p>
        )}
      </section>
    </>
  );
}
