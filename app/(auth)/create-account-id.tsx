import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

// TODO: replace with lib/api/accountId call — server generates + reserves the ID
function generateAccountId(): string {
  let id = '';
  for (let i = 0; i < 10; i++) id += Math.floor(Math.random() * 10);
  return id;
}

function formatAccountId(id: string): string {
  return id.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export default function CreateAccountId() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const fetchId = useCallback(async () => {
    setLoading(true);
    // simulate reservation call
    await new Promise((r) => setTimeout(r, 600));
    setAccountId(generateAccountId());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchId();
  }, [fetchId]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      // TODO: persist confirmed Account ID via lib/api/accountId + stores/userStore
      await new Promise((r) => setTimeout(r, 700));
      router.replace('/(tabs)/home');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Your Account ID</Text>
        <Text style={styles.subtitle}>
          This is how people will send you crypto. It's unique to you and can't be changed later.
        </Text>

        <View style={styles.idCard}>
          {loading || !accountId ? (
            <ActivityIndicator color="#8C7AFF" />
          ) : (
            <Text style={styles.idText}>{formatAccountId(accountId)}</Text>
          )}
        </View>

        <Pressable style={styles.regenerateBtn} onPress={fetchId} disabled={loading}>
          <Text style={styles.regenerateText}>Generate a different ID</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryBtn}
          onPress={handleConfirm}
          disabled={loading || !accountId || confirming}
        >
          {confirming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Confirm & Continue</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', justifyContent: 'space-between' },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 56, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
  subtitle: {
    fontSize: 14, color: '#9A9AA5', marginTop: 10, marginBottom: 36,
    textAlign: 'center', lineHeight: 20, paddingHorizontal: 12,
  },
  idCard: {
    width: '100%', backgroundColor: '#17171D', borderRadius: 16, borderWidth: 1,
    borderColor: '#26262E', paddingVertical: 32, alignItems: 'center', justifyContent: 'center',
  },
  idText: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2 },
  regenerateBtn: { marginTop: 20 },
  regenerateText: { color: '#8C7AFF', fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
