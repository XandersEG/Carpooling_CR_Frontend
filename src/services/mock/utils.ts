/** Latencia simulada para que las pantallas muestren sus estados de carga. */
export const MOCK_LATENCY_MS = 300;

export function delay(ms: number = MOCK_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Copia profunda para que las pantallas no modifiquen los datos simulados. */
export function clone<T>(value: T): T {
  // `respond(undefined)` (p. ej. al eliminar): JSON.parse(undefined) lanzaría un error.
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Devuelve una copia del resultado después de la latencia simulada. */
export async function respond<T>(value: T): Promise<T> {
  await delay();
  return clone(value);
}

export function notFound(entity: string, id: string): Error {
  return new Error(`${entity} no encontrado: ${id}`);
}
