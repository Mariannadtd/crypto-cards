import { NextResponse } from "next/server";
import { getCoins } from "../../lib/getCoins";

export async function GET() {
  try {
    const newCoins = await getCoins();

    return NextResponse.json(newCoins);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка.";

    const status = message.startsWith("Слишком много запросов") ? 429 : 500;

    return NextResponse.json({ message }, { status });
  }
}
