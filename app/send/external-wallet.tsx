import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// TODO: replace with lib/validation/triverify.ts address format + existence check
const NETWORKS = ['ETH', 'BSC', 'TRON', 'SOL', 'TON', 'BASE', 'Polygon'] as const;
type Network = (typeof NETWORKS)[number];

function looksValid(address: string, network: Network): boolean {
  if (address.length < 20) return false;
  if (network === 'SOL' || network === 'TON') return true;
  return address.startsWith('0x') || address.startsWith('T');
}

const ASSETS = ['USDT', 'BTC', 'ETH', 'SOL', 'TON'] as const;

export default function ExternalWallet() {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<Network>('ETH');
  const [asset, setAsset] = useState<(typeof ASSETS)[number]>('USDT');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setError(null);
    if (!address.trim()) return setError('Enter a wallet address');
    if (!looksValid(address.trim(), network)) return setError(`This doesn't look like a valid ${network} address`);
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setError('Enter a valid amount');

    router.push({
      pathname: '/send/confirm',
      params: {
        externalAddress: address.trim(),
        asset,
        amount,
        network,
        networkName: network,
        fee: '~$0.50',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>External Wallet</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Sending to the wrong network or a mistyped address can result in permanent loss of funds.
            </Text>
          </View>

          <Text style={styles.label}>Network</Text>
          <View style={styles.chipRow}>
            {NETWORKS.map((n) => (
              <Pressable
                key={n}
                style={[styles.chip, network === n && styles.chipActive]}
                onPress={() => setNetwork(n)}
              >
                <Text style={[styles.chipText, network === n && styles.chipTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Wallet Address</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder={`Paste ${network} address`}
            placeholderTextColor="#5C5C66"
            autoCapitalize="none"
            multiline
            value={address}
            onChangeText={setAddress}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Asset</Text>
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

          <Text style={[styles.label, { marginTop: 20 }]}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#5C5C66"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          {error && <Text style={styles.error}>{error}</Text>}
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
  warningBox: {
    backgroundColor: '#1A1610', borderRadius: 12, borderWidth: 1,
    borderColor: '#3A3020', padding: 14, marginBottom: 20,
  },
  warningText: { color: '#E8B84B', fontSize: 12, lineHeight: 17 },
  label: { fontSize: 13, color: '#9A9AA5', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#17171D', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#26262E',
  },
  inputMultiline: { minHeight: 70, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#17171D', borderWidth: 1, borderColor: '#26262E',
  },
  chipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  chipText: { color: '#9A9AA5', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  error: { color: '#FF6B6B', fontSize: 13, marginTop: 14 },
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
