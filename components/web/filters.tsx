import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CalendarPopover, formatFilterDate } from '@/components/web/CalendarPopover';
import { IconCalendar, IconReset, IconStepperUp } from '@/components/web/icons';
import { webExtra, webShadow } from '@/components/web/tokens';
import type { IsoDate } from '@/src/types/common';
import { fonts, palette, radius, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

/** Tarjeta de filtros de Consultas y Estadísticas (126 px, radio 26, sombra). */
export function FilterCard({ children, onReset, resetLabel = 'Restablecer filtros' }: {
  children: ReactNode;
  onReset: () => void;
  resetLabel?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.items}>{children}</View>
      <ResetButton label={resetLabel} onPress={onReset} />
    </View>
  );
}

/** Etiqueta gris sobre cada control del filtro. */
export function FilterItem({ label, children, suffix }: { label: string; children: ReactNode; suffix?: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.itemRow}>
        {children}
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

/** Botón "Restablecer filtros" (componente `Restablecer` 2053:1974, con estado hover). */
export function ResetButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      {...hoverProps}
      style={[styles.control, styles.reset, hovered && styles.resetHover]}
    >
      <IconReset color={webColors.headerText} />
      <Text style={styles.controlText}>{label}</Text>
    </Pressable>
  );
}

/** Campo "Buscar" con el placeholder "Nombre de usuario...". */
export function FilterSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Nombre de usuario..."
      placeholderTextColor={palette.grey}
      accessibilityLabel="Buscar"
      style={[styles.control, styles.controlText, styles.search]}
    />
  );
}

type DateFieldProps = {
  value: IsoDate | null;
  onChange: (value: IsoDate | null) => void;
  accessibilityLabel: string;
};

/** Campo de fecha (componente `Fechas` 2050:1839) que abre el calendario desplegable. */
export function DateField({ value, onChange, accessibilityLabel }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.dateWrapper, open && styles.raised]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        style={[styles.control, styles.date, open && styles.controlOpen]}
      >
        <Text style={[styles.controlText, !value && styles.placeholder]}>{value ? formatFilterDate(value) : 'dd/mm/aaaa'}</Text>
        <IconCalendar color={palette.nearBlack} />
      </Pressable>
      {open ? (
        <View style={styles.popover}>
          <CalendarPopover
            value={value}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

type TopStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  accessibilityLabel: string;
};

/** Selector numérico "Top N" con flechas (polígonos grises del diseño). */
export function TopStepper({ value, onChange, min = 1, max = 99, accessibilityLabel }: TopStepperProps) {
  return (
    <View style={[styles.control, styles.stepper]} accessibilityLabel={accessibilityLabel}>
      <Text style={[styles.controlText, styles.stepperValue]}>{value}</Text>
      <View style={styles.stepperArrows}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aumentar"
          disabled={value >= max}
          onPress={() => onChange(Math.min(max, value + 1))}
          hitSlop={4}
        >
          <IconStepperUp color={webExtra.lightGrey} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Disminuir"
          disabled={value <= min}
          onPress={() => onChange(Math.max(min, value - 1))}
          hitSlop={4}
          style={styles.flipped}
        >
          <IconStepperUp color={webExtra.lightGrey} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 126,
    borderRadius: 26,
    backgroundColor: webColors.card,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingBottom: 34,
    paddingLeft: 23,
    paddingRight: 28,
    gap: 24,
    zIndex: 10,
    ...webShadow,
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: 42,
    rowGap: 12,
  },
  item: {
    gap: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
  label: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: palette.greyMedium,
  },
  suffix: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: palette.greyMedium,
  },
  control: {
    height: 45,
    borderRadius: radius.webControl,
    borderWidth: 2,
    borderColor: palette.grey,
    backgroundColor: palette.white,
  },
  controlOpen: {
    borderColor: palette.sage,
  },
  controlText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 20,
    color: webColors.headerText,
  },
  placeholder: {
    color: palette.grey,
  },
  reset: {
    width: 239,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 21,
    gap: 11,
  },
  resetHover: {
    backgroundColor: palette.greyLight,
  },
  search: {
    width: 287,
    paddingHorizontal: 9,
  },
  dateWrapper: {
    position: 'relative',
  },
  raised: {
    zIndex: 50,
  },
  date: {
    width: 188,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 9,
    paddingRight: 12,
  },
  popover: {
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 60,
  },
  stepper: {
    width: 53,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
  },
  stepperValue: {
    color: palette.black,
    flex: 1,
  },
  stepperArrows: {
    gap: 3,
    paddingRight: 5,
  },
  flipped: {
    transform: [{ rotate: '180deg' }],
  },
});
