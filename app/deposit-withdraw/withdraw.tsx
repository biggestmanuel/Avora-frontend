import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// TODO: replace with hooks/useBalance
const MOCK_BALANCES: Record<string, number> = { USDT: 420.5, BTC: 0.012, ETH: 0.31, SOL: 4.2, TON: 210 };
const ASSETS = Object.keys(MOCK_BALANCES) as (keyof typeof MOCK_BALANCES)[];
const MOCK_RATE_NGN_PER_USDT = 1650;

// TODO: replace with lib/ramp/bachs.ts withdrawal call
function fakeWithdraw(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function Withdraw() {
  const [asset, setAsset] = useState<(typeof ASSETS)[number]>('USDT');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const balance = MOCK_BALANCES[asset];
  const amt = parseFloat(amount) || 0;
  const estimatedNgn = amt * MOCK_RATE_NGN_PER_USDT;

  const handleWithdraw = async () => {
    setError(null);
    if (!amt || amt <= 0) return setError('Enter a valid amount');
    if (amt > balance) return setError(`Insufficient ${asset} balance`);
    if (bankName.trim().length < 2) return setError('Enter your bank name');
    if (accountNumber.replace(/\D/g, '').length !== 10) return setError('Enter a valid 10-digit account number');

    setLoading(true);
    try {
      await fakeWithdraw();
      setDone(true);
      setTimeout(() => router.replace('/(tabs)/home'), 1200);
    } catch {
      setError('Withdrawal failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successWrap}>
          <View style={styles.successCircle}>
            <Text style={styles.successCheck}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Withdrawal Started</Text>
          <Text style={styles.successSubtitle}>Funds typically arrive within a few minutes</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Withdraw</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>From</Text>
          <View style={styles.chipRow}>
            {ASSETS.map((a) => (
              <Pressable
                key={a}
                style={[styles.chip, asset === a && styles.chipActive]}
                onPress={() => setAsset(a)}
              >
                <Text style={[styles.chipText, asset === a && styles.chipTextActive]}>{a}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.balanceText}>Available: {balance} {asset}</Text>

          <Text style={[styles.label, { marginTop: 20 }]}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#5C5C66"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          {amt > 0 && (
            <Text style={styles.estimate}>≈ ₦{estimatedNgn.toLocaleString('en-NG', { maximumFractionDigits: 0 })}</Text>
          )}

          <Text style={[styles.label, { marginTop: 20 }]}>Bank Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. GTBank"
            placeholderTextColor="#5C5C66"
            value={bankName}
            onChangeText={setBankName}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="0000000000"
            placeholderTextColor="#5C5C66"
            keyboardType="number-pad"
            value={accountNumber}
            onChangeText={(v) => setAccountNumber(v.replace(/\D/g, '').slice(0, 10))}
          />

          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.primaryBtn} onPress={handleWithdraw} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Withdraw</Text>}
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
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  label: { fontSize: 13, color: '#9A9AA5', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#17171D', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#26262E',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#17171D', borderWidth: 1, borderColor: '#26262E',
  },
  chipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  chipText: { color: '#9A9AA5', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  balanceText: { color: '#5C5C66', fontSize: 12, marginTop: 8 },
  estimate: { color: '#8C7AFF', fontSize: 13, marginTop: 8, fontWeight: '600' },
  error: { color: '#FF6B6B', fontSize: 13, marginTop: 14 },
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#1A2E20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  successCheck: { color: '#4CD97B', fontSize: 32, fontWeight: '700' },
  successTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  successSubtitle: { color: '#9A9AA5', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 30 },
});
