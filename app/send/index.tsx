import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// TODO: replace with lib/api/accountId resolve call
type ResolvedProfile = { name: string; accountId: string } | null;

function fakeResolve(id: string): Promise<ResolvedProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(id.length === 10 ? { name: 'Chidi Okafor', accountId: id } : null);
    }, 500);
  });
}

const ASSETS = ['USDT', 'BTC', 'ETH', 'SOL', 'TON'] as const;

export default function SendIndex() {
  const [accountId, setAccountId] = useState('');
  const [profile, setProfile] = useState<ResolvedProfile>(null);
  const [resolving, setResolving] = useState(false);
  const [asset, setAsset] = useState<(typeof ASSETS)[number]>('USDT');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const digits = accountId.replace(/\D/g, '');
    setProfile(null);
    if (digits.length !== 10) return;

    setResolving(true);
    fakeResolve(digits).then((p) => {
      setProfile(p);
      setResolving(false);
    });
  }, [accountId]);

  const handleContinue = () => {
    setError(null);
    if (!profile) return setError('Enter a valid 10-digit Account ID');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setError('Enter a valid amount');

    router.push({
      pathname: '/send/network-select',
      params: { accountId: profile.accountId, recipientName: profile.name, asset, amount },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Send</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>Recipient Account ID</Text>
          <TextInput
            style={styles.input}
            placeholder="0000 000 000"
            placeholderTextColor="#5C5C66"
            keyboardType="number-pad"
            value={accountId}
            onChangeText={(v) => setAccountId(v.replace(/\D/g, '').slice(0, 10))}
          />

          {resolving && (
            <View style={styles.resolveRow}>
              <ActivityIndicator size="small" color="#8C7AFF" />
              <Text style={styles.resolveText}>Looking up Account ID...</Text>
            </View>
          )}

          {profile && !resolving && (
            <View style={styles.profileRow}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{profile.name.charAt(0)}</Text>
              </View>
              <Text style={styles.profileName}>{profile.name}</Text>
            </View>
          )}

          <Text style={[styles.label, { marginTop: 24 }]}>Asset</Text>
          <View style={styles.assetRow}>
            {ASSETS.map((a) => (
              <Pressable
                key={a}
                style={[styles.assetChip, asset === a && styles.assetChipActive]}
                onPress={() => setAsset(a)}
              >
                <Text style={[styles.assetText, asset === a && styles.assetTextActive]}>{a}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 24 }]}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#5C5C66"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable style={styles.externalLink} onPress={() => router.push('/send/external-wallet')}>
            <Text style={styles.externalLinkText}>Send to an external wallet instead</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.primaryBtn} onPress={handleContinue}>
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', justifyContent: 'space-between' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  back: { color: '#FFFFFF', fontSize: 28 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  label: { fontSize: 13, color: '#9A9AA5', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#17171D', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: '#FFFFFF', fontSize: 18, borderWidth: 1, borderColor: '#26262E',
  },
  resolveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  resolveText: { color: '#9A9AA5', fontSize: 13 },
  profileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12,
    backgroundColor: '#17171D', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#26262E',
  },
  profileAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C5CE7',
    alignItems: 'center', justifyContent: 'center',
  },
  profileAvatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  profileName: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  assetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  assetChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#17171D', borderWidth: 1, borderColor: '#26262E',
  },
  assetChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  assetText: { color: '#9A9AA5', fontSize: 14, fontWeight: '600' },
  assetTextActive: { color: '#FFFFFF' },
  error: { color: '#FF6B6B', fontSize: 13, marginTop: 12 },
  externalLink: { marginTop: 28, alignItems: 'center' },
  externalLinkText: { color: '#8C7AFF', fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
