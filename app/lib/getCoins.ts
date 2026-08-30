import { z } from "zod";
import type { Coin } from "../types";

const COINGECKO_PRICES_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,the-open-network&vs_currencies=usd&include_24hr_change=true";

const CACHE_TIME_IN_MS = 60_000;

const coinGeckoCoinSchema = z.object({
  usd: z.number(),
  usd_24h_change: z.number(),
});

const coinApiDataSchema = z.object({
  bitcoin: coinGeckoCoinSchema,
  ethereum: coinGeckoCoinSchema,
  solana: coinGeckoCoinSchema,
  "the-open-network": coinGeckoCoinSchema,
});

let cachedCoins: Coin[] | null = null;
let cachedAt = 0;

export async function getCoins(): Promise<Coin[]> {
  const now = Date.now();

  if (cachedCoins && now - cachedAt < CACHE_TIME_IN_MS) {
    return cachedCoins;
  }

  const response = await fetch(COINGECKO_PRICES_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "crypto-cards-learning-project",
    },
  });

  if (!response.ok) {
    if (cachedCoins) {
      return cachedCoins;
    }

    if (response.status === 403 || response.status === 429) {
      throw new Error(
        "Слишком много запросов. Подожди немного и попробуй снова.",
      );
    }

    throw new Error("Ошибка загрузки данных.");
  }

  const json: unknown = await response.json();

  const result = coinApiDataSchema.safeParse(json);

  if (!result.success) {
    throw new Error("CoinGecko вернул данные в неожиданном формате.");
  }

  const data = result.data;

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

  cachedCoins = newCoins;
  cachedAt = now;

  return newCoins;
}
