import { View, ViewProps, StyleSheet } from 'react-native';

export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
    padding: 16,
  },
});
