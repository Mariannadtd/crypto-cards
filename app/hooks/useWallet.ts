"use client";

import { useCallback, useEffect, useState } from "react";
import { CRYPTO_CARDS_CHAIN_ID } from "../lib/cryptoCardsContract";
import {
  getEthereumErrorMessage,
  type EthereumProvider,
} from "../lib/ethereum";

const WEI_IN_ETH = BigInt("1000000000000000000");

function getFirstAccount(accounts: unknown): string | null {
  if (!Array.isArray(accounts)) {
    return null;
  }

  const [account] = accounts;
  return typeof account === "string" ? account : null;
}

function formatEthBalance(balanceInWei: unknown): string {
  if (typeof balanceInWei !== "string") {
    return "0.0000";
  }

  const balance = BigInt(balanceInWei);
  const whole = balance / WEI_IN_ETH;
  const fraction = ((balance % WEI_IN_ETH) * BigInt(10000)) / WEI_IN_ETH;

  return `${whole}.${fraction.toString().padStart(4, "0")}`;
}

async function getEthBalance(
  provider: EthereumProvider,
  account: string,
): Promise<string> {
  const balance = await provider.request({
    method: "eth_getBalance",
    params: [account, "latest"],
  });

  return formatEthBalance(balance);
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const refreshWallet = useCallback(async (provider: EthereumProvider) => {
    const [accounts, currentChainId] = await Promise.all([
      provider.request({ method: "eth_accounts" }),
      provider.request({ method: "eth_chainId" }),
    ]);
    const firstAccount = getFirstAccount(accounts);

    setAccount(firstAccount);
    setChainId(typeof currentChainId === "string" ? currentChainId : null);
    setBalance(firstAccount ? await getEthBalance(provider, firstAccount) : null);
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask не установлен в этом браузере");
      return;
    }

    const ethereum = window.ethereum;

    try {
      setError("");
      setIsConnecting(true);
      await ethereum.request({ method: "eth_requestAccounts" });
      await refreshWallet(ethereum);
    } catch (connectError) {
      setError(
        getEthereumErrorMessage(connectError, "Не удалось подключить MetaMask"),
      );
    } finally {
      setIsConnecting(false);
    }
  }, [refreshWallet]);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask не установлен в этом браузере");
      return;
    }

    const ethereum = window.ethereum;

    try {
      setError("");
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CRYPTO_CARDS_CHAIN_ID }],
      });
      await refreshWallet(ethereum);
    } catch (switchError) {
      setError(
        getEthereumErrorMessage(switchError, "Не удалось переключить сеть"),
      );
    }
  }, [refreshWallet]);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      return;
    }

    const provider: EthereumProvider = ethereum;

    async function handleAccountsChanged(accounts: string[]) {
      try {
        const firstAccount = getFirstAccount(accounts);
        setAccount(firstAccount);
        setBalance(
          firstAccount ? await getEthBalance(provider, firstAccount) : null,
        );
      } catch {
        setAccount(null);
        setBalance(null);
      }
    }

    async function handleChainChanged(nextChainId: string) {
      try {
        setChainId(nextChainId);
        await refreshWallet(provider);
      } catch {
        setBalance(null);
      }
    }

    const walletRefreshTimeout = window.setTimeout(() => {
      void refreshWallet(provider);
    }, 0);
    provider.on?.("accountsChanged", handleAccountsChanged);
    provider.on?.("chainChanged", handleChainChanged);

    return () => {
      window.clearTimeout(walletRefreshTimeout);
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
      provider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [refreshWallet]);

  return {
    account,
    balance,
    chainId,
    error,
    isConnecting,
    isWrongNetwork: chainId !== null && chainId !== CRYPTO_CARDS_CHAIN_ID,
    connectWallet,
    switchToSepolia,
  };
}
