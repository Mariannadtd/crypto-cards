import Link from "next/link";
import type { Coin } from "../types";
import { formatPrice } from "../utils/formatPrice";
import { formatChange } from "../utils/formatChange";
import Button from "./UI/Button";

type CoinCardProps = {
  coin: Coin;
  isCollected?: boolean;
  isCollecting?: boolean;
  canCollect?: boolean;
  onCollect?: (symbol: string) => void;
};

const COIN_THEMES: Record<string, { badge: string; border: string }> = {
  BTC: {
    badge: "bg-amber-300/15 text-amber-100 ring-amber-300/30",
    border: "hover:border-amber-300/35",
  },
  ETH: {
    badge: "bg-cyan-300/15 text-cyan-100 ring-cyan-300/30",
    border: "hover:border-cyan-300/35",
  },
  SOL: {
    badge: "bg-emerald-300/15 text-emerald-100 ring-emerald-300/30",
    border: "hover:border-emerald-300/35",
  },
  TON: {
    badge: "bg-sky-300/15 text-sky-100 ring-sky-300/30",
    border: "hover:border-sky-300/35",
  },
};

export default function CoinCard({
  coin,
  isCollected = false,
  isCollecting = false,
  canCollect = false,
  onCollect,
}: CoinCardProps) {
  const theme = COIN_THEMES[coin.symbol] ?? {
    badge: "bg-stone-700 text-stone-100 ring-stone-500/30",
    border: "hover:border-stone-500",
  };
  const collectDisabled =
    isCollected || isCollecting || !canCollect || onCollect === undefined;
  const collectLabel = isCollected
    ? "Collected"
    : isCollecting
      ? "Collecting..."
      : "Collect";

  return (
    <article
      className={`rounded-lg border border-stone-700/70 bg-stone-900/80 p-6 shadow-xl shadow-black/15 transition hover:-translate-y-1 hover:bg-stone-800/80 ${theme.border}`}
    >
      <Link href={`/coins/${coin.symbol}`} className="block">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-stone-50">{coin.name}</h2>
            <p className="mt-1 text-sm text-stone-500">{coin.symbol}</p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-1 ${theme.badge}`}
          >
            {coin.symbol[0]}
          </div>
        </div>

        <p className="text-2xl font-bold text-stone-50">
          ${formatPrice(coin.price)}
        </p>

        <p
          className={`mt-2 text-sm font-medium ${
            coin.change >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {formatChange(coin.change)}
        </p>
      </Link>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-700/60 pt-4">
        <Link
          href={`/coins/${coin.symbol}`}
          className="text-sm font-medium text-stone-400 transition hover:text-stone-100"
        >
          Details
        </Link>

        <Button
          onClick={() => onCollect?.(coin.symbol)}
          disabled={collectDisabled}
          className="min-w-28"
        >
          {collectLabel}
        </Button>
      </div>
    </article>
  );
}
