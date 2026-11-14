import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconChevronLeft, IconChevronRight } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import type { IsoDate } from '@/src/types/common';
import { fonts, palette } from '@/src/constants/theme';
import { now } from '@/src/utils/clock';
import { capitalize, monthName, toIsoDate } from '@/src/utils/format';

// Encabezados de la semana tal como aparecen en `Dropdown calendar` (2063:4321).
const WEEKDAY_LABELS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

type CalendarPopoverProps = {
  value: IsoDate | null;
  onChange: (value: IsoDate | null) => void;
};

function parse(value: IsoDate): { year: number; month: number; day: number } {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month: month - 1, day };
}

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Calendario desplegable de los filtros de fecha (componente `Dropdown calendar`).
 * Los textos del diseño están en inglés ("October 2026", "Clear", "Today"); aquí
 * se muestran en español.
 */
export function CalendarPopover({ value, onChange }: CalendarPopoverProps) {
  const today = toIsoDate(now());
  const initial = parse(value ?? today);
  const [cursor, setCursor] = useState({ year: initial.year, month: initial.month });

  const firstWeekday = (new Date(Date.UTC(cursor.year, cursor.month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const move = (delta: number) =>
    setCursor(({ year, month }) => {
      const next = month + delta;
      return { year: year + Math.floor(next / 12), month: ((next % 12) + 12) % 12 };
    });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.month}>
          {capitalize(monthName(cursor.month))} {cursor.year}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Mes anterior" onPress={() => move(-1)} hitSlop={8}>
          <IconChevronLeft />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Mes siguiente" onPress={() => move(1)} hitSlop={8}>
          <IconChevronRight />
        </Pressable>
      </View>
      <View style={styles.grid}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.cell}>
            <Text style={styles.weekday}>{label}</Text>
          </View>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <View key={`empty-${index}`} style={styles.cell} />;
          const iso = `${cursor.year}-${pad(cursor.month + 1)}-${pad(day)}`;
          const selected = iso === value;
          const isToday = iso === today;
          return (
            <Pressable
              key={iso}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(iso)}
              style={[styles.cell, styles.day, isToday && styles.today, selected && styles.selected]}
            >
              <Text style={[styles.dayText, selected && styles.selectedText]}>{day}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.footer}>
        <Pressable accessibilityRole="button" onPress={() => onChange(null)}>
          <Text style={styles.clear}>Limpiar</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => onChange(today)}>
          <Text style={styles.todayLink}>Hoy</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** "01/01/2026" */
export function formatFilterDate(value: IsoDate | null): string {
  if (!value) return '';
  const { year, month, day } = parse(value);
  return `${pad(day)}/${pad(month + 1)}/${year}`;
}

const CELL = 38;

const styles = StyleSheet.create({
  card: {
    width: 296,
    backgroundColor: palette.white,
    borderRadius: 12,
    paddingTop: 16,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.18)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 12,
  },
  month: {
    flex: 1,
    fontFamily: fonts.cairoSemiBold,
    fontSize: 16,
    color: palette.nearBlack,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
  },
  cell: {
    width: CELL,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekday: {
    fontFamily: fonts.cairoRegular,
    fontSize: 11,
    color: palette.greyMedium,
  },
  day: {
    borderRadius: 8,
  },
  today: {
    backgroundColor: webExtra.calendarToday,
  },
  selected: {
    backgroundColor: webExtra.calendarAccent,
  },
  dayText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: palette.nearBlack,
  },
  selectedText: {
    color: palette.white,
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: palette.greyLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clear: {
    fontFamily: fonts.cairoMedium,
    fontSize: 14,
    color: palette.nearBlack,
  },
  todayLink: {
    fontFamily: fonts.cairoMedium,
    fontSize: 14,
    color: webExtra.calendarAccent,
  },
});
