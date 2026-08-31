import { View, StyleSheet } from 'react-native';

export function Divider() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: '#E0E0E0', width: '100%' },
});
