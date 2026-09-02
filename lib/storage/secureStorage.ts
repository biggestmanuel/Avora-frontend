import * as SecureStore from 'expo-secure-store';

// Wrapper around expo-secure-store for sensitive values only
// (PIN hash, session token, account id, private-key material references)
// Non-sensitive cache/session data should use MMKV instead, not this.

export const SecureStorageKeys = {
  SESSION_TOKEN: 'session_token',
  PIN_HASH: 'pin_hash',
  ACCOUNT_ID: 'account_id',
  MNEMONIC_ENCRYPTED: 'mnemonic_encrypted',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  // Non-custodial wallet secrets — never transmitted, device-only.
  EVM_MNEMONIC: 'evm_mnemonic', // covers ETH/BSC/BASE/POLYGON/TRON (shared secp256k1 mnemonic)
  SOL_MNEMONIC: 'sol_mnemonic',
  TON_MNEMONIC: 'ton_mnemonic', // stored JSON-stringified (24-word array)
} as const;

export type SecureStorageKey = (typeof SecureStorageKeys)[keyof typeof SecureStorageKeys];

export async function getSecureItem(key: SecureStorageKey): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.error(`SecureStore get failed for ${key}:`, err);
    return null;
  }
}

export async function setSecureItem(key: SecureStorageKey, value: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (err) {
    console.error(`SecureStore set failed for ${key}:`, err);
    return false;
  }
}

export async function deleteSecureItem(key: SecureStorageKey): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (err) {
    console.error(`SecureStore delete failed for ${key}:`, err);
    return false;
  }
}

export async function clearAllSecureItems(): Promise<void> {
  await Promise.all(Object.values(SecureStorageKeys).map((key) => deleteSecureItem(key)));
}

// --- Non-custodial wallet mnemonic helpers (built on the generic wrapper above) ---

export async function saveEvmMnemonic(mnemonic: string): Promise<boolean> {
  return setSecureItem(SecureStorageKeys.EVM_MNEMONIC, mnemonic);
}

export async function getEvmMnemonic(): Promise<string | null> {
  return getSecureItem(SecureStorageKeys.EVM_MNEMONIC);
}

export async function saveSolMnemonic(mnemonic: string): Promise<boolean> {
  return setSecureItem(SecureStorageKeys.SOL_MNEMONIC, mnemonic);
}

export async function getSolMnemonic(): Promise<string | null> {
  return getSecureItem(SecureStorageKeys.SOL_MNEMONIC);
}

export async function saveTonMnemonic(words: string[]): Promise<boolean> {
  return setSecureItem(SecureStorageKeys.TON_MNEMONIC, JSON.stringify(words));
}

export async function getTonMnemonic(): Promise<string[] | null> {
  const raw = await getSecureItem(SecureStorageKeys.TON_MNEMONIC);
  return raw ? JSON.parse(raw) : null;
}

/** True once all three mnemonic groups are present — i.e. wallet fully set up. */
export async function hasNonCustodialWallet(): Promise<boolean> {
  const [evm, sol, ton] = await Promise.all([getEvmMnemonic(), getSolMnemonic(), getTonMnemonic()]);
  return Boolean(evm && sol && ton);
}
