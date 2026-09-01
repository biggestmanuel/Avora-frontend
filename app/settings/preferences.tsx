import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// TODO: persist via stores/userStore + lib/api/client preferences endpoint
const CURRENCIES = ['USD', 'NGN', 'EUR', 'GBP'] as const;
const LANGUAGES = ['English', 'French', 'Portuguese'] as const;
const NETWORKS = ['Auto (Recommended)', 'TON', 'BSC', 'ETH', 'SOL', 'Base', 'Polygon', 'TRON'] as const;

export default function Preferences() {
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>('USD');
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>('English');
  const [defaultNetwork, setDefaultNetwork] = useState<(typeof NETWORKS)[number]>('Auto (Recommended)');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Display Currency</Text>
        <View style={styles.chipRow}>
          {CURRENCIES.map((c) => (
            <Pressable
              key={c}
              style={[styles.chip, currency === c && styles.chipActive]}
              onPress={() => setCurrency(c)}
            >
              <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Language</Text>
        <View style={styles.card}>
          {LANGUAGES.map((l, idx) => (
            <Pressable
              key={l}
              style={[styles.optionRow, idx === LANGUAGES.length - 1 && styles.optionRowLast]}
              onPress={() => setLanguage(l)}
            >
              <Text style={styles.optionLabel}>{l}</Text>
              {language === l && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Default Network</Text>
        <Text style={styles.helperText}>Used as the starting choice when sending crypto</Text>
        <View style={styles.card}>
          {NETWORKS.map((n, idx) => (
            <Pressable
              key={n}
              style={[styles.optionRow, idx === NETWORKS.length - 1 && styles.optionRowLast]}
              onPress={() => setDefaultNetwork(n)}
            >
              <Text style={styles.optionLabel}>{n}</Text>
              {defaultNetwork === n && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  back: { color: '#FFFFFF', fontSize: 28 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },
  sectionTitle: { color: '#9A9AA5', fontSize: 13, fontWeight: '500', marginBottom: 10 },
  helperText: { color: '#5C5C66', fontSize: 12, marginBottom: 10, marginTop: -4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#17171D', borderWidth: 1, borderColor: '#26262E',
  },
  chipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  chipText: { color: '#9A9AA5', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  card: {
    backgroundColor: '#17171D', borderRadius: 14, borderWidth: 1, borderColor: '#26262E',
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1D1D24',
  },
  optionRowLast: { borderBottomWidth: 0 },
  optionLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  checkmark: { color: '#8C7AFF', fontSize: 16, fontWeight: '700' },
});
