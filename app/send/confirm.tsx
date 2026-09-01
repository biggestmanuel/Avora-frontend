import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

// TODO: replace with lib/api/accountId resolved address lookup
function mockResolvedAddress(network: string): string {
  const prefixes: Record<string, string> = {
    TON: 'EQD4FPq-', BSC: '0x8f3Cc2', TRON: 'TXy9pQ2m',
    ETH: '0x9aB1c4', BASE: '0x2eF701', SOL: '7xKXtg2C',
  };
  return `${prefixes[network] ?? '0x0000'}...${network.toLowerCase()}9d21`;
}

export default function SendConfirm() {
  const params = useLocalSearchParams<{
    accountId?: string; recipientName?: string; externalAddress?: string;
    asset: string; amount: string; network: string; networkName: string; fee: string;
  }>();

  const isExternal = !params.accountId;
  const [showAddress, setShowAddress] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const resolvedAddress = isExternal
    ? params.externalAddress
    : mockResolvedAddress(params.network);

  const handleSend = async () => {
    setSending(true);
    try {
      // TODO: replace with real send via lib/api/transactions + lib/gas/gasAbstraction
      await new Promise((r) => setTimeout(r, 1400));
      setDone(true);
      setTimeout(() => router.replace('/(tabs)/home'), 1200);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successWrap}>
          <View style={styles.successCircle}>
            <Text style={styles.successCheck}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Sent</Text>
          <Text style={styles.successSubtitle}>
            {params.amount} {params.asset} is on its way
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Confirm</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.bigAmount}>{params.amount} {params.asset}</Text>
        <Text style={styles.toText}>
          to {isExternal ? 'External Wallet' : params.recipientName}
        </Text>

        <View style={styles.summaryCard}>
          <Row label="Recipient" value={isExternal ? 'External Wallet' : `${params.recipientName} (${params.accountId})`} />
          <Row label="Network" value={params.networkName} />
          <Row label="Network Fee" value={params.fee} />
          <Row label="Amount" value={`${params.amount} ${params.asset}`} />

          <Pressable style={styles.addressToggle} onPress={() => setShowAddress((v) => !v)}>
            <Text style={styles.addressToggleText}>
              {showAddress ? 'Hide resolved address' : 'Show resolved address'}
            </Text>
          </Pressable>
          {showAddress && (
            <View style={styles.addressBox}>
              <Text style={styles.addressText}>{resolvedAddress}</Text>
            </View>
          )}
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Double-check the details above. Crypto transactions can't be reversed once sent.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={handleSend} disabled={sending}>
          {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Confirm & Send</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
    </View>
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
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 20, alignItems: 'center' },
  bigAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '700' },
  toText: { color: '#9A9AA5', fontSize: 14, marginTop: 6, marginBottom: 24 },
  summaryCard: {
    width: '100%', backgroundColor: '#17171D', borderRadius: 16,
    borderWidth: 1, borderColor: '#26262E', padding: 18,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel: { color: '#9A9AA5', fontSize: 14 },
  rowValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', maxWidth: '60%' },
  addressToggle: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1D1D24' },
  addressToggleText: { color: '#8C7AFF', fontSize: 13, fontWeight: '600' },
  addressBox: { marginTop: 8, backgroundColor: '#0B0B0F', borderRadius: 10, padding: 12 },
  addressText: { color: '#D0D0D6', fontSize: 12 },
  warningBox: {
    width: '100%', backgroundColor: '#1A1610', borderRadius: 12, borderWidth: 1,
    borderColor: '#3A3020', padding: 14, marginTop: 20,
  },
  warningText: { color: '#E8B84B', fontSize: 12, lineHeight: 17 },
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
  successSubtitle: { color: '#9A9AA5', fontSize: 14, marginTop: 8 },
});
