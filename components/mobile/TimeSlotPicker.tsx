import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, typography } from '@/src/constants/theme';

/** Horarios del componente "Selector hora" (formato `HH:mm`). */
export const DEFAULT_TIME_SLOTS = [
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '12:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
];

/** "06:30" → "6:30 a. m." */
export function formatSlot(slot: string): string {
  const [hours, minutes] = slot.split(':').map(Number);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'a. m.' : 'p. m.'}`;
}

type TimeSlotPickerProps = {
  title?: string;
  /** Hora seleccionada `HH:mm`. */
  value?: string;
  onChange: (slot: string) => void;
  slots?: string[];
};

/** Componente "Selector hora" (Figma 2466:3826). */
export function TimeSlotPicker({
  title = 'Hora de salida',
  value,
  onChange,
  slots = DEFAULT_TIME_SLOTS,
}: TimeSlotPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {slots.map((slot) => {
          const selected = slot === value;
          return (
            <Pressable
              key={slot}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(slot)}
              style={[styles.slot, selected ? styles.slotSelected : null]}
            >
              <Text style={[styles.slotText, selected ? styles.slotTextSelected : null]}>{formatSlot(slot)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 12,
  },
  title: {
    ...typography.nameHighlight,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slot: {
    width: '31.5%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.input,
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    color: colors.textPrimary,
  },
  slotTextSelected: {
    color: colors.onPrimary,
  },
});
