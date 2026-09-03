/**
 * DESTINATION: lib/registerWallets.ts (new file)
 *
 * Orchestrates the non-custodial onboarding flow:
 *  1. Generate keys/mnemonics for all 7 chains (client-side only)
 *  2. Persist mnemonics in expo-secure-store (never sent over the wire)
 *  3. Register only public addresses with the backend (mapped to its
 *     uppercase Chain enum: eth->ETH, bsc->BSC, base->BASE, polygon->POLYGON,
 *     tron->TRON, sol->SOL, ton->TON)
 *  4. Hydrate walletStore with the confirmed addresses
 */

import { generateWallet, toPublicAddresses } from './keyGeneration';
import { apiClient } from './api/client';
import { saveEvmMnemonic, saveSolMnemonic, saveTonMnemonic } from './storage/secureStorage';
import { useWalletStore } from '../stores/walletStore';
import type { ChainId } from '../types/chain';

const CHAIN_ID_TO_BACKEND: Record<ChainId, string> = {
  eth: 'ETH',
  bsc: 'BSC',
  base: 'BASE',
  polygon: 'POLYGON',
  tron: 'TRON',
  sol: 'SOL',
  ton: 'TON',
};

export interface RegisterWalletsResult {
  success: boolean;
  addresses: { chain: ChainId; address: string }[];
}

/**
 * Call once, immediately after account creation (post create-account-id step).
 * Idempotent on the backend: registerWallets upserts, so a retry after a
 * partial failure is safe as long as the SAME mnemonics are reused — do not
 * call generateWallet() again if secrets are already in secureStorage.
 */
export async function setupNonCustodialWallet(): Promise<RegisterWalletsResult> {
  const wallet = await generateWallet();

  // 1. Persist secrets locally FIRST. If this fails, abort before hitting
  // the network — we never want addresses registered without a
  // corresponding locally-recoverable secret.
  await saveEvmMnemonic(wallet.evmMnemonic); // covers eth/bsc/base/polygon/tron
  await saveSolMnemonic(wallet.solMnemonic);
  await saveTonMnemonic(wallet.tonMnemonic);

  // 2. Register only public addresses, mapped to backend's Chain enum casing.
  const addresses = toPublicAddresses(wallet);
  const payload = addresses.map(({ chain, address }) => ({
    chain: CHAIN_ID_TO_BACKEND[chain],
    address,
  }));

  await apiClient.post('/api/wallet/register', { addresses: payload });
  // apiClient's response interceptor (lib/api/client.ts) rejects non-2xx
  // responses into a normalized ApiErrorShape, so reaching this line means success.

  // 3. Hydrate local wallet state so balances/addresses screens work immediately.
  for (const { chain, address } of addresses) {
    useWalletStore.getState().setAddress(chain, address);
  }

  return { success: true, addresses };
}
