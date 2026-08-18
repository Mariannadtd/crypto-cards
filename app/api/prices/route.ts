import { NextResponse } from "next/server";
import type { Coin, CoinApiData } from "../../types";

export async function GET() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,the-open-network&vs_currencies=usd&include_24hr_change=true",
  );

  if (!response.ok) {
    const message =
      response.status === 429
        ? "Слишком много запросов. Подожди немного и попробуй снова."
        : "Ошибка загрузки данных.";

    return NextResponse.json({ message }, { status: response.status });
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

  return NextResponse.json(newCoins);
}
