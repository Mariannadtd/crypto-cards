import type { Coin } from "../types";
import { formatPrice } from "../utils/formatPrice";
import { formatChange } from "../utils/formatChange";

type CoinCardProps = {
  coin: Coin;
};

export default function CoinCard({ coin }: CoinCardProps) {
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

      <p className="text-2xl font-bold">${formatPrice(coin.price)}</p>

      <p
        className={`mt-2 text-sm font-medium ${
          coin.change >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {formatChange(coin.change)}
      </p>
    </article>
  );
}
