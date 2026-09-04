// Минимально описываем объект MetaMask, который появляется в браузере как window.ethereum.
export type EthereumProvider = {
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

// Говорим TypeScript, что у window может быть поле ethereum от MetaMask.
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type EthereumError = {
  code?: number | string;
  message?: string;
  shortMessage?: string;
  info?: {
    error?: {
      code?: number | string;
      message?: string;
    };
  };
};

export function getEthereumErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const ethereumError = error as EthereumError;
  const code = ethereumError.code ?? ethereumError.info?.error?.code;

  if (code === 4001 || code === "ACTION_REJECTED") {
    return "Действие отменено в MetaMask";
  }

  return (
    ethereumError.shortMessage ??
    ethereumError.info?.error?.message ??
    ethereumError.message ??
    fallback
  );
}
