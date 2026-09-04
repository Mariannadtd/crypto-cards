"use client";

import Button from "./UI/Button";

type WalletConnectProps = {
  account: string | null;
  balance: string | null;
  chainId: string | null;
  error: string;
  isConnecting: boolean;
  isWrongNetwork: boolean;
  onConnect: () => void;
  onSwitchToSepolia: () => void;
};

// Человекочитаемые названия сетей, чтобы не показывать пользователю голые 0x1/0x89.
const CHAIN_NAMES: Record<string, string> = {
  "0x1": "Ethereum Mainnet",
  "0xaa36a7": "Sepolia",
  "0x89": "Polygon",
  "0x539": "Localhost",
};

// Обрезаем длинный адрес кошелька до удобного вида: 0x1234...abcd.
function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Превращаем chainId сети в понятное название.
function getChainName(chainId: string) {
  return CHAIN_NAMES[chainId] ?? `Unknown network (${chainId})`;
}

export default function WalletConnect({
  account,
  balance,
  chainId,
  error,
  isConnecting,
  isWrongNetwork,
  onConnect,
  onSwitchToSepolia,
}: WalletConnectProps) {
  return (
    <div className="mb-6 rounded-lg border border-teal-300/15 bg-stone-900/75 p-4 shadow-xl shadow-emerald-950/10">
      {account ? (
        <div className="space-y-4 text-sm text-stone-300">
          <div className="grid gap-3 sm:grid-cols-3">
            <p className="rounded-md border border-stone-700/60 bg-stone-950/45 px-3 py-2">
              <span className="block text-xs uppercase text-stone-500">
                Wallet
              </span>
              {shortAddress(account)}
            </p>

            {chainId && (
              <p className="rounded-md border border-stone-700/60 bg-stone-950/45 px-3 py-2">
                <span className="block text-xs uppercase text-stone-500">
                  Network
                </span>
                {getChainName(chainId)}
              </p>
            )}

            {balance && (
              <p className="rounded-md border border-stone-700/60 bg-stone-950/45 px-3 py-2">
                <span className="block text-xs uppercase text-stone-500">
                  Balance
                </span>
                {balance} ETH
              </p>
            )}
          </div>

          {isWrongNetwork && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-3">
              <p className="text-amber-100">
                Для учебного контракта нужна Sepolia
              </p>

              <Button onClick={onSwitchToSepolia}>Switch to Sepolia</Button>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
