export type Coin = {
  name: string;
  symbol: string;
  price: number;
  change: number;
};

export type CoinApiData = {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
  };
  ethereum: {
    usd: number;
    usd_24h_change: number;
  };
  solana: {
    usd: number;
    usd_24h_change: number;
  };
  "the-open-network": {
    usd: number;
    usd_24h_change: number;
  };
};
