import { View, StyleSheet } from 'react-native';
import { Card, Typography, Divider } from '../ui';

interface ReceiptCardProps {
  amount: string;
  symbol: string;
  recipient: string;
  network: string;
  fee: string;
  txId: string;
}

export function ReceiptCard({ amount, symbol, recipient, network, fee, txId }: ReceiptCardProps) {
  const rows: [string, string][] = [
    ['Amount', `${amount} ${symbol}`],
    ['Recipient', recipient],
    ['Network', network],
    ['Fee', fee],
    ['Transaction ID', txId],
  ];
  return (
    <Card style={styles.card}>
      {rows.map(([label, val], i) => (
        <View key={label}>
          <View style={styles.row}>
            <Typography variant="caption">{label}</Typography>
            <Typography variant="bodySmall">{val}</Typography>
          </View>
          {i < rows.length - 1 ? <Divider /> : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
});
