import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, typography } from '@/src/constants/theme';
import { capitalize, monthName, WEEKDAYS_SHORT } from '@/src/utils/format';

type CalendarPickerProps = {
  title?: string;
  /** Fecha seleccionada `YYYY-MM-DD`. El mes mostrado es el de esta fecha. */
  value: string;
  onChange: (isoDate: string) => void;
  /** Fecha mínima seleccionable `YYYY-MM-DD`. */
  minDate?: string;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Componente "Calendario" (Figma 2466:3705). */
export function CalendarPicker({ title = 'Fecha de salida', value, onChange, minDate }: CalendarPickerProps) {
  const [year, month] = value.split('-').map(Number);
  const monthIndex = month - 1;
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.month}>
        {capitalize(monthName(monthIndex))} {year}
      </Text>
      <View style={styles.row}>
        {WEEKDAYS_SHORT.map((weekday) => (
          <View key={weekday} style={styles.weekday}>
            <Text style={styles.weekdayText}>{weekday}</Text>
          </View>
        ))}
      </View>
      <View style={styles.weeks}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.row}>
            {week.map((day, dayIndex) => {
              if (day === null) return <View key={`empty-${dayIndex}`} style={styles.day} />;
              const iso = `${year}-${pad(month)}-${pad(day)}`;
              const selected = iso === value;
              const disabled = Boolean(minDate && iso < minDate);
              return (
                <Pressable
                  key={iso}
                  accessibilityRole="button"
                  accessibilityLabel={`${day} de ${monthName(monthIndex)}`}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => onChange(iso)}
                  style={[styles.day, selected ? styles.daySelected : null]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected ? styles.dayTextSelected : null,
                      disabled ? styles.dayTextDisabled : null,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
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
  month: {
    ...typography.textStrong,
    color: colors.textSecondary,
  },
  weeks: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  weekday: {
    flex: 1,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    ...typography.textSmall,
    color: colors.textPlaceholder,
  },
  day: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.chip,
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    color: colors.textPrimary,
  },
  dayTextSelected: {
    color: colors.onPrimary,
  },
  dayTextDisabled: {
    opacity: 0.35,
  },
});
