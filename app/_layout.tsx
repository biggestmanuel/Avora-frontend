import 'react-native-get-random-values';
import { useEffect, useState, useCallback } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

import { useUserStore } from '../stores/userStore';
import { useWalletStore } from '../stores/walletStore';

// Keep splash screen visible while we check auth state
SplashScreen.preventAutoHideAsync();

type AuthGateStatus = 'checking' | 'authed' | 'guest';

export default function RootLayout() {
  const [gateStatus, setGateStatus] = useState<AuthGateStatus>('checking');
  const router = useRouter();
  const segments = useSegments();
  const hydrateUser = useUserStore((s) => s.hydrate);
  const hydrateWallet = useWalletStore((s) => s.hydrate);

  const checkAuthGate = useCallback(async () => {
    try {
      const [session, pinSet, accountId] = await Promise.all([
        SecureStore.getItemAsync('session_token'),
        SecureStore.getItemAsync('pin_hash'),
        SecureStore.getItemAsync('account_id'),
      ]);

      if (session && pinSet && accountId) {
        await Promise.all([hydrateUser(), hydrateWallet()]);
        setGateStatus('authed');
      } else {
        setGateStatus('guest');
      }
    } catch (err) {
      // Fail closed — treat any secure-store read error as unauthenticated
      console.error('Auth gate check failed:', err);
      setGateStatus('guest');
    } finally {
      await SplashScreen.hideAsync();
    }
  }, [hydrateUser, hydrateWallet]);

  useEffect(() => {
    checkAuthGate();
  }, [checkAuthGate]);

  useEffect(() => {
    if (gateStatus === 'checking') return;

    const inAuthGroup = segments[0] === '(auth)';

    if (gateStatus === 'guest' && !inAuthGroup) {
      router.replace('/(auth)/welcome');
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
