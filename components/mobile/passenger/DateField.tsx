import type { StyleProp, ViewStyle } from 'react-native';

import { FormField } from '@/components/mobile/Form';
import { IconFecha } from '@/components/mobile/icons';
import { colors } from '@/src/constants/theme';
import type { IsoDate } from '@/src/types/common';

/** `2006-01-01` → `01/01/2006` */
export function isoToDisplayDate(iso: IsoDate): string {
  const [year, month, day] = iso.split('-');
  return year && month && day ? `${day}/${month}/${year}` : '';
}

/** `01/01/2006` → `2006-01-01`, o `null` si la fecha no existe. */
export function displayToIsoDate(text: string): IsoDate | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return valid ? `${yyyy}-${mm}-${dd}` : null;
}

/** Inserta las barras mientras se escribe: "01012006" → "01/01/2006". */
function maskDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

type DateFieldProps = {
  label: string;
  /** Texto en formato `DD/MM/AAAA`. */
  value: string;
  onChange: (text: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Campo de fecha "Edad" (componente "Fechas" de Registro y Mi Perfil).
 *
 * En Figma abre un calendario desplegable, pero el selector de calendario de la
 * app solo muestra un mes; para una fecha de nacimiento se escribe con máscara
 * `DD/MM/AAAA`.
 */
export function DateField({ label, value, onChange, error, containerStyle }: DateFieldProps) {
  return (
    <FormField
      label={label}
      value={value}
      onChangeText={(text) => onChange(maskDate(text))}
      placeholder="DD/MM/AAAA"
      keyboardType="number-pad"
      maxLength={10}
      error={error}
      containerStyle={containerStyle}
      rightElement={<IconFecha width={16} height={16} color={colors.textPlaceholder} />}
    />
  );
}
