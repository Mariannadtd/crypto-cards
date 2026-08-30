export const CRYPTO_CARDS_ADDRESS =
  "0x86A5c7B70D5D9554C87cB2Ff4E4f9517b2f5B6DE";

export const CRYPTO_CARDS_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "CardMinted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "mintCard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getCardsByUser",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyCards",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
