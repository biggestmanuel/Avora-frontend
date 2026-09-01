import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const SECTIONS = [
  { label: 'Security', desc: 'PIN, biometrics, sessions', route: '/settings/security' },
  { label: 'Notifications', desc: 'Push, email, alerts', route: '/settings/notifications' },
  { label: 'Preferences', desc: 'Currency, language, network', route: '/settings/preferences' },
] as const;

export default function SettingsIndex() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        {SECTIONS.map((s) => (
          <Pressable key={s.label} style={styles.row} onPress={() => router.push(s.route)}>
            <View>
              <Text style={styles.rowLabel}>{s.label}</Text>
              <Text style={styles.rowDesc}>{s.desc}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
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
  body: {
    marginTop: 12, marginHorizontal: 20, backgroundColor: '#17171D', borderRadius: 16,
    borderWidth: 1, borderColor: '#26262E', overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1D1D24',
  },
  rowLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  rowDesc: { color: '#9A9AA5', fontSize: 12, marginTop: 3 },
  chevron: { color: '#5C5C66', fontSize: 20 },
});
