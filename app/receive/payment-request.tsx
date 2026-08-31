import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, SafeAreaView, Share,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';

const ASSETS = ['USDT', 'BTC', 'ETH', 'SOL', 'TON'] as const;

// TODO: replace with stores/userStore
const MOCK_ACCOUNT_ID = '4821093471';

function formatAccountId(id: string): string {
  return id.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

function QRPlaceholder() {
  return (
    <View style={styles.qrBox}>
      <View style={styles.qrGrid}>
        {Array.from({ length: 49 }).map((_, i) => (
          <View key={i} style={[styles.qrCell, (i * 7 + i) % 3 === 0 && styles.qrCellFilled]} />
        ))}
      </View>
    </View>
  );
}

export default function PaymentRequest() {
  const [asset, setAsset] = useState<(typeof ASSETS)[number]>('USDT');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [generated, setGenerated] = useState(false);

  const requestLink = `https://accountwallet.app/pay/${MOCK_ACCOUNT_ID}?amount=${amount}&asset=${asset}`;

  const handleGenerate = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setGenerated(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Payment request: ${amount} ${asset}${note ? ` — ${note}` : ''}\n${requestLink}`,
      });
    } catch {
      // cancelled
    }
  };

  if (generated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => setGenerated(false)}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Payment Request</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.body}>
          <QRPlaceholder />
          <Text style={styles.requestAmount}>{amount} {asset}</Text>
          {note ? <Text style={styles.note}>{note}</Text> : null}
          <Text style={styles.accountId}>{formatAccountId(MOCK_ACCOUNT_ID)}</Text>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.primaryBtn} onPress={handleShare}>
            <Text style={styles.primaryBtnText}>Share Request</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.secondaryText}>Done</Text>
          </Pressable>
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
          <Text style={styles.headerTitle}>Request Amount</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>Asset</Text>
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

          <Text style={[styles.label, { marginTop: 24 }]}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#5C5C66"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={[styles.label, { marginTop: 24 }]}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What's this for?"
            placeholderTextColor="#5C5C66"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.primaryBtn} onPress={handleGenerate}>
            <Text style={styles.primaryBtnText}>Generate Request</Text>
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
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16, alignItems: 'stretch' },
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
  footer: { paddingHorizontal: 20, paddingBottom: 32, gap: 14, alignItems: 'center' },
  primaryBtn: {
    width: '100%', backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#9A9AA5', fontSize: 14, fontWeight: '600' },
  qrBox: {
    width: 200, height: 200, backgroundColor: '#FFFFFF', borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', padding: 16, alignSelf: 'center',
  },
  qrGrid: { width: 160, height: 160, flexDirection: 'row', flexWrap: 'wrap' },
  qrCell: { width: '14.28%', height: '14.28%', backgroundColor: 'transparent' },
  qrCellFilled: { backgroundColor: '#0B0B0F' },
  requestAmount: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginTop: 20, textAlign: 'center' },
  note: { color: '#9A9AA5', fontSize: 14, marginTop: 6, textAlign: 'center' },
  accountId: { color: '#5C5C66', fontSize: 14, marginTop: 16, textAlign: 'center', letterSpacing: 1 },
});
