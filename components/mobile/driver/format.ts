import type { Vehicle } from '@/src/types/vehicle';
import { capitalize, formatRelativeDay, formatTime } from '@/src/utils/format';

/** "Toyota Corolla" */
export function vehicleName(vehicle: Pick<Vehicle, 'brand' | 'model'>): string {
  return `${vehicle.brand} ${vehicle.model}`.trim();
}

/** "Hoy - 6:30 p. m." o "24 Oct - 6:45 a. m." (chips del historial). */
export function formatChipDateTime(value: string): string {
  const day = formatRelativeDay(value).replace(/^(\d+) (\S+)$/, (_, d: string, m: string) => `${d} ${capitalize(m)}`);
  return `${day} - ${formatTime(value)}`;
}

/** Fecha `YYYY-MM-DD` + hora `HH:mm` → ISO en hora de Costa Rica (UTC-6). */
export function buildDepartureAt(isoDate: string, time: string): string {
  return `${isoDate}T${time}:00-06:00`;
}

/** Métodos de pago del catálogo según su nombre (los íconos dependen del método). */
export function paymentKind(name: string): 'efectivo' | 'sinpe' | 'gratuito' | 'otro' {
  const normalized = name.toLowerCase();
  if (normalized.includes('efectivo')) return 'efectivo';
  if (normalized.includes('sinpe')) return 'sinpe';
  if (normalized.includes('gratuito')) return 'gratuito';
  return 'otro';
}
