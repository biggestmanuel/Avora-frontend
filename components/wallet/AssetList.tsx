import { FlatList } from 'react-native';
import { AssetRow } from './AssetRow';
import { Divider } from '../ui';

export interface AssetItem {
  id: string;
  symbol: string;
  network: string;
  balance: string;
  usdValue: string;
  iconUri?: string;
}

interface AssetListProps {
  assets: AssetItem[];
  onSelect?: (asset: AssetItem) => void;
}

export function AssetList({ assets, onSelect }: AssetListProps) {
  return (
    <FlatList
      data={assets}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => (
        <AssetRow
          symbol={item.symbol}
          network={item.network}
          balance={item.balance}
          usdValue={item.usdValue}
          iconUri={item.iconUri}
          onPress={() => onSelect?.(item)}
        />
      )}
    />
  );
}
