import { View, StyleSheet } from 'react-native';
import { Input, Button } from '../ui';

interface PaymentRequestFormProps {
  amount: string;
  onChangeAmount: (val: string) => void;
  note: string;
  onChangeNote: (val: string) => void;
  onGenerate: () => void;
  loading?: boolean;
}

export function PaymentRequestForm({
  amount,
  onChangeAmount,
  note,
  onChangeNote,
  onGenerate,
  loading,
}: PaymentRequestFormProps) {
  return (
    <View style={styles.form}>
      <Input
        label="Amount (optional)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={onChangeAmount}
        placeholder="0.00"
      />
      <Input
        label="Note (optional)"
        value={note}
        onChangeText={onChangeNote}
        placeholder="What's this for?"
      />
      <Button label="Generate request link" onPress={onGenerate} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 14 },
});
