import type { Coin } from "../types";

type CoinCardProps = {
  coin: Coin;
  increasePrice: (symbol: string) => void;
};

export default function CoinCard({ coin, increasePrice }: CoinCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{coin.name}</h2>
          <p className="mt-1 text-sm text-zinc-500">{coin.symbol}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold">
          {coin.symbol[0]}
        </div>
      </div>

      <p className="text-2xl font-bold">${coin.price.toLocaleString()}</p>

      <button onClick={() => increasePrice(coin.symbol)}>Поднять цену</button>

      <p
        className={`mt-2 text-sm font-medium ${
          coin.change >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {coin.change >= 0 ? "+" : ""}
        {coin.change.toFixed(2)}%
      </p>
    </article>
  );
}
