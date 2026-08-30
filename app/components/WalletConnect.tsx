"use client";

import { useEffect, useState } from "react";
import Button from "./UI/Button";

// Минимально описываем объект MetaMask, который появляется в браузере как window.ethereum.
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: {
    (event: "accountsChanged", callback: (accounts: string[]) => void): void;
    (event: "chainChanged", callback: (chainId: string) => void): void;
  };
  removeListener?: {
    (event: "accountsChanged", callback: (accounts: string[]) => void): void;
    (event: "chainChanged", callback: (chainId: string) => void): void;
  };
};

type EthereumError = {
  code?: number;
  message?: string;
};

// Говорим TypeScript, что у window может быть поле ethereum от MetaMask.
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Sepolia - тестовая сеть Ethereum. MetaMask принимает chainId в hex-формате.
const SEPOLIA_CHAIN_ID = "0xaa36a7";

// Человекочитаемые названия сетей, чтобы не показывать пользователю голые 0x1/0x89.
const CHAIN_NAMES: Record<string, string> = {
  "0x1": "Ethereum Mainnet",
  "0xaa36a7": "Sepolia",
  "0x89": "Polygon",
  "0x539": "Localhost",
};

const WEI_IN_ETH = BigInt("1000000000000000000");

// MetaMask возвращает баланс в wei и в hex-строке, а мы показываем его как ETH.
function formatEthBalance(balanceHex: string): string {
  const wei = BigInt(balanceHex);
  const eth = wei / WEI_IN_ETH;
  const decimals = wei % WEI_IN_ETH;
  const decimalsText = decimals.toString().padStart(18, "0").slice(0, 4);

  return `${eth}.${decimalsText}`;
}

// Запрашиваем баланс конкретного адреса в текущей сети MetaMask.
async function getEthBalance(
  ethereum: EthereumProvider,
  address: string,
): Promise<string | null> {
  const balanceHex = await ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });

  if (typeof balanceHex !== "string") {
    return null;
  }

  return formatEthBalance(balanceHex);
}

// Обрезаем длинный адрес кошелька до удобного вида: 0x1234...abcd.
function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Превращаем chainId сети в понятное название.
function getChainName(chainId: string) {
  return CHAIN_NAMES[chainId] ?? `Unknown network (${chainId})`;
}

// Достаем понятный текст ошибки из ответа MetaMask.
function getErrorMessage(error: unknown) {
  const ethereumError = error as EthereumError;

  if (ethereumError.code === 4001) {
    return "Подключение отменено";
  }

  return ethereumError.message || "Не удалось подключить кошелек";
}

// MetaMask возвращает массив аккаунтов, а нам нужен первый адрес или null.
function getFirstAccount(accounts: unknown) {
  if (!Array.isArray(accounts)) {
    return null;
  }

  const firstAccount = accounts[0];

  if (typeof firstAccount !== "string") {
    return null;
  }

  return firstAccount;
}

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // При первом рендере проверяем, не был ли кошелек уже подключен раньше.
  // Плюс подписываемся на события MetaMask: смена аккаунта и смена сети.
  useEffect(() => {
    const ethereum = window.ethereum;

    if (!ethereum) {
      return;
    }

    const provider: EthereumProvider = ethereum;

    async function checkWalletState() {
      try {
        // eth_accounts не открывает popup, а тихо проверяет уже разрешенные аккаунты.
        const accounts = await provider.request({
          method: "eth_accounts",
        });

        // eth_chainId возвращает текущую сеть, выбранную в MetaMask.
        const currentChainId = await provider.request({
          method: "eth_chainId",
        });

        const firstAccount = getFirstAccount(accounts);

        setAccount(firstAccount);

        if (typeof currentChainId === "string") {
          setChainId(currentChainId);
        }

        if (firstAccount) {
          // Если аккаунт есть, сразу подтягиваем его баланс.
          setBalance(await getEthBalance(provider, firstAccount));
        } else {
          setBalance(null);
        }
      } catch {
        setAccount(null);
        setBalance(null);
        setChainId(null);
      }
    }

    async function handleAccountsChanged(accounts: string[]) {
      // Срабатывает, когда пользователь сменил аккаунт в MetaMask или отключил сайт.
      const firstAccount = getFirstAccount(accounts);

      setAccount(firstAccount);

      if (firstAccount) {
        setBalance(await getEthBalance(provider, firstAccount));
      } else {
        setBalance(null);
      }
    }

    async function handleChainChanged(newChainId: string) {
      // Срабатывает, когда пользователь переключил сеть в MetaMask.
      setChainId(newChainId);

      const accounts = await provider.request({
        method: "eth_accounts",
      });

      const firstAccount = getFirstAccount(accounts);
      setAccount(firstAccount);

      if (firstAccount) {
        setBalance(await getEthBalance(provider, firstAccount));
      } else {
        setBalance(null);
      }
    }

    checkWalletState();

    // Подписки нужны, чтобы интерфейс обновлялся без перезагрузки страницы.
    provider.on?.("accountsChanged", handleAccountsChanged);
    provider.on?.("chainChanged", handleChainChanged);

    // Cleanup: снимаем подписки, когда компонент исчезает со страницы.
    return () => {
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
      provider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  async function connectWallet() {
    // Это основной клик по кнопке Connect MetaMask.
    setError("");

    const ethereum = window.ethereum;

    if (!ethereum) {
      setError("MetaMask не установлен");
      return;
    }

    try {
      setIsConnecting(true);

      // eth_requestAccounts открывает MetaMask popup и просит разрешить доступ к адресу.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // После подключения сразу узнаем текущую сеть.
      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      });

      const firstAccount = getFirstAccount(accounts);

      setAccount(firstAccount);

      if (typeof currentChainId === "string") {
        setChainId(currentChainId);
      }

      if (firstAccount) {
        // После подключения показываем баланс подключенного адреса.
        setBalance(await getEthBalance(ethereum, firstAccount));
      } else {
        setBalance(null);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsConnecting(false);
    }
  }

  const isWrongNetwork = chainId !== null && chainId !== SEPOLIA_CHAIN_ID;

  async function switchToSepolia() {
    // Просим MetaMask переключить пользователя на тестовую сеть Sepolia.
    setError("");

    const ethereum = window.ethereum;

    if (!ethereum) {
      setError("MetaMask не установлен");
      return;
    }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (error) {
      const ethereumError = error as EthereumError;

      if (ethereumError.code === 4902) {
        // 4902 значит, что такой сети нет в списке MetaMask у пользователя.
        setError(
          "Sepolia не найдена в MetaMask. Включи отображение тестовых сетей в MetaMask.",
        );
        return;
      }

      setError(getErrorMessage(error));
    }
  }

  return (
    <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      {account ? (
        // Если аккаунт есть, показываем состояние кошелька.
        <div className="space-y-2 text-sm text-zinc-300">
          <p>Wallet: {shortAddress(account)}</p>

          {chainId && <p>Network: {getChainName(chainId)}</p>}

          {balance && <p>Balance: {balance} ETH</p>}

          {isWrongNetwork && (
            // Если сеть не Sepolia, предлагаем переключиться перед работой с контрактом.
            <div className="space-y-3">
              <p className="text-yellow-400">
                Для учебного контракта нужна Sepolia
              </p>

              <Button onClick={switchToSepolia}>Switch to Sepolia</Button>
            </div>
          )}
        </div>
      ) : (
        // Если аккаунта нет, показываем кнопку подключения.
        <Button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
