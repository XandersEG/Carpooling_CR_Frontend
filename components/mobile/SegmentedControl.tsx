import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, typography } from '@/src/constants/theme';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

/** Componente "Toggle Lista-Mapa" (Figma 2461:2808), también usado para Pasajeros/Paradas. */
export function SegmentedControl<T extends string>({ options, value, onChange, style }: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" style={[styles.container, style]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active ? styles.segmentActive : null]}
          >
            <Text style={active ? styles.labelActive : styles.label}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: colors.borderCard,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.button,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.segment,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.textStrong,
    color: colors.textSecondary,
  },
  labelActive: {
    ...typography.toggleActive,
    color: colors.onPrimary,
  },
});
