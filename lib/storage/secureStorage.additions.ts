/**
 * ADD THESE to your existing lib/storage/secureStorage.ts
 * (don't have your current file contents, so shipping as a mergeable addendum
 * rather than overwriting it).
 *
 * Assumes your file already wraps expo-secure-store with get/set helpers.
 * If it already has a generic setSecureItem/getSecureItem, use those instead
 * of calling SecureStore directly below.
 */

import * as SecureStore from 'expo-secure-store';

const KEY_EVM_MNEMONIC = 'zomavi_evm_mnemonic'; // covers ETH/BSC/BASE/POLYGON/TRON
const KEY_SOL_MNEMONIC = 'zomavi_sol_mnemonic';
const KEY_TON_MNEMONIC = 'zomavi_ton_mnemonic'; // stored as JSON array

export async function saveEvmMnemonic(mnemonic: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_EVM_MNEMONIC, mnemonic);
}

export async function getEvmMnemonic(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_EVM_MNEMONIC);
}

export async function saveSolMnemonic(mnemonic: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_SOL_MNEMONIC, mnemonic);
}

export async function getSolMnemonic(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_SOL_MNEMONIC);
}

export async function saveTonMnemonic(words: string[]): Promise<void> {
  await SecureStore.setItemAsync(KEY_TON_MNEMONIC, JSON.stringify(words));
}

export async function getTonMnemonic(): Promise<string[] | null> {
  const raw = await SecureStore.getItemAsync(KEY_TON_MNEMONIC);
  return raw ? JSON.parse(raw) : null;
}

/** True once all three mnemonic groups are present — i.e. wallet fully set up. */
export async function hasNonCustodialWallet(): Promise<boolean> {
  const [evm, sol, ton] = await Promise.all([
    getEvmMnemonic(),
    getSolMnemonic(),
    getTonMnemonic(),
  ]);
  return Boolean(evm && sol && ton);
}
