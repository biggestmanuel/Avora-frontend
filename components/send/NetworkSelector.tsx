import { View, Pressable, StyleSheet } from 'react-native';
import { Typography, Badge } from '../ui';

export interface NetworkOption {
  id: string;
  label: string;
  estimatedFee: string;
  recommended?: boolean;
}

interface NetworkSelectorProps {
  options: NetworkOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function NetworkSelector({ options, selectedId, onSelect }: NetworkSelectorProps) {
  return (
    <View style={styles.list}>
      {options.map((opt) => {
        const active = opt.id === selectedId;
        return (
          <Pressable
            key={opt.id}
            style={[styles.row, active && styles.rowActive]}
            onPress={() => onSelect(opt.id)}
          >
            <View style={styles.left}>
              <Typography variant="label">{opt.label}</Typography>
              {opt.recommended ? <Badge label="Recommended" tone="success" /> : null}
            </View>
            <Typography variant="caption">{opt.estimatedFee}</Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rowActive: { borderColor: '#000' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
