import type { Id, IsoDate } from '@/src/types/common';
import type { Role } from '@/src/types/user';
import type { Vehicle } from '@/src/types/vehicle';

// ── Instituciones ────────────────────────────────────────────────────────────

/**
 * Estado de validación del correo institucional, según la columna "Validación":
 * - `validada`: casilla marcada.
 * - `sin_validar`: botón "Validar" (aún no se envía el correo).
 * - `pendiente`: botón "Reenviar" (correo enviado, esperando confirmación).
 * Las instituciones inactivas muestran "N/A".
 */
export type InstitutionValidationStatus = 'validada' | 'sin_validar' | 'pendiente';

export type Institution = {
  id: Id;
  name: string;
  email: string;
  validationStatus: InstitutionValidationStatus;
  active: boolean;
};

export type InstitutionInput = Pick<Institution, 'name' | 'email'>;

// ── Usuarios ─────────────────────────────────────────────────────────────────

export type AdminUserSummary = {
  id: Id;
  fullName: string;
  active: boolean;
};

export type AdminTripHistoryEntry = {
  id: Id;
  date: IsoDate;
  /** Ruta en texto ("Cartago → TEC, Cartago"). */
  route: string;
  role: Role;
  status: 'completado' | 'cancelado';
};

export type AdminUserDetail = AdminUserSummary & {
  academicId: string;
  email: string;
  phone: string;
  institutionName: string;
  isAdmin: boolean;
  vehicles: Vehicle[];
  activity: {
    completedTrips: number;
    asDriver: number;
    asPassenger: number;
    history: AdminTripHistoryEntry[];
  };
};

// ── Parámetros (catálogos) ───────────────────────────────────────────────────

export type CatalogKey =
  | 'metodos-pago'
  | 'tipos-vehiculo'
  | 'rangos-edad'
  | 'opciones-genero'
  | 'reglas-tarifas';

type CatalogItemBase = {
  id: Id;
  name: string;
  /** Si está inactivo, no aparece como opción en la app ni en el portal. */
  active: boolean;
};

export type PaymentMethodItem = CatalogItemBase & { description: string };

export type VehicleTypeItem = CatalogItemBase & { maxCapacity: number; description: string };

/** `maxAge` nulo significa "Sin límite". */
export type AgeRangeItem = CatalogItemBase & { minAge: number; maxAge: number | null };

export type GenderOptionItem = CatalogItemBase & { registeredUsers?: number };

export type RuleItem = CatalogItemBase & { value: number; unit: string; description: string };

export type CatalogItemMap = {
  'metodos-pago': PaymentMethodItem;
  'tipos-vehiculo': VehicleTypeItem;
  'rangos-edad': AgeRangeItem;
  'opciones-genero': GenderOptionItem;
  'reglas-tarifas': RuleItem;
};

export type CatalogItem<K extends CatalogKey = CatalogKey> = CatalogItemMap[K];

export type CatalogItemInput<K extends CatalogKey> = Omit<CatalogItemMap[K], 'id'>;
