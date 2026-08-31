import { View, Pressable, StyleSheet } from 'react-native';
import { Typography, Avatar } from '../ui';

interface AssetRowProps {
  symbol: string;
  network: string;
  balance: string;
  usdValue: string;
  iconUri?: string;
  onPress?: () => void;
}

export function AssetRow({ symbol, network, balance, usdValue, iconUri, onPress }: AssetRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Avatar uri={iconUri} fallbackInitial={symbol[0]} />
      <View style={styles.middle}>
        <Typography variant="label">{symbol}</Typography>
        <Typography variant="caption">{network}</Typography>
      </View>
      <View style={styles.right}>
        <Typography variant="body">{balance}</Typography>
        <Typography variant="caption">{usdValue}</Typography>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  middle: { flex: 1 },
  right: { alignItems: 'flex-end' },
});
