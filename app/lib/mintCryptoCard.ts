import { BrowserProvider, Contract } from "ethers";
import {
  CRYPTO_CARDS_ABI,
  CRYPTO_CARDS_ADDRESS,
  CRYPTO_CARDS_CHAIN_ID,
} from "./cryptoCardsContract";
import type { EthereumProvider } from "./ethereum";

export async function mintCryptoCard(symbol: string): Promise<void> {
  if (!window.ethereum) {
    throw new Error("MetaMask не установлен");
  }

  const ethereum: EthereumProvider = window.ethereum;

  const currentChainId = await ethereum.request({
    method: "eth_chainId",
  });

  if (currentChainId !== CRYPTO_CARDS_CHAIN_ID) {
    throw new Error("Переключи MetaMask на Sepolia перед созданием карточки");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  const contract = new Contract(CRYPTO_CARDS_ADDRESS, CRYPTO_CARDS_ABI, signer);
  const currentCards = Array.from(await contract.getMyCards(), String);

  if (currentCards.includes(symbol)) {
    throw new Error(`${symbol} уже есть в твоих карточках`);
  }

  const transaction = await contract.mintCard(symbol);

  await transaction.wait();
}
