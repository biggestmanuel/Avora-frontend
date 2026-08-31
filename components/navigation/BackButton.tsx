import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../ui';

export function BackButton() {
  const router = useRouter();
  return (
    <Pressable style={styles.btn} onPress={() => router.back()} hitSlop={12}>
      <Typography variant="h3">{'\u2190'}</Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
