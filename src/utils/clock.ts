import { USE_MOCK_DATA } from '@/src/services/config';

/**
 * En los diseños de Figma "Hoy" es el domingo 25 de octubre de 2026. Con datos
 * simulados se usa esa fecha para que las etiquetas relativas ("Hoy") coincidan.
 */
const MOCK_NOW = '2026-10-25T05:00:00-06:00';

export function now(): Date {
  return USE_MOCK_DATA ? new Date(MOCK_NOW) : new Date();
}
