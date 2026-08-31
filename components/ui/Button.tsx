import { Pressable, ActivityIndicator, StyleSheet, PressableProps } from 'react-native';
import { Typography } from './Typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style as any,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#000'} />
      ) : (
        <Typography variant="label" color={variant === 'primary' || variant === 'destructive' ? '#fff' : '#000'}>
          {label}
        </Typography>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: '#000' },
  secondary: { backgroundColor: '#F0F0F0' },
  ghost: { backgroundColor: 'transparent' },
  destructive: { backgroundColor: '#E5484D' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
});
