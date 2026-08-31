import { View, TextInput, StyleSheet } from 'react-native';
import { Typography } from '../ui';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  symbol: string;
  usdEquivalent?: string;
}

export function AmountInput({ value, onChangeText, symbol, usdEquivalent }: AmountInputProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#CCC"
        />
        <Typography variant="h3">{symbol}</Typography>
      </View>
      {usdEquivalent ? (
        <Typography variant="caption" style={styles.equiv}>{usdEquivalent}</Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  input: { fontSize: 40, fontWeight: '700', minWidth: 80, textAlign: 'right' },
  equiv: { textAlign: 'center' },
});
