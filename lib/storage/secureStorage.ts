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
