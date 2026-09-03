import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { login as loginApi } from '../../lib/api/auth';
import type { ApiErrorShape } from '../../lib/api/client';
import { setSecureItem, SecureStorageKeys } from '../../lib/storage/secureStorage';
import { useAuthGateStore } from '../../stores/authGateStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const checkAuthGate = useAuthGateStore((s) => s.check);

  const handleLogin = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    setLoading(true);
    try {
      const { token } = await loginApi({ email, password });
      await setSecureItem(SecureStorageKeys.SESSION_TOKEN, token);

      // PIN and Account ID are device-local (never sent to the server), so a
      // fresh login only fully satisfies the auth gate if this device already
      // has them cached from a previous onboarding. Re-check the gate rather
      // than assuming home is reachable.
      await checkAuthGate();
      const status = useAuthGateStore.getState().status;
      if (status === 'authed') {
        router.replace('/(tabs)/home');
      } else {
        setError('This device needs a one-time setup. Continuing to account setup…');
        router.replace('/(auth)/create-pin');
      }
    } catch (err) {
      setError((err as ApiErrorShape).message ?? 'Login failed. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.body}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#5C5C66"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#5C5C66"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Log In</Text>}
          </Pressable>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.secondaryText}>
              Don't have an account? <Text style={styles.linkInline}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', justifyContent: 'space-between' },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 15, color: '#9A9AA5', marginTop: 6, marginBottom: 32 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, color: '#9A9AA5', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#17171D', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#26262E',
  },
  error: { color: '#FF6B6B', fontSize: 13, marginTop: 4, marginBottom: 8 },
  link: { color: '#8C7AFF', fontSize: 14, fontWeight: '500', marginTop: 4 },
  linkInline: { color: '#8C7AFF', fontWeight: '600' },
  footer: { paddingHorizontal: 24, paddingBottom: 32, gap: 16 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#9A9AA5', fontSize: 14, textAlign: 'center' },
});
