"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import CoinCard from "./CoinCard";
import Button from "./UI/Button";
import type { Coin } from "../types";
import WalletConnect from "./WalletConnect";
import MyCryptoCards from "./MyCryptoCards";
import { useWallet } from "../hooks/useWallet";
import { CRYPTO_CARDS_CHAIN_ID } from "../lib/cryptoCardsContract";
import { getEthereumErrorMessage } from "../lib/ethereum";
import { getCoins } from "../lib/getCoins";
import { getMyCryptoCards } from "../lib/getMyCryptoCards";
import { mintCryptoCard } from "../lib/mintCryptoCard";

const MarketScene = dynamic(() => import("./MarketScene"), {
  ssr: false,
});

type CryptoDashboardProps = {
  initialCoins: Coin[];
  initialError: string;
  initialLastUpdated: string | null;
};

const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

async function getCoinsFromApiRoute(): Promise<Coin[]> {
  const response = await fetch("/api/prices");

  if (!response.ok) {
    const errorData: { message?: string } = await response.json();

    throw new Error(errorData.message ?? "Ошибка загрузки данных.");
  }

  return response.json();
}

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
  const wallet = useWallet();
  const [myCards, setMyCards] = useState<string[]>([]);
  const [cardsError, setCardsError] = useState("");
  const [cardsStatus, setCardsStatus] = useState("");
  const [loadingCards, setLoadingCards] = useState(false);
  const [collectingSymbol, setCollectingSymbol] = useState<string | null>(null);

  const isSepolia = wallet.chainId === CRYPTO_CARDS_CHAIN_ID;
  const visibleCards = useMemo(
    () => (wallet.account && isSepolia ? myCards : []),
    [isSepolia, myCards, wallet.account],
  );
  const collectedSymbols = useMemo(() => new Set(visibleCards), [visibleCards]);
  const canCollect =
    wallet.account !== null && isSepolia && collectingSymbol === null;

  async function loadCoins() {
    setRefreshing(true);
    setError("");

    try {
      const newCoins = isGithubPages
        ? await getCoins()
        : await getCoinsFromApiRoute();

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

  const loadMyCards = useCallback(async () => {
    if (!wallet.account) {
      setCardsError("Сначала подключи MetaMask");
      return;
    }

    if (!isSepolia) {
      setCardsError("Переключи MetaMask на Sepolia");
      return;
    }

    try {
      setCardsError("");
      setCardsStatus("");
      setLoadingCards(true);

      const cards = await getMyCryptoCards();
      setMyCards(cards);
    } catch (cardsError) {
      setCardsError(
        getEthereumErrorMessage(cardsError, "Не удалось загрузить карточки"),
      );
    } finally {
      setLoadingCards(false);
    }
  }, [isSepolia, wallet.account]);

  async function handleCollect(symbol: string) {
    if (!wallet.account) {
      setCardsError("Сначала подключи MetaMask");
      return;
    }

    if (!isSepolia) {
      setCardsError("Переключи MetaMask на Sepolia");
      return;
    }

    if (collectedSymbols.has(symbol)) {
      setCardsStatus(`${symbol} уже есть в твоих карточках`);
      return;
    }

    try {
      setCardsError("");
      setCardsStatus(`Подтверди Collect ${symbol} в MetaMask`);
      setCollectingSymbol(symbol);

      await mintCryptoCard(symbol);

      const cards = await getMyCryptoCards();
      setMyCards(cards);
      setCardsStatus(`${symbol} добавлена в твои карточки`);
    } catch (collectError) {
      setCardsError(
        getEthereumErrorMessage(collectError, "Не удалось сохранить карточку"),
      );
      setCardsStatus("");
    } finally {
      setCollectingSymbol(null);
    }
  }

  useEffect(() => {
    const cardsRefreshTimeout = window.setTimeout(() => {
      if (!wallet.account || !isSepolia) {
        setCardsError("");
        setCardsStatus("");
        return;
      }

      void loadMyCards();
    }, 0);

    return () => window.clearTimeout(cardsRefreshTimeout);
  }, [isSepolia, loadMyCards, wallet.account]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {lastUpdated && (
          <p className="rounded-md border border-stone-700/60 bg-stone-900/55 px-3 py-2 text-sm text-stone-400">
            Последнее обновление: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        )}

        <Button onClick={loadCoins} disabled={refreshing}>
          {refreshing ? "Обновляется..." : "Обновить"}
        </Button>
      </div>

      {error && (
        <p className="mb-5 rounded-lg border border-red-400/25 bg-red-950/50 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <WalletConnect
        account={wallet.account}
        balance={wallet.balance}
        chainId={wallet.chainId}
        error={wallet.error}
        isConnecting={wallet.isConnecting}
        isWrongNetwork={wallet.isWrongNetwork}
        onConnect={wallet.connectWallet}
        onSwitchToSepolia={wallet.switchToSepolia}
      />

      <MyCryptoCards
        cards={visibleCards}
        error={cardsError}
        isLoading={loadingCards}
        status={cardsStatus}
        onLoad={loadMyCards}
      />

      {coins.length > 0 && <MarketScene coins={coins} />}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {coins.length > 0 ? (
          coins.map((coin) => (
            <CoinCard
              key={coin.symbol}
              coin={coin}
              canCollect={canCollect}
              isCollected={collectedSymbols.has(coin.symbol)}
              isCollecting={collectingSymbol === coin.symbol}
              onCollect={handleCollect}
            />
          ))
        ) : (
          <p>Не удалось загрузить данные</p>
        )}
      </section>
    </>
  );
}
