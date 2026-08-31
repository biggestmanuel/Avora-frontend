import { View, StyleSheet } from 'react-native';
import { Input, Typography, Avatar } from '../ui';

interface ResolvedRecipient {
  accountId: string;
  name?: string;
  photoUri?: string;
}

interface RecipientInputProps {
  value: string;
  onChangeText: (text: string) => void;
  resolved?: ResolvedRecipient | null;
  error?: string;
}

// Accepts a 10-digit Account ID and shows the resolved profile once found
export function RecipientInput({ value, onChangeText, resolved, error }: RecipientInputProps) {
  return (
    <View style={styles.wrapper}>
      <Input
        label="Send to"
        placeholder="Account ID"
        keyboardType="number-pad"
        maxLength={10}
        value={value}
        onChangeText={onChangeText}
        error={error}
      />
      {resolved ? (
        <View style={styles.resolvedRow}>
          <Avatar uri={resolved.photoUri} fallbackInitial={resolved.name?.[0] ?? '#'} size={32} />
          <Typography variant="bodySmall">{resolved.name ?? resolved.accountId}</Typography>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  resolvedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
