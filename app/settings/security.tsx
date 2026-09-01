import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// TODO: replace with lib/storage/secureStorage + real session list from lib/api/client
const MOCK_SESSIONS = [
  { id: '1', device: 'iPhone 14 Pro', location: 'Port Harcourt, NG', current: true },
  { id: '2', device: 'Chrome on Windows', location: 'Lagos, NG', current: false },
];

export default function Security() {
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const handleRevoke = (id: string) => {
    Alert.alert('Revoke session', 'End this session on the selected device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: () => setSessions((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.actionRow} onPress={() => router.push('/(auth)/create-pin')}>
          <Text style={styles.actionLabel}>Change PIN</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Biometric Unlock</Text>
              <Text style={styles.toggleDesc}>Use Face ID / Fingerprint to open the app</Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#26262E', true: '#6C5CE7' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.toggleRow, styles.toggleRowLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Two-Factor Authentication</Text>
              <Text style={styles.toggleDesc}>Extra verification step for sensitive actions</Text>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={setTwoFactor}
              trackColor={{ false: '#26262E', true: '#6C5CE7' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Sessions</Text>
        <View style={styles.card}>
          {sessions.map((s, idx) => (
            <View key={s.id} style={[styles.sessionRow, idx === sessions.length - 1 && styles.toggleRowLast]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>
                  {s.device} {s.current ? '(This device)' : ''}
                </Text>
                <Text style={styles.toggleDesc}>{s.location}</Text>
              </View>
              {!s.current && (
                <Pressable onPress={() => handleRevoke(s.id)}>
                  <Text style={styles.revokeText}>Revoke</Text>
                </Pressable>
              )}
            </View>
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
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#17171D', borderRadius: 14, borderWidth: 1, borderColor: '#26262E',
    paddingHorizontal: 16, paddingVertical: 16, marginBottom: 16,
  },
  actionLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  chevron: { color: '#5C5C66', fontSize: 20 },
  card: {
    backgroundColor: '#17171D', borderRadius: 14, borderWidth: 1, borderColor: '#26262E',
    overflow: 'hidden', marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1D1D24',
  },
  toggleRowLast: { borderBottomWidth: 0 },
  toggleLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  toggleDesc: { color: '#9A9AA5', fontSize: 12, marginTop: 3 },
  sectionTitle: { color: '#9A9AA5', fontSize: 13, fontWeight: '500', marginBottom: 10 },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1D1D24',
  },
  revokeText: { color: '#FF6B6B', fontSize: 13, fontWeight: '600' },
});
