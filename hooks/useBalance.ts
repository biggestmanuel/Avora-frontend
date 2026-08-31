import { useCallback, useEffect } from 'react';
import { useWalletStore } from '@/stores/walletStore';
import type { ChainId } from '@/types/chain';

// Assumes walletStore exposes: balances (per-chain asset list),
// isRefreshing, refreshBalances(chain?: ChainId)

export function useBalance(chain?: ChainId) {
  const balances = useWalletStore((s) =>
    chain ? s.balances[chain] ?? [] : Object.values(s.balances).flat()
  );
  const isRefreshing = useWalletStore((s) => s.isRefreshing);
  const refreshBalances = useWalletStore((s) => s.refreshBalances);

  const refresh = useCallback(() => refreshBalances(chain), [refreshBalances, chain]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalUsdValue = balances.reduce(
    (sum, asset) => sum + (asset.usdValue ?? 0),
    0
  );

  return {
    balances,
    totalUsdValue,
    isRefreshing,
    refresh,
  };
}
