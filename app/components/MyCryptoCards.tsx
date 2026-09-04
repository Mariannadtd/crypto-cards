"use client";

import Button from "./UI/Button";

type MyCryptoCardsProps = {
  cards: string[];
  error: string;
  isLoading: boolean;
  status: string;
  onLoad: () => void;
};

export default function MyCryptoCards({
  cards,
  error,
  isLoading,
  status,
  onLoad,
}: MyCryptoCardsProps) {
  return (
    <section className="mb-8 rounded-lg border border-cyan-300/15 bg-stone-900/70 p-4 shadow-xl shadow-cyan-950/10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-stone-50">
          My Crypto Cards
        </h2>

        <Button onClick={onLoad} disabled={isLoading} className="min-w-28">
          {isLoading ? "Loading..." : "Load cards"}
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {status && !error && (
        <p className="mb-4 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
          {status}
        </p>
      )}

      {cards.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {cards.map((card, index) => (
            <li
              key={`${card}-${index}`}
              className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100"
            >
              {card}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-500">Карточек пока нет</p>
      )}
    </section>
  );
}
