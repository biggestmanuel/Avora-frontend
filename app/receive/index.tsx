import { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, SafeAreaView, Share, Platform,
} from 'react-native';
import { router } from 'expo-router';

// NOTE: swap this placeholder for a real QR renderer, e.g. react-native-qrcode-svg
// <QRCode value={`accountwallet://pay/${accountId}`} size={200} />
function QRPlaceholder({ value }: { value: string }) {
  return (
    <View style={styles.qrBox}>
      <View style={styles.qrGrid}>
        {Array.from({ length: 49 }).map((_, i) => (
          <View
            key={i}
            style={[styles.qrCell, (i * 7 + i) % 3 === 0 && styles.qrCellFilled]}
          />
        ))}
      </View>
    </View>
  );
}

// TODO: replace with stores/userStore
const MOCK_ACCOUNT_ID = '4821093471';

function formatAccountId(id: string): string {
  return id.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

const METHODS = ['Account ID', 'QR Code', 'Link'] as const;
type Method = (typeof METHODS)[number];

export default function ReceiveIndex() {
  const [method, setMethod] = useState<Method>('QR Code');
  const [copied, setCopied] = useState(false);

  const shareLink = `https://accountwallet.app/pay/${MOCK_ACCOUNT_ID}`;

  const handleCopy = () => {
    // TODO: use expo-clipboard's setStringAsync
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send me crypto via my Account ID: ${formatAccountId(MOCK_ACCOUNT_ID)}\n${shareLink}`,
      });
    } catch {
      // user cancelled or share failed silently
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Receive</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.methodRow}>
        {METHODS.map((m) => (
          <Pressable
            key={m}
            style={[styles.methodChip, method === m && styles.methodChipActive]}
            onPress={() => setMethod(m)}
          >
            <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.body}>
        {method === 'QR Code' && (
          <>
            <QRPlaceholder value={shareLink} />
            <Text style={styles.accountId}>{formatAccountId(MOCK_ACCOUNT_ID)}</Text>
            <Text style={styles.helperText}>Scan to send crypto directly to this account</Text>
          </>
        )}

        {method === 'Account ID' && (
          <View style={styles.idCard}>
            <Text style={styles.idLabel}>Your Account ID</Text>
            <Text style={styles.idValue}>{formatAccountId(MOCK_ACCOUNT_ID)}</Text>
            <Pressable style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy Account ID'}</Text>
            </Pressable>
          </View>
        )}

        {method === 'Link' && (
          <View style={styles.idCard}>
            <Text style={styles.idLabel}>Shareable Link</Text>
            <Text style={styles.linkValue} numberOfLines={1}>{shareLink}</Text>
            <Pressable style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy Link'}</Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={styles.requestBtn}
          onPress={() => router.push('/receive/payment-request')}
        >
          <Text style={styles.requestBtnText}>Request a specific amount</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={handleShare}>
          <Text style={styles.primaryBtnText}>Share</Text>
        </Pressable>
      </View>
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
  methodRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 4 },
  methodChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: '#17171D', borderWidth: 1, borderColor: '#26262E',
  },
  methodChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  methodText: { color: '#9A9AA5', fontSize: 13, fontWeight: '600' },
  methodTextActive: { color: '#FFFFFF' },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 28 },
  qrBox: {
    width: 220, height: 220, backgroundColor: '#FFFFFF', borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  qrGrid: { width: 180, height: 180, flexDirection: 'row', flexWrap: 'wrap' },
  qrCell: { width: '14.28%', height: '14.28%', backgroundColor: 'transparent' },
  qrCellFilled: { backgroundColor: '#0B0B0F' },
  accountId: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginTop: 24, letterSpacing: 1 },
  helperText: { color: '#9A9AA5', fontSize: 13, marginTop: 8, textAlign: 'center' },
  idCard: {
    width: '100%', backgroundColor: '#17171D', borderRadius: 16, borderWidth: 1,
    borderColor: '#26262E', padding: 24, alignItems: 'center',
  },
  idLabel: { color: '#9A9AA5', fontSize: 13, fontWeight: '500' },
  idValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginTop: 8, letterSpacing: 1 },
  linkValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginTop: 8, maxWidth: '100%' },
  copyBtn: {
    marginTop: 18, backgroundColor: '#26262E', borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  copyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  requestBtn: { marginTop: 28 },
  requestBtnText: { color: '#8C7AFF', fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingBottom: 32 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', height: 54,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
