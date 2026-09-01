import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <View style={styles.logoDot} />
        <Text style={styles.title}>Send crypto with{'\n'}just an ID</Text>
        <Text style={styles.subtitle}>
          No wallet addresses to copy. No mistakes to make.
          Just your Account ID.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.primaryBtnText}>Create Account</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', justifyContent: 'space-between' },
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoDot: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#6C5CE7', marginBottom: 24,
  },
  title: { fontSize: 34, fontWeight: '700', color: '#FFFFFF', lineHeight: 40 },
  subtitle: { fontSize: 16, color: '#9A9AA5', marginTop: 16, lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  primaryBtn: {
    backgroundColor: '#6C5CE7', borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryBtn: { paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { color: '#9A9AA5', fontSize: 15, fontWeight: '500' },
});
