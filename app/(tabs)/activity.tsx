import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList } from 'react-native';
import { router } from 'expo-router';

// TODO: replace with stores/txStore + lib/api/transactions
type Tx = {
  id: string;
  type: 'sent' | 'received' | 'deposit' | 'withdraw';
  counterparty: string;
  amount: string;
  asset: string;
  network: string;
  time: string;
  status: 'complete' | 'processing';
};

const MOCK_TRANSACTIONS: Tx[] = [
  { id: '1', type: 'received', counterparty: '7729 104 552', amount: '+120.00', asset: 'USDT', network: 'TON', time: '2h ago', status: 'complete' },
  { id: '2', type: 'sent', counterparty: '0192 883 210', amount: '-45.00', asset: 'USDT', network: 'BSC', time: 'Yesterday', status: 'complete' },
  { id: '3', type: 'deposit', counterparty: 'Bank Deposit', amount: '+50,000.00', asset: 'NGN', network: 'Bachs', time: '2 days ago', status: 'complete' },
  { id: '4', type: 'sent', counterparty: '5510 992 034', amount: '-0.05', asset: 'ETH', network: 'ETH', time: '3 days ago', status: 'processing' },
  { id: '5', type: 'withdraw', counterparty: 'Bank Withdrawal', amount: '-20,000.00', asset: 'NGN', network: 'Bachs', time: '5 days ago', status: 'complete' },
];

const FILTERS = ['All', 'Sent', 'Received', 'Deposits'] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(tx: Tx, filter: Filter): boolean {
  if (filter === 'All') return true;
  if (filter === 'Sent') return tx.type === 'sent';
  if (filter === 'Received') return tx.type === 'received';
  return tx.type === 'deposit' || tx.type === 'withdraw';
}

function txLabel(tx: Tx): string {
  if (tx.type === 'deposit' || tx.type === 'withdraw') return tx.counterparty;
  return tx.type === 'sent' ? `To ${tx.counterparty}` : `From ${tx.counterparty}`;
}

function txIcon(tx: Tx): string {
  if (tx.type === 'sent' || tx.type === 'withdraw') return '↑';
  return tx.type === 'received' ? '↓' : '+';
}

export default function Activity() {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(
    () => MOCK_TRANSACTIONS.filter((tx) => matchesFilter(tx, filter)),
    [filter]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Activity</Text>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No transactions in this category</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.txRow} onPress={() => router.push(`/transaction/${item.id}`)}>
            <View style={styles.txIconWrap}>
              <Text style={styles.txIcon}>{txIcon(item)}</Text>
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txLabel}>{txLabel(item)}</Text>
              <Text style={styles.txMeta}>
                {item.network} · {item.time}
                {item.status === 'processing' ? ' · Processing' : ''}
              </Text>
            </View>
            <Text style={[styles.txAmount, item.amount.startsWith('+') && styles.txAmountPositive]}>
              {item.amount} {item.asset}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#17171D', borderWidth: 1, borderColor: '#26262E',
  },
  filterChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  filterText: { color: '#9A9AA5', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  list: { paddingTop: 8, paddingBottom: 32 },
  empty: { color: '#5C5C66', textAlign: 'center', marginTop: 40, fontSize: 14 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#17171D' },
  txIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#17171D',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  txIcon: { color: '#9A9AA5', fontSize: 16, fontWeight: '700' },
  txDetails: { flex: 1 },
  txLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  txMeta: { color: '#5C5C66', fontSize: 12, marginTop: 2 },
  txAmount: { color: '#D0D0D6', fontSize: 14, fontWeight: '600' },
  txAmountPositive: { color: '#4CD97B' },
});
