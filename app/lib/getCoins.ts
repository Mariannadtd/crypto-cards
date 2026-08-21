import { z } from "zod";
import type { Coin } from "../types";

const COINGECKO_PRICES_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,the-open-network&vs_currencies=usd&include_24hr_change=true";

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

export async function getCoins(): Promise<Coin[]> {
  const response = await fetch(COINGECKO_PRICES_URL);

  if (!response.ok) {
    if (response.status === 429) {
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

  return newCoins;
}
