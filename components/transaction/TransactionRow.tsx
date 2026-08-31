import { Pressable, View, StyleSheet } from 'react-native';
import { Typography } from '../ui';
import { TransactionStatus } from './TransactionStatus';

interface TransactionRowProps {
  direction: 'sent' | 'received';
  counterparty: string;
  amount: string;
  symbol: string;
  status: 'processing' | 'complete' | 'failed';
  timestamp: string;
  onPress?: () => void;
}

export function TransactionRow({
  direction,
  counterparty,
  amount,
  symbol,
  status,
  timestamp,
  onPress,
}: TransactionRowProps) {
  const sign = direction === 'sent' ? '-' : '+';
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Typography variant="label">{direction === 'sent' ? 'To' : 'From'} {counterparty}</Typography>
        <Typography variant="caption">{timestamp}</Typography>
      </View>
      <View style={styles.right}>
        <Typography variant="body">{sign}{amount} {symbol}</Typography>
        <TransactionStatus status={status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  left: { gap: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
});
