// Tipos compartidos. Provisional: confirmar formatos con el equipo de Backend.

/** Identificador de una entidad. */
export type Id = string;

/** Fecha y hora en formato ISO 8601 (por ejemplo `2026-10-25T06:30:00-06:00`). */
export type IsoDateTime = string;

/** Fecha en formato `YYYY-MM-DD`. */
export type IsoDate = string;

/** Monto en colones (entero). Un monto de 0 indica un viaje gratuito. */
export type Colones = number;

/** Lugar con nombre y una descripción opcional (dirección o referencia). */
export type Place = {
  name: string;
  detail?: string;
};

/** Referencia a una opción del catálogo "Métodos de Pago". */
export type PaymentMethodRef = {
  id: Id;
  name: string;
};
