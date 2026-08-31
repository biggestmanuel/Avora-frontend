import { View, ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingSpinner({ size = 'small' as 'small' | 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, alignItems: 'center', justifyContent: 'center' },
});
