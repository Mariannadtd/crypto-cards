import { BrowserProvider, Contract } from "ethers";
import { CRYPTO_CARDS_ABI, CRYPTO_CARDS_ADDRESS } from "./cryptoCardsContract";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export async function getMyCryptoCards(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error("MetaMask не установлен");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new Contract(CRYPTO_CARDS_ADDRESS, CRYPTO_CARDS_ABI, signer);

  const cards = await contract.getMyCards();

  return Array.from(cards);
}
