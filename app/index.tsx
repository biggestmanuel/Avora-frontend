import { View, ActivityIndicator, StyleSheet } from 'react-native';

// This renders only in the brief window between splash-hide and the
// redirect firing in app/_layout.tsx. It should never be seen for long.
export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
