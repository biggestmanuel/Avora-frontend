import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { SecureStorageKeys } from '../lib/storage/secureStorage';

export type AuthGateStatus = 'checking' | 'authed' | 'locked' | 'guest';

interface AuthGateState {
  status: AuthGateStatus;
  // Deliberately NOT persisted to SecureStore or anywhere else — resets to
  // false on every fresh JS process (cold start, app kill+reopen). This is
  // what makes PIN entry mandatory every time the app is opened, not just
  // once per device, without needing to cache the PIN or its hash on-device.
  pinVerified: boolean;
  check: () => Promise<void>;
  markPinVerified: () => Promise<void>;
  resetPinVerified: () => void;
}

// Single source of truth for auth gate status. Shared between the root
// layout (which redirects based on it) and onboarding/login screens (which
// need to flip it the moment they persist the required SecureStore keys or
// verify the PIN, instead of waiting for the next app launch).
//
// Three real states below 'checking':
//  - 'guest'  — no session / no account id locally. Needs full onboarding.
//  - 'locked' — session + account id ARE present (this device/account has
//    already onboarded), but the PIN hasn't been verified yet THIS launch.
//    Route to verify-pin, not welcome/signup.
//  - 'authed' — session + account id + PIN verified this launch.
//
// PIN itself is never cached or checked on-device (verified server-side
// against User.pinHash) — same model as OPay/PalmPay/Moniepoint. Only the
// fact that it was verified this session lives here, in memory only.
export const useAuthGateStore = create<AuthGateState>((set, get) => ({
  status: 'checking',
  pinVerified: false,
  check: async () => {
    try {
      const [session, accountId] = await Promise.all([
        SecureStore.getItemAsync(SecureStorageKeys.SESSION_TOKEN),
        SecureStore.getItemAsync(SecureStorageKeys.ACCOUNT_ID),
      ]);
      if (!session || !accountId) {
        set({ status: 'guest' });
      } else {
        set({ status: get().pinVerified ? 'authed' : 'locked' });
      }
    } catch (err) {
      // Fail closed — treat any secure-store read error as unauthenticated
      console.error('Auth gate check failed:', err);
      set({ status: 'guest' });
    }
  },
  markPinVerified: async () => {
    set({ pinVerified: true });
    await get().check();
  },
  resetPinVerified: () => set({ pinVerified: false }),
}));
