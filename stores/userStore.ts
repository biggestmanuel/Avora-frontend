import { create } from 'zustand';
import { getSecureItem, setSecureItem, clearAllSecureItems, SecureStorageKeys } from '../lib/storage/secureStorage';
import { resolveAccountId, AccountIdProfile } from '../lib/api/accountId';

interface UserState {
  accountId: string | null;
  profile: AccountIdProfile | null;
  biometricEnabled: boolean;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  setSession: (accountId: string, sessionToken: string) => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  accountId: null,
  profile: null,
  biometricEnabled: false,
  isHydrated: false,

  hydrate: async () => {
    const [accountId, biometricFlag] = await Promise.all([
      getSecureItem(SecureStorageKeys.ACCOUNT_ID),
      getSecureItem(SecureStorageKeys.BIOMETRIC_ENABLED),
    ]);

    if (!accountId) {
      set({ isHydrated: true });
      return;
    }

    let profile: AccountIdProfile | null = null;
    try {
      profile = await resolveAccountId(accountId);
    } catch (err) {
      console.error('Failed to fetch profile during hydrate:', err);
    }

    set({
      accountId,
      profile,
      biometricEnabled: biometricFlag === 'true',
      isHydrated: true,
    });
  },

  setSession: async (accountId, sessionToken) => {
    await Promise.all([
      setSecureItem(SecureStorageKeys.ACCOUNT_ID, accountId),
      setSecureItem(SecureStorageKeys.SESSION_TOKEN, sessionToken),
    ]);
    set({ accountId });
  },

  setBiometricEnabled: async (enabled) => {
    await setSecureItem(SecureStorageKeys.BIOMETRIC_ENABLED, String(enabled));
    set({ biometricEnabled: enabled });
  },

  logout: async () => {
    await clearAllSecureItems();
    set({ accountId: null, profile: null, biometricEnabled: false });
  },
}));
