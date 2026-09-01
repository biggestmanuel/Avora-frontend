import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const PIN_LENGTH = 6;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function CreatePin() {
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activePin = stage === 'create' ? pin : confirmPin;
  const setActivePin = stage === 'create' ? setPin : setConfirmPin;

  const handleKeyPress = (key: string) => {
    if (key === '') return;
    setError(null);

    if (key === 'del') {
      setActivePin(activePin.slice(0, -1));
      return;
    }

    if (activePin.length >= PIN_LENGTH) return;
    const next = activePin + key;
    setActivePin(next);

    if (next.length === PIN_LENGTH) {
      if (stage === 'create') {
        setTimeout(() => setStage('confirm'), 150);
      } else {
        if (next === pin) {
          // TODO: persist PIN via lib/storage/secureStorage + lib/api/client
          router.push('/(auth)/create-account-id');
        } else {
          setError('PINs do not match');
          setTimeout(() => {
            setConfirmPin('');
          }, 400);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>
          {stage === 'create' ? 'Create your PIN' : 'Confirm your PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {stage === 'create'
            ? 'Used to authorize transactions'
            : 'Enter your PIN again to confirm'}
        </Text>

        <View style={styles.dotsRow}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < activePin.length && styles.dotFilled]}
            />
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.keypad}>
        {KEYS.map((key, idx) => (
          <Pressable
            key={idx}
            style={styles.key}
            onPress={() => handleKeyPress(key)}
            disabled={key === ''}
          >
            <Text style={styles.keyText}>{key === 'del' ? '⌫' : key}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F', justifyContent: 'space-between' },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 56, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#9A9AA5', marginTop: 8, marginBottom: 40, textAlign: 'center' },
  dotsRow: { flexDirection: 'row', gap: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: '#3A3A45' },
  dotFilled: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
  error: { color: '#FF6B6B', fontSize: 13, marginTop: 24 },
  keypad: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, paddingBottom: 40,
  },
  key: {
    width: '33.33%', height: 76, alignItems: 'center', justifyContent: 'center',
  },
  keyText: { fontSize: 26, color: '#FFFFFF', fontWeight: '500' },
});
