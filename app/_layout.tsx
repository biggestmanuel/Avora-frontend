import { Buffer } from 'buffer';
// Unconditional — if anything else set a partial/stub global.Buffer before
// this line runs, `global.Buffer = Buffer` would keep that stub and silently
// drop methods like .alloc, which @ton/core calls at module-load time
// (Cell.EMPTY = new Cell()), causing "undefined is not a function" deep in
// its dependency chain with no clear error at the actual point of failure.
global.Buffer = Buffer;
import { TextEncoder, TextDecoder } from 'text-encoding';
global.TextEncoder = global.TextEncoder = TextEncoder;
global.TextDecoder = global.TextDecoder = TextDecoder;
import 'react-native-get-random-values';
import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

import { useUserStore } from '../stores/userStore';
import { useWalletStore } from '../stores/walletStore';
import { useAuthGateStore } from '../stores/authGateStore';
console.log('Buffer.alloc:', typeof Buffer.alloc, 'TextEncoder:', typeof global.TextEncoder);

// Keep splash screen visible while we check auth state
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const gateStatus = useAuthGateStore((s) => s.status);
  const checkAuthGate = useAuthGateStore((s) => s.check);
  const hydrateUser = useUserStore((s) => s.hydrate);
  const hydrateWallet = useWalletStore((s) => s.hydrate);

  // Run once on mount to establish initial gate status.
  useEffect(() => {
    checkAuthGate().finally(() => SplashScreen.hideAsync());
  }, [checkAuthGate]);

  // Whenever gate flips to authed (either at boot, or right after
  // onboarding/login persists the required keys), hydrate user + wallet.
  useEffect(() => {
    if (gateStatus === 'authed') {
      Promise.all([hydrateUser(), hydrateWallet()]).catch((err) =>
        console.error('Post-auth hydrate failed:', err)
      );
    }
  }, [gateStatus, hydrateUser, hydrateWallet]);

  useEffect(() => {
    if (gateStatus === 'checking') return;

    const inAuthGroup = segments[0] === '(auth)';
    const onVerifyPin = (segments as string[])[1] === 'verify-pin';

    if (gateStatus === 'guest' && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (gateStatus === 'locked' && !onVerifyPin) {
      // Session + account id already exist on this device — just needs this
      // launch's PIN check, not the full onboarding flow.
      router.replace('/(auth)/verify-pin');
    } else if (gateStatus === 'authed' && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [gateStatus, segments, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}