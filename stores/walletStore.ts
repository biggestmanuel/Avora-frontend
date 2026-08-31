import { create } from 'zustand';
import { chains, ChainId } from '../lib/chains';
import { getSecureItem, SecureStorageKeys } from '../lib/storage/secureStorage';

const NATIVE_SYMBOLS: Record<ChainId, string> = {
  eth: 'ETH',
  bsc: 'BNB',
  base: 'ETH',
  polygon: 'POL',
  sol: 'SOL',
  tron: 'TRX',
  ton: 'TON',
};

export interface AssetBalance {
  id: string; // `${chainId}:${symbol}`
  chainId: ChainId;
  symbol: string;
  balance: string;
  address: string;
}

interface WalletState {
  addresses: Partial<Record<ChainId, string>>;
  balances: AssetBalance[];
  isLoadingBalances: boolean;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  setAddress: (chainId: ChainId, address: string) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  addresses: {},
  balances: [],
  isLoadingBalances: false,
  isHydrated: false,

  hydrate: async () => {
    // Wallet addresses are deterministically derived from the user's
    // secured seed material; this reads whatever's already been derived
    // and cached rather than re-deriving on every app launch.
    const cachedAddresses = await getSecureItem(SecureStorageKeys.ACCOUNT_ID);
    set({ isHydrated: true });
    if (cachedAddresses) {
      await get().refreshBalances();
    }
  },

  setAddress: (chainId, address) => {
    set((state) => ({ addresses: { ...state.addresses, [chainId]: address } }));
  },

  refreshBalances: async () => {
    const { addresses } = get();
    const chainIds = Object.keys(addresses) as ChainId[];
    if (chainIds.length === 0) return;

    set({ isLoadingBalances: true });
    try {
      const results = await Promise.all(
        chainIds.map(async (chainId) => {
          const address = addresses[chainId]!;
          const adapter = chains[chainId];
          const balance = await adapter.getBalance(address);
          const balanceEntry: AssetBalance = {
            id: `${chainId}:native`,
            chainId,
            symbol: NATIVE_SYMBOLS[chainId],
            balance,
            address,
          };
          return balanceEntry;
        })
      );
      set({ balances: results });
    } catch (err) {
      console.error('Failed to refresh balances:', err);
    } finally {
      set({ isLoadingBalances: false });
    }
  },
}));
