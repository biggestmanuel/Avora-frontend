import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { SecureStorageKeys } from '../lib/storage/secureStorage';

export type AuthGateStatus = 'checking' | 'authed' | 'guest';

interface AuthGateState {
  status: AuthGateStatus;
  check: () => Promise<void>;
}

// Single source of truth for auth gate status. Shared between the root
// layout (which redirects based on it) and onboarding screens (which
// need to flip it to 'authed' the moment they persist the required
// SecureStore keys, instead of waiting for the next app launch).
export const useAuthGateStore = create<AuthGateState>((set) => ({
  status: 'checking',
  check: async () => {
    try {
      const [session, pinHash, accountId] = await Promise.all([
        SecureStore.getItemAsync(SecureStorageKeys.SESSION_TOKEN),
        SecureStore.getItemAsync(SecureStorageKeys.PIN_HASH),
        SecureStore.getItemAsync(SecureStorageKeys.ACCOUNT_ID),
      ]);
      set({ status: session && pinHash && accountId ? 'authed' : 'guest' });
    } catch (err) {
      // Fail closed — treat any secure-store read error as unauthenticated
      console.error('Auth gate check failed:', err);
      set({ status: 'guest' });
    }
  },
}));
