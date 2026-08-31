import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, SafeAreaView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address');

    setLoading(true);
    try {
      // TODO: replace with lib/api/client password-reset call
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch {
      setError('Could not send reset link. Try again.');
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
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            {sent
              ? "Check your inbox for a reset link. It can take a minute to arrive."
              : "Enter the email associated with your account and we'll send a reset link."}
          </Text>

          {!sent && (
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
          )}

          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.footer}>
          {sent ? (
            <Pressable style={styles.primaryBtn} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.primaryBtnText}>Back to Login</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryBtn} onPress={handleSend} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send Reset Link</Text>}
            </Pressable>
          )}
          <Pressable onPress={() => router.back()}>
            <Text style={styles.secondaryText}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', justifyContent: 'space-between' },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 48 },
  title: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 15, color: '#9A9AA5', marginTop: 10, marginBottom: 32, lineHeight: 21 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, color: '#9A9AA5', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#17171D', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#26262E',
  },
  error: { color: '#FF6B6B', fontSize: 13, marginTop: 4 },
  footer: { paddingHorizontal: 24, paddingBottom: 32, gap: 16 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#9A9AA5', fontSize: 14, textAlign: 'center' },
});
