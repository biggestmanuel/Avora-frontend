import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';

type Tone = 'neutral' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  tone?: Tone;
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <View style={[styles.base, tones[tone].bg]}>
      <Typography variant="caption" color={tones[tone].text}>{label}</Typography>
    </View>
  );
}

const tones: Record<Tone, { bg: any; text: string }> = {
  neutral: { bg: { backgroundColor: '#EEE' }, text: '#333' },
  success: { bg: { backgroundColor: '#E3F7E8' }, text: '#1A7F37' },
  warning: { bg: { backgroundColor: '#FFF4DE' }, text: '#B36B00' },
  danger: { bg: { backgroundColor: '#FDE7E7' }, text: '#C4342B' },
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
