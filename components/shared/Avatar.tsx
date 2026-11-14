import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/src/constants/theme';
import { getInitials } from '@/src/utils/format';

type AvatarProps = {
  name: string;
  /** Diámetro: 40 en tarjetas, 44 en detalles. */
  size?: number;
  imageUrl?: string;
  /** Texto alternativo a las iniciales (p. ej. "+2"). */
  label?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Avatar circular con iniciales (color/superficie/verde-suave). */
export function Avatar({
  name,
  size = 40,
  imageUrl,
  label,
  backgroundColor = colors.surfaceGreenSoft,
  style,
}: AvatarProps) {
  const fontSize = size <= 40 ? 14 : Math.round(size * 0.41);

  return (
    <View
      accessibilityLabel={name}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor }, style]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: size, height: size }} />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{label ?? getInitials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: fonts.bold,
    color: colors.textDark,
  },
});
