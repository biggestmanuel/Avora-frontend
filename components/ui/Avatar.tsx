import { View, Image, StyleSheet } from 'react-native';
import { Typography } from './Typography';

interface AvatarProps {
  uri?: string | null;
  fallbackInitial?: string;
  size?: number;
}

export function Avatar({ uri, fallbackInitial = '?', size = 44 }: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dimension]} />;
  }
  return (
    <View style={[styles.fallback, dimension]}>
      <Typography variant="label">{fallbackInitial.toUpperCase()}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: '#EEE' },
  fallback: { backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
});
