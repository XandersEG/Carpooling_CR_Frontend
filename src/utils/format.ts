/**
 * Formato de montos, fechas y nombres según los textos del diseño.
 *
 * Las fechas se muestran en hora de Costa Rica (UTC-6, sin horario de verano),
 * sin depender de la zona horaria del dispositivo.
 */
import type { Colones } from '@/src/types/common';
import { now } from '@/src/utils/clock';

const COSTA_RICA_OFFSET_MS = -6 * 60 * 60 * 1000;

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

type DateInput = Date | string;

type DateParts = {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hours: number;
  minutes: number;
};

/** Componentes de la fecha en hora de Costa Rica. */
export function getDateParts(value: DateInput): DateParts {
  const date = typeof value === 'string' ? new Date(value) : value;
  const local = new Date(date.getTime() + COSTA_RICA_OFFSET_MS);
  return {
    year: local.getUTCFullYear(),
    month: local.getUTCMonth(),
    day: local.getUTCDate(),
    weekday: local.getUTCDay(),
    hours: local.getUTCHours(),
    minutes: local.getUTCMinutes(),
  };
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function monthName(month: number): string {
  return MONTHS[month];
}

/** "₡1 500" */
export function formatColones(amount: Colones): string {
  const digits = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `₡${digits}`;
}

/** "₡1 500" o "Gratis" cuando el monto es 0. */
export function formatCost(amount: Colones): string {
  return amount === 0 ? 'Gratis' : formatColones(amount);
}

/** "6:30 a. m." */
export function formatTime(value: DateInput): string {
  const { hours, minutes } = getDateParts(value);
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'a. m.' : 'p. m.'}`;
}

export function isSameDay(a: DateInput, b: DateInput): boolean {
  const pa = getDateParts(a);
  const pb = getDateParts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

export function isToday(value: DateInput): boolean {
  return isSameDay(value, now());
}

/** "Hoy" o "25 oct" */
export function formatRelativeDay(value: DateInput): string {
  if (isToday(value)) return 'Hoy';
  const { day, month } = getDateParts(value);
  return `${day} ${MONTHS_SHORT[month]}`;
}

/** "Hoy, 25 oct" o "24 oct" */
export function formatShortDate(value: DateInput): string {
  const { day, month } = getDateParts(value);
  const date = `${day} ${MONTHS_SHORT[month]}`;
  return isToday(value) ? `Hoy, ${date}` : date;
}

/** "Domingo 25 de Oct 2026" */
export function formatLongDate(value: DateInput): string {
  const { day, month, year, weekday } = getDateParts(value);
  return `${capitalize(WEEKDAYS[weekday])} ${day} de ${capitalize(MONTHS_SHORT[month])} ${year}`;
}

/** "Hoy, 25 de Octubre" o "24 de Octubre" */
export function formatDayMonth(value: DateInput): string {
  const { day, month } = getDateParts(value);
  const date = `${day} de ${capitalize(MONTHS[month])}`;
  return isToday(value) ? `Hoy, ${date}` : date;
}

/** "Domingo 25 Oct - 6:30 a. m." (tarjetas de "Mis Viajes") */
export function formatCardDateTime(value: DateInput): string {
  const { day, month, weekday } = getDateParts(value);
  return `${capitalize(WEEKDAYS[weekday])} ${day} ${capitalize(MONTHS_SHORT[month])} - ${formatTime(value)}`;
}

/** "22 oct. 2026" (tablas del portal web) */
export function formatTableDate(value: DateInput): string {
  const { day, month, year } = getDateParts(value);
  return `${day} ${MONTHS_SHORT[month]}. ${year}`;
}

/** Fecha `YYYY-MM-DD` en hora de Costa Rica. */
export function toIsoDate(value: DateInput): string {
  const { year, month, day } = getDateParts(value);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Iniciales para avatares: "Ana Rojas" → "AR"; con dos nombres y dos apellidos
 * se usan el primer nombre y el primer apellido ("Diego Jose Araya Cordero" → "DA").
 */
export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const second = words.length >= 4 ? words[2] : words[1];
  return `${words[0][0]}${second ? second[0] : ''}`.toUpperCase();
}

/**
 * Chip de verificación del conductor: "Conductora · Verificada TEC" o
 * "Conductor · Verificado TEC". Sin género femenino indicado se usa la forma masculina,
 * como en el resto del diseño.
 */
export function driverBadge(driver: { gender?: string; verifiedInstitution?: string }): string {
  const female = driver.gender === 'Femenino';
  const role = female ? 'Conductora' : 'Conductor';
  if (!driver.verifiedInstitution) return role;
  return `${role} · ${female ? 'Verificada' : 'Verificado'} ${driver.verifiedInstitution}`;
}

/** "1 cupo" / "3 cupos" */
export function formatSeats(count: number): string {
  return `${count} ${count === 1 ? 'cupo' : 'cupos'}`;
}

/** "4 pasajeros" */
export function formatPassengers(count: number): string {
  return `${count} ${count === 1 ? 'pasajero' : 'pasajeros'}`;
}
