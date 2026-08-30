"use client";

import { useState } from "react";
import Button from "./UI/Button";
import { getMyCryptoCards } from "../lib/getMyCryptoCards";
import { mintCryptoCard } from "../lib/mintCryptoCard";

export default function MyCryptoCards() {
  const [cards, setCards] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mintingSymbol, setMintingSymbol] = useState<string | null>(null);

  async function loadMyCards() {
    setError("");
    setIsLoading(true);

    try {
      const myCards = await getMyCryptoCards();

      setCards(myCards);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Не удалось загрузить карточки");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMint(symbol: string) {
    setError("");
    setMintingSymbol(symbol);

    try {
      await mintCryptoCard(symbol);

      const myCards = await getMyCryptoCards();
      setCards(myCards);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Не удалось создать карточку");
      }
    } finally {
      setMintingSymbol(null);
    }
  }

  return (
    <section className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">My Crypto Cards</h2>

        <Button onClick={loadMyCards} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load cards"}
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="mb-4 flex flex-wrap gap-2">
        {["BTC", "ETH", "SOL", "TON"].map((symbol) => (
          <Button
            key={symbol}
            onClick={() => handleMint(symbol)}
            disabled={mintingSymbol !== null}
          >
            {mintingSymbol === symbol
              ? `Minting ${symbol}...`
              : `Mint ${symbol}`}
          </Button>
        ))}
      </div>

      {cards.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {cards.map((card, index) => (
            <li
              key={`${card}-${index}`}
              className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
            >
              {card}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">Карточек пока нет</p>
      )}
    </section>
  );
}
