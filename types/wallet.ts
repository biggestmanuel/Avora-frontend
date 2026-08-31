import type { ChainId } from './chain';

export interface AssetBalance {
  chain: ChainId;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  usdValue?: number;
  iconUrl?: string;
}

export interface WalletAddress {
  chain: ChainId;
  address: string;
}

export interface WalletState {
  addresses: Record<ChainId, string>;
  balances: Record<ChainId, AssetBalance[]>;
}
